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
    if (counts[cid] > 3) {
      return { ok: false, reason: "同じカードは1デッキに3枚までです。" };
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
          hasDeck: Array.isArray(lobby.hostDeck) && lobby.hostDeck.length === 20,
        },
        {
          nickname: "ゲスト",
          ready: lobby.guestReady,
          hasDeck: Array.isArray(lobby.guestDeck) && lobby.guestDeck.length === 20,
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
      turnIndex: Math.floor(Math.random() * 2),
      turnNumber: 1,
    };
    Engine.startTurn(game, game.turnIndex);
    emitGameBoth();
  }

  function handleGuestAction(msg) {
    if (!game) return;
    if (msg.t === "playCard") {
      const res = Engine.playCard(game, guestSlot, msg.handIndex | 0, cardById);
      if (!res.ok) {
        broadcastDown({ t: "actionError", message: res.reason });
        return;
      }
      emitGameBoth();
      if (res.winnerIndex !== undefined) {
        broadcastDown({ t: "gameOver", winnerSlot: res.winnerIndex });
        game = null;
        onGameOver({ winnerSlot: res.winnerIndex });
      }
      return;
    }
    if (msg.t === "endTurn") {
      if (game.turnIndex !== guestSlot) {
        broadcastDown({ t: "actionError", message: "あなたのターンではありません。" });
        return;
      }
      Engine.endTurn(game);
      emitGameBoth();
    }
  }

  function handleHostLocalAction(msg) {
    if (!game) return;
    if (msg.t === "playCard") {
      const res = Engine.playCard(game, hostSlot, msg.handIndex | 0, cardById);
      if (!res.ok) {
        onActionError({ message: res.reason });
        return;
      }
      emitGameBoth();
      if (res.winnerIndex !== undefined) {
        broadcastDown({ t: "gameOver", winnerSlot: res.winnerIndex });
        game = null;
        onGameOver({ winnerSlot: res.winnerIndex });
      }
      return;
    }
    if (msg.t === "endTurn") {
      if (game.turnIndex !== hostSlot) {
        onActionError({ message: "あなたのターンではありません。" });
        return;
      }
      Engine.endTurn(game);
      emitGameBoth();
    }
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
        lobby.guestReady = false;
        emitLobby();
        return;
      }
      if (msg.t === "setReady") {
        lobby.guestReady = !!msg.ready;
        emitLobby();
        tryStartGameHost();
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
        lobby.hostReady = !!ready;
        emitLobby();
        tryStartGameHost();
      } else if (uplinkStream) {
        uplinkStream.write(JSON.stringify({ t: "setReady", ready: !!ready }));
      }
    },
    playCard(handIndex) {
      if (role === "host") {
        handleHostLocalAction({ t: "playCard", handIndex });
      } else if (uplinkStream) {
        uplinkStream.write(JSON.stringify({ t: "playCard", handIndex }));
      }
    },
    endTurn() {
      if (role === "host") {
        handleHostLocalAction({ t: "endTurn" });
      } else if (uplinkStream) {
        uplinkStream.write(JSON.stringify({ t: "endTurn" }));
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
