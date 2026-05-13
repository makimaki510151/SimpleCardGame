const COST_MARK = ["", "①", "②", "③", "④", "⑤"];

const LS_DECK = "scg_deck_v1";

let socket = null;
let catalogById = {};
let initialDeckIds = [];
let currentDeck = [];
let lastGameYouAre = 0;
let lobbyCatalogLoaded = false;

const LS_TOKEN_URL = "scg_skyway_token_url";

let skywaySession = null;
let currentTransport = "socket";

function assetBase() {
  return window.__SCG_BASE__ || "/";
}

function resolveUrl(rel) {
  return new URL(rel, assetBase()).href;
}

function getTransportMode() {
  const el = document.querySelector('input[name="transport"]:checked');
  return el?.value === "skyway" ? "skyway" : "socket";
}

function syncTransportUi() {
  const sky = getTransportMode() === "skyway";
  const hint = document.getElementById("skyway-token-hint");
  const inp = document.getElementById("input-skyway-token-url");
  if (hint) hint.hidden = !sky;
  if (inp) {
    inp.hidden = !sky;
    if (sky) {
      const saved = localStorage.getItem(LS_TOKEN_URL);
      if (saved) inp.value = saved;
      else if (!inp.value) inp.value = resolveUrl("api/skyway-token");
    }
  }
}

function getSkyWayTokenUrl() {
  const inp = document.getElementById("input-skyway-token-url");
  const v = (inp?.value || "").trim();
  return v || resolveUrl("api/skyway-token");
}

function randomRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

async function loadSkyWayModule() {
  const url = resolveUrl("js/skyway-net.bundle.js");
  return import(url);
}

async function disposeSkyWay() {
  if (!skywaySession) return;
  try {
    await skywaySession.dispose();
  } catch {
    /* ignore */
  }
  skywaySession = null;
}

function playCardAction(handIndex) {
  if (skywaySession) {
    skywaySession.playCard(handIndex);
  } else {
    const s = ensureSocket();
    if (s) s.emit("playCard", { handIndex });
  }
}

function endTurnAction() {
  if (skywaySession) {
    skywaySession.endTurn();
  } else {
    const s = ensureSocket();
    if (s) s.emit("endTurn");
  }
}

function sendDeckToServer(cardIds) {
  if (skywaySession) {
    skywaySession.setDeck(cardIds);
  } else {
    const s = ensureSocket();
    if (s) s.emit("setDeck", { cardIds });
  }
}

function sendReadyToServer(ready) {
  if (skywaySession) {
    skywaySession.setReady(ready);
  } else {
    const s = ensureSocket();
    if (s) s.emit("setReady", { ready });
  }
}

const $ = (sel) => document.querySelector(sel);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.toggle("active", s.id === id);
  });
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._tm);
  toast._tm = setTimeout(() => {
    t.hidden = true;
  }, 3200);
}

function renderCardBody(container, card) {
  container.textContent = "";
  const parts = card.body || [];
  for (const seg of parts) {
    const span = document.createElement("span");
    span.textContent = seg.t;
    span.className = `seg-${seg.c || "muted"}`;
    container.appendChild(span);
  }
}

function makeCardFace(card, { wide } = {}) {
  const root = document.createElement("div");
  root.className = wide ? "card-face wide" : "card-face";
  const cost = document.createElement("div");
  cost.className = "card-cost";
  const c = Math.min(5, Math.max(0, card.cost | 0));
  cost.textContent = COST_MARK[c] || String(c);
  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = card.name || card.id;
  const body = document.createElement("div");
  body.className = "card-body";
  renderCardBody(body, card);
  root.append(cost, title, body);
  return root;
}

function loadSavedDeck() {
  try {
    const raw = localStorage.getItem(LS_DECK);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.length === 20) return arr;
  } catch {
    /* ignore */
  }
  return null;
}

function saveDeck(ids) {
  localStorage.setItem(LS_DECK, JSON.stringify(ids));
}

function validateDeckClient(ids) {
  if (!Array.isArray(ids) || ids.length !== 20) {
    return { ok: false, reason: "デッキはちょうど20枚である必要があります。" };
  }
  const counts = {};
  for (const cid of ids) {
    if (!catalogById[cid]) {
      return { ok: false, reason: `不明なカード: ${cid}` };
    }
    counts[cid] = (counts[cid] || 0) + 1;
    if (counts[cid] > 3) {
      return { ok: false, reason: "同じカードは1デッキに3枚までです。" };
    }
  }
  return { ok: true };
}

function wireSocket(s) {
  s.on("roomJoined", onRoomJoined);
  s.on("roomUpdate", onRoomUpdate);
  s.on("roomError", (p) => toast(p.message || "エラー"));
  s.on("deckError", (p) => toast(p.message || "デッキエラー"));
  s.on("actionError", (p) => toast(p.message || "操作エラー"));
  s.on("gameState", onGameState);
  s.on("gameOver", onGameOver);
  s.on("opponentLeft", () => {
    toast("相手が退出しました");
    showScreen("screen-online-menu");
  });
}

function ensureSocket() {
  if (typeof io === "undefined") {
    toast(
      "Socket.io が使えません。静的ホスティングでは「SkyWay」を選ぶか、npm start でサーバーを起動してください。"
    );
    return null;
  }
  if (!socket) {
    socket = io({ transports: ["websocket", "polling"] });
    wireSocket(socket);
  }
  return socket;
}

function onRoomJoined(payload) {
  showScreen("screen-lobby");
  $("#lobby-code").textContent = payload.code;
  $("#chk-ready").checked = false;
  if (payload.catalog?.cards) {
    for (const c of payload.catalog.cards) {
      catalogById[c.id] = c;
    }
    initialDeckIds = payload.catalog.initialDeck?.slice() || initialDeckIds;
    lobbyCatalogLoaded = true;
  }
  renderLobbyPlayers(payload.players || []);
  autoSendDeckIfPossible();
}

function onRoomUpdate(payload) {
  renderLobbyPlayers(payload.players || []);
}

function onSkyWayLobby(msg) {
  if (msg.catalog?.cards) {
    for (const c of msg.catalog.cards) {
      catalogById[c.id] = c;
    }
    initialDeckIds = msg.catalog.initialDeck?.slice() || initialDeckIds;
    lobbyCatalogLoaded = true;
  }
  renderLobbyPlayers(msg.players || []);
  if (
    skywaySession?._autoDeckOnce &&
    Array.isArray(msg.catalog?.cards) &&
    msg.catalog.cards.length > 0
  ) {
    skywaySession._autoDeckOnce = false;
    autoSendDeckIfPossible();
  }
}

function renderLobbyPlayers(players) {
  const ul = $("#lobby-players");
  ul.textContent = "";
  players.forEach((p, i) => {
    const li = document.createElement("li");
    const left = document.createElement("strong");
    left.textContent = `プレイヤー ${i + 1}`;
    const right = document.createElement("span");
    const bits = [];
    if (p.hasDeck) bits.push("デッキOK");
    else bits.push("デッキ未送信");
    if (p.ready) bits.push("準備OK");
    right.textContent = bits.join(" · ");
    li.append(left, right);
    ul.appendChild(li);
  });
}

function autoSendDeckIfPossible() {
  const saved = loadSavedDeck();
  const ids = saved?.length === 20 ? saved : initialDeckIds;
  if (ids?.length === 20) {
    const v = validateDeckClient(ids);
    if (v.ok) {
      sendDeckToServer(ids);
    }
  }
}

function onGameState(state) {
  showScreen("screen-game");
  lastGameYouAre = state.youAre;
  $("#opp-hp").textContent = String(state.opponent.hp);
  $("#self-hp").textContent = String(state.you.hp);
  $("#opp-hand").textContent = String(state.opponent.handCount);
  $("#opp-deck").textContent = String(state.opponent.deckCount);
  $("#opp-disc").textContent = String(state.opponent.discardCount);
  $("#self-deck").textContent = String(state.you.deckCount);
  $("#self-disc").textContent = String(state.you.discardCount);
  $("#turn-no").textContent = String(state.turnNumber);
  $("#cost-current").textContent = String(state.you.costPool);
  const yourTurn = state.turnIndex === state.youAre;
  const banner = $("#turn-banner");
  banner.textContent = yourTurn ? "あなたのターン" : "相手のターン";
  banner.classList.toggle("wait", !yourTurn);
  $("#btn-end-turn").disabled = !yourTurn;
  $("#cost-bar").classList.toggle("wait", !yourTurn);

  const hand = $("#hand");
  hand.textContent = "";
  state.you.hand.forEach((card, idx) => {
    const el = makeCardFace(card);
    el.dataset.index = String(idx);
    const affordable = yourTurn && (card.cost | 0) <= state.you.costPool;
    if (!affordable) el.classList.add("disabled");
    if (yourTurn && affordable) {
      el.addEventListener("click", () => {
        playCardAction(idx);
      });
    }
    hand.appendChild(el);
  });
}

function onGameOver(payload) {
  const youWin = payload.winnerSlot === lastGameYouAre;
  showScreen("screen-result");
  $("#result-title").textContent = youWin ? "勝利！" : "敗北…";
  let msg = youWin ? "相手のHPを0にしました。" : "あなたのHPが0になりました。";
  if (payload.reason === "disconnect") {
    msg = youWin
      ? "相手が切断したため勝利しました。"
      : "切断により対戦が終了しました。";
  }
  $("#result-msg").textContent = msg;
}

async function fetchCatalog() {
  const api = resolveUrl("api/cards");
  try {
    const res = await fetch(api);
    if (res.ok) {
      const data = await res.json();
      catalogById = {};
      for (const c of data.cards) {
        catalogById[c.id] = c;
      }
      initialDeckIds = data.initialDeck?.slice() || [];
      return;
    }
  } catch {
    /* 静的ホストへフォールバック */
  }
  const man = await fetch(resolveUrl("data/cards/manifest.json")).then((r) => {
    if (!r.ok) throw new Error("manifest");
    return r.json();
  });
  const cards = [];
  for (const id of man.cardIds) {
    const c = await fetch(resolveUrl(`data/cards/${id}.json`)).then((r) => {
      if (!r.ok) throw new Error(id);
      return r.json();
    });
    cards.push(c);
  }
  catalogById = {};
  for (const c of cards) {
    catalogById[c.id] = c;
  }
  const init = await fetch(resolveUrl("data/initial-deck.json")).then((r) => {
    if (!r.ok) throw new Error("initial");
    return r.json();
  });
  initialDeckIds = init.cardIds.slice();
}

function renderDeckBuilder() {
  const slots = $("#deck-slots");
  const grid = $("#catalog-grid");
  slots.textContent = "";
  grid.textContent = "";

  currentDeck.forEach((id, idx) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "deck-chip";
    chip.textContent = `${catalogById[id]?.name || id} ×`;
    chip.addEventListener("click", () => {
      currentDeck.splice(idx, 1);
      renderDeckBuilder();
    });
    slots.appendChild(chip);
  });

  const ids = Object.keys(catalogById).sort();
  for (const id of ids) {
    const card = catalogById[id];
    const face = makeCardFace(card, { wide: true });
    face.addEventListener("click", () => {
      const counts = {};
      for (const x of currentDeck) counts[x] = (counts[x] || 0) + 1;
      if ((counts[id] || 0) >= 3) {
        toast("同じカードは3枚までです");
        return;
      }
      if (currentDeck.length >= 20) {
        toast("20枚までです");
        return;
      }
      currentDeck.push(id);
      renderDeckBuilder();
    });
    grid.appendChild(face);
  }

  $("#deck-count").textContent = String(currentDeck.length);
  const st = $("#deck-status");
  const v = validateDeckClient(currentDeck);
  if (currentDeck.length === 0) {
    st.textContent = "";
    st.className = "deck-status";
  } else if (v.ok) {
    st.textContent = "（送信可能）";
    st.className = "deck-status ok";
  } else {
    st.textContent = `（${v.reason}）`;
    st.className = "deck-status bad";
  }
}

function wireUi() {
  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-go");
      if (target === "online") {
        showScreen("screen-online-menu");
      }
      if (target === "deck") {
        openDeckBuilder();
      }
    });
  });

  document.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const t = btn.getAttribute("data-back");
      if (t === "title") showScreen("screen-title");
    });
  });

  $("#btn-create-room").addEventListener("click", async () => {
    currentTransport = getTransportMode();
    if (currentTransport === "socket") {
      const s = ensureSocket();
      if (s) s.emit("createRoom", {});
      return;
    }
    try {
      await fetchCatalog();
    } catch {
      toast("カードデータの読み込みに失敗しました");
      return;
    }
    const tokenUrl = getSkyWayTokenUrl();
    localStorage.setItem(LS_TOKEN_URL, tokenUrl);
    const code = randomRoomCode();
    const roomName = `scg_${code}`;
    toast("SkyWay に接続中…");
    try {
      const { createSkyWayP2P } = await loadSkyWayModule();
      skywaySession = createSkyWayP2P({
        tokenUrl,
        roomName,
        role: "host",
        cardById,
        initialDeckIds,
        onLobby: onSkyWayLobby,
        onGameState,
        onGameOver,
        onActionError: (p) => toast(p.message || "操作エラー"),
      });
      await skywaySession.start();
      showScreen("screen-lobby");
      $("#lobby-code").textContent = code;
      $("#chk-ready").checked = false;
      autoSendDeckIfPossible();
    } catch (e) {
      console.error(e);
      toast(String(e.message || e));
      await disposeSkyWay();
    }
  });

  $("#btn-join-room").addEventListener("click", async () => {
    currentTransport = getTransportMode();
    const code = $("#input-room-code").value.trim().toUpperCase();
    if (code.length !== 6) {
      toast("6桁のルームコードを入力してください");
      return;
    }
    if (currentTransport === "socket") {
      const s = ensureSocket();
      if (s) s.emit("joinRoom", { code });
      return;
    }
    try {
      await fetchCatalog();
    } catch {
      toast("カードデータの読み込みに失敗しました");
      return;
    }
    const tokenUrl = getSkyWayTokenUrl();
    localStorage.setItem(LS_TOKEN_URL, tokenUrl);
    const roomName = `scg_${code}`;
    toast("SkyWay に接続中…");
    try {
      const { createSkyWayP2P } = await loadSkyWayModule();
      skywaySession = createSkyWayP2P({
        tokenUrl,
        roomName,
        role: "guest",
        cardById,
        initialDeckIds,
        onLobby: onSkyWayLobby,
        onGameState,
        onGameOver,
        onActionError: (p) => toast(p.message || "操作エラー"),
      });
      await skywaySession.start();
      showScreen("screen-lobby");
      $("#lobby-code").textContent = code;
      $("#chk-ready").checked = false;
      skywaySession._autoDeckOnce = true;
    } catch (e) {
      console.error(e);
      toast(String(e.message || e));
      await disposeSkyWay();
    }
  });

  $("#btn-leave-lobby").addEventListener("click", async () => {
    if (skywaySession) {
      await disposeSkyWay();
    } else {
      const s = ensureSocket();
      if (s) s.emit("leaveRoom");
    }
    showScreen("screen-online-menu");
  });

  $("#btn-use-saved-deck").addEventListener("click", () => {
    const saved = loadSavedDeck();
    if (!saved) {
      toast("保存されたデッキがありません");
      return;
    }
    const v = validateDeckClient(saved);
    if (!v.ok) {
      toast(v.reason);
      return;
    }
    sendDeckToServer(saved);
    toast("保存デッキを送信しました");
  });

  $("#btn-use-initial-deck").addEventListener("click", () => {
    if (initialDeckIds.length !== 20) {
      toast("初期デッキを読み込めません");
      return;
    }
    sendDeckToServer(initialDeckIds.slice());
    toast("初期デッキを送信しました");
  });

  $("#chk-ready").addEventListener("change", (e) => {
    sendReadyToServer(e.target.checked);
  });

  $("#btn-end-turn").addEventListener("click", () => {
    endTurnAction();
  });

  $("#btn-result-home").addEventListener("click", async () => {
    if (skywaySession) {
      await disposeSkyWay();
    } else {
      const s = ensureSocket();
      if (s) s.emit("leaveRoom");
    }
    showScreen("screen-title");
  });

  const skyTok = document.getElementById("input-skyway-token-url");
  if (skyTok) {
    skyTok.addEventListener("change", () => {
      localStorage.setItem(LS_TOKEN_URL, skyTok.value.trim());
    });
  }
  document.querySelectorAll('input[name="transport"]').forEach((r) => {
    r.addEventListener("change", syncTransportUi);
  });
  syncTransportUi();

  $("#btn-deck-clear").addEventListener("click", () => {
    currentDeck = [];
    renderDeckBuilder();
  });

  $("#btn-deck-save").addEventListener("click", () => {
    const v = validateDeckClient(currentDeck);
    if (!v.ok) {
      toast(v.reason);
      return;
    }
    saveDeck(currentDeck.slice());
    toast("デッキを保存しました");
    renderDeckBuilder();
  });
}

async function openDeckBuilder() {
  if (!Object.keys(catalogById).length) {
    try {
      await fetchCatalog();
    } catch {
      toast("カード一覧の取得に失敗しました");
      return;
    }
  }
  const saved = loadSavedDeck();
  currentDeck =
    saved && saved.length === 20
      ? saved.slice()
      : initialDeckIds.length === 20
        ? initialDeckIds.slice()
        : [];
  showScreen("screen-deck");
  renderDeckBuilder();
}

window.addEventListener("DOMContentLoaded", async () => {
  wireUi();
  try {
    await fetchCatalog();
  } catch {
    /* オフライン表示はサーバー起動後に再試行 */
  }
});
