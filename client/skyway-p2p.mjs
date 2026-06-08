import {
  SkyWayContext,
  SkyWayRoom,
  LocalDataStream,
} from "@skyway-sdk/room";
import * as Engine from "./gameEngine.mjs";

const META_STATE = JSON.stringify({ scg: "state" });
const META_UPLINK = JSON.stringify({ scg: "uplink" });

function parsePayload(data) {
  const s = typeof data === "string" ? data : JSON.stringify(data);
  return JSON.parse(s);
}

function normalizeDiscardPicks(raw) {
  if (!Array.isArray(raw)) return undefined;
  const out = raw.map((x) => Number(x) | 0);
  return out.length ? out : undefined;
}

function validateDeck(cardIds, byId) {
  if (!Array.isArray(cardIds) || cardIds.length !== 20) {
    return { ok: false, reason: "デッキはちょうど20枚である必要があります。" };
  }
  const counts = {};
  for (const cid of cardIds) {
    if (!byId[cid]) {
      return { ok: false, reason: `不明なカード: ${cid}` };
    }
    counts[cid] = (counts[cid] || 0) + 1;
    if (counts[cid] > 2) {
      return { ok: false, reason: "同じカードは1デッキに2枚までです。" };
    }
  }
  return { ok: true };
}

function pubTag(pub) {
  try {
    if (!pub.metadata) return null;
    const o = JSON.parse(pub.metadata);
    return o.scg || null;
  } catch {
    return null;
  }
}

export function createSkyWayP2P({
  tokenUrl,
  roomName,
  role,
  cardById,
  initialDeckIds,
  onLobby,
  onGameState,
  onGameOver,
  onActionError,
}) {
  let context;
  let room;
  let me;
  let downStream;
  let uplinkStream;
  let game = null;
  const hostSlot = 0;
  const guestSlot = 1;

  const lobby = {
    hostDeck: null,
    guestDeck: null,
    hostReady: false,
    guestReady: false,
  };

  async function fetchToken() {
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || `token ${res.status}`);
    }
    const j = await res.json();
    if (!j.token) throw new Error("token missing");
    return j.token;
  }

  function broadcastDown(obj) {
    if (!downStream) return;
    downStream.write(JSON.stringify(obj));
  }

  function emitLobby() {
    const cards = Object.values(cardById);
    const msg = {
      t: "lobby",
      players: [
        {
          nickname: "ホスト",
          ready: lobby.hostReady,
          hasDeck: validateDeck(lobby.hostDeck, cardById).ok,
        },
        {
          nickname: "ゲスト",
          ready: lobby.guestReady,
          hasDeck: validateDeck(lobby.guestDeck, cardById).ok,
        },
      ],
      catalog: { initialDeck: initialDeckIds.slice(), cards },
    };
    broadcastDown(msg);
    if (role === "host") {
      onLobby(msg);
    }
  }

  function emitGameBoth() {
    if (!game) return;
    const s0 = Engine.publicSnapshot(game, 0, cardById);
    const s1 = Engine.publicSnapshot(game, 1, cardById);
    broadcastDown({ t: "gameState", snapshots: [s0, s1] });
    if (role === "host") {
      onGameState(s0);
    }
  }

  function tryStartGameHost() {
    if (game) return;
    const d0 = validateDeck(lobby.hostDeck, cardById);
    const d1 = validateDeck(lobby.guestDeck, cardById);
    if (!d0.ok || !d1.ok) return;
    if (!lobby.hostReady || !lobby.guestReady) return;
    game = {
      players: [
        Engine.createPlayerState(lobby.hostDeck),
        Engine.createPlayerState(lobby.guestDeck),
      ],
      turnNumber: 0,
      firstPlayer: hostSlot,
      activePlayer: null,
      log: [],
      _logSeq: 0,
    };
    Engine.startGame(game, hostSlot);
    emitGameBoth();
  }

  /** 同時操作をクライアント時刻順に整列してから適用（ログと結果の整合） */
  const actionQueue = [];

  function scheduleActionFlush() {
    if (actionQueue._flushPlanned) return;
    actionQueue._flushPlanned = true;
    queueMicrotask(() => {
      actionQueue._flushPlanned = false;
      flushActionQueue();
    });
  }

  function enqueueAction(slot, msg) {
    if (!game) return;
    const clientTs =
      typeof msg.clientTs === "number" && !Number.isNaN(msg.clientTs)
        ? msg.clientTs
        : Date.now();
    if (msg.t === "playCard") {
      actionQueue.push({
        slot,
        clientTs,
        t: "playCard",
        handIndex: msg.handIndex | 0,
        discardPicks: msg.discardPicks,
      });
    } else if (msg.t === "endTurn") {
      actionQueue.push({ slot, clientTs, t: "endTurn" });
    } else {
      return;
    }
    scheduleActionFlush();
  }

  function reportActionError(slot, reason) {
    if (slot === hostSlot) {
      onActionError({ message: reason });
    } else {
      broadcastDown({ t: "actionError", message: reason });
    }
  }

  function flushActionQueue() {
    if (!game || actionQueue.length === 0) return;
    actionQueue.sort(
      (a, b) => a.clientTs - b.clientTs || a.slot - b.slot
    );
    const batch = actionQueue.splice(0, actionQueue.length);
    let emitted = false;
    for (const item of batch) {
      if (!game) break;
      if (item.t === "playCard") {
        const res = Engine.playCard(
          game,
          item.slot,
          item.handIndex | 0,
          cardById
        );
        if (!res.ok) {
          reportActionError(item.slot, res.reason);
        } else {
          emitted = true;
          if (res.winnerIndex !== undefined) {
            emitGameBoth();
            broadcastDown({
              t: "gameOver",
              winnerSlot: res.winnerIndex,
            });
            game = null;
            onGameOver({ winnerSlot: res.winnerIndex });
            continue;
          }
        }
      } else if (item.t === "endTurn") {
        const res = Engine.endTurn(game, item.slot);
        if (!res.ok) {
          reportActionError(item.slot, res.reason);
        } else {
          emitted = true;
          const winner = game.players[0].hp <= 0 ? 1 : game.players[1].hp <= 0 ? 0 : null;
          if (winner !== null) {
            emitGameBoth();
            broadcastDown({ t: "gameOver", winnerSlot: winner });
            game = null;
            onGameOver({ winnerSlot: winner });
            continue;
          }
        }
      }
    }
    if (emitted && game) emitGameBoth();
  }

  function handleGuestAction(msg) {
    enqueueAction(guestSlot, msg);
  }

  function handleHostLocalAction(msg) {
    enqueueAction(hostSlot, msg);
  }

  function handleGuestDownlink(raw) {
    let msg;
    try {
      msg = parsePayload(raw);
    } catch {
      return;
    }
    if (msg.t === "lobby") {
      onLobby(msg);
      return;
    }
    if (msg.t === "gameState" && Array.isArray(msg.snapshots)) {
      onGameState(msg.snapshots[guestSlot]);
      return;
    }
    if (msg.t === "gameOver") {
      onGameOver(msg);
      return;
    }
    if (msg.t === "actionError") {
      onActionError({ message: msg.message });
    }
  }

  async function wireHostUplink(publication) {
    if (pubTag(publication) !== "uplink") return;
    if (publication.publisher.id === me.id) return;
    const { stream } = await me.subscribe(publication);
    stream.onData.add((d) => {
      let msg;
      try {
        msg = parsePayload(d);
      } catch {
        return;
      }
      if (msg.t === "setDeck") {
        const v = validateDeck(msg.cardIds, cardById);
        if (!v.ok) {
          broadcastDown({ t: "actionError", message: v.reason });
          return;
        }
        lobby.guestDeck = msg.cardIds.slice();
        emitLobby();
        tryStartGameHost();
        return;
      }
      if (msg.t === "setReady") {
        const want = !!msg.ready;
        if (want) {
          const gv = validateDeck(lobby.guestDeck, cardById);
          if (!gv.ok) {
            broadcastDown({ t: "actionError", message: gv.reason });
            return;
          }
        }
        lobby.guestReady = want;
        emitLobby();
        tryStartGameHost();
        return;
      }
      if (msg.t === "requestLobby") {
        emitLobby();
        return;
      }
      if (msg.t === "playCard" || msg.t === "endTurn") {
        handleGuestAction(msg);
      }
    });
  }

  async function subscribeToStatePub(publication) {
    if (pubTag(publication) !== "state") return;
    if (publication.publisher.id === me.id) return;
    const { stream } = await me.subscribe(publication);
    stream.onData.add(handleGuestDownlink);
  }

  async function connect() {
    const tokenString = await fetchToken();
    context = await SkyWayContext.Create(tokenString);
    context.onTokenUpdateReminder.add(async () => {
      try {
        const next = await fetchToken();
        await context.updateAuthToken(next);
      } catch {
        /* ignore */
      }
    });

    room = await SkyWayRoom.FindOrCreate(context, {
      type: "p2p",
      name: roomName,
    });

    if (role === "host") {
      me = await room.join({ name: "scg-host" });
      downStream = new LocalDataStream();
      await me.publish(downStream, {
        metadata: META_STATE,
        type: "p2p",
      });

      room.onStreamPublished.add(async ({ publication }) => {
        await wireHostUplink(publication);
        if (pubTag(publication) === "uplink") {
          setTimeout(() => emitLobby(), 60);
        }
      });

      for (const p of room.publications) {
        await wireHostUplink(p);
      }

      room.onMemberLeft.add(({ member }) => {
        if (member.name === "scg-guest") {
          broadcastDown({ t: "gameOver", winnerSlot: hostSlot, reason: "disconnect" });
          game = null;
          onGameOver({ winnerSlot: hostSlot, reason: "disconnect" });
        }
      });

      emitLobby();
    } else {
      me = await room.join({ name: "scg-guest" });
      uplinkStream = new LocalDataStream();
      await me.publish(uplinkStream, {
        metadata: META_UPLINK,
        type: "p2p",
      });

      for (const p of room.publications) {
        await subscribeToStatePub(p);
      }
      room.onStreamPublished.add(async ({ publication }) => {
        await subscribeToStatePub(publication);
      });

      const pingLobby = () => {
        if (uplinkStream) {
          uplinkStream.write(JSON.stringify({ t: "requestLobby" }));
        }
      };
      queueMicrotask(pingLobby);
      setTimeout(pingLobby, 400);

      room.onMemberLeft.add(({ member }) => {
        if (member.name === "scg-host") {
          onGameOver({ winnerSlot: guestSlot, reason: "disconnect" });
        }
      });
    }
  }

  return {
    role,
    async start() {
      await connect();
    },
    setDeck(cardIds) {
      if (role === "host") {
        const v = validateDeck(cardIds, cardById);
        if (!v.ok) {
          onActionError({ message: v.reason });
          return;
        }
        lobby.hostDeck = cardIds.slice();
        lobby.hostReady = false;
        emitLobby();
        tryStartGameHost();
      } else if (uplinkStream) {
        uplinkStream.write(JSON.stringify({ t: "setDeck", cardIds }));
      }
    },
    setReady(ready) {
      if (role === "host") {
        if (ready) {
          const hv = validateDeck(lobby.hostDeck, cardById);
          if (!hv.ok) {
            onActionError({ message: hv.reason });
            return;
          }
        }
        lobby.hostReady = !!ready;
        emitLobby();
        tryStartGameHost();
      } else if (uplinkStream) {
        uplinkStream.write(JSON.stringify({ t: "setReady", ready: !!ready }));
      }
    },
    playCard(handIndex, discardPicks) {
      const payload = {
        t: "playCard",
        handIndex,
        clientTs: Date.now(),
      };
      if (Array.isArray(discardPicks) && discardPicks.length > 0) {
        payload.discardPicks = discardPicks.map((x) => x | 0);
      }
      if (role === "host") {
        handleHostLocalAction(payload);
      } else if (uplinkStream) {
        uplinkStream.write(JSON.stringify(payload));
      }
    },
    endTurn() {
      const payload = { t: "endTurn", clientTs: Date.now() };
      if (role === "host") {
        handleHostLocalAction(payload);
      } else if (uplinkStream) {
        uplinkStream.write(JSON.stringify(payload));
      }
    },
    refreshLobbyCatalog() {
      if (role === "host") emitLobby();
    },
    async dispose() {
      try {
        await room?.dispose?.();
      } catch {
        /* ignore */
      }
      try {
        context?.dispose?.();
      } catch {
        /* ignore */
      }
      room = undefined;
      context = undefined;
    },
  };
}
