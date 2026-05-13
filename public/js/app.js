const COST_MARK = ["", "①", "②", "③", "④", "⑤"];

const LS_DECK_LEGACY = "scg_deck_v1";
const LS_DECKS = "scg_decks_v1";
const LS_EDITOR_DECK = "scg_editor_deck_id";
const LS_LOBBY_DECK = "scg_lobby_deck_id";
const MAX_SAVED_DECKS = 16;

let catalogById = {};
let initialDeckIds = [];
let currentDeck = [];
let lastGameYouAre = 0;
let lobbyCatalogLoaded = false;

let skywaySession = null;

function assetBase() {
  const baseHref = document.querySelector("base")?.href;
  if (baseHref) {
    return baseHref.endsWith("/") ? baseHref : `${baseHref}/`;
  }
  const p = window.__SCG_BASE__;
  if (typeof p === "string" && p.length) {
    return p.endsWith("/") ? p : `${p}/`;
  }
  return new URL("./", window.location.href).href;
}

function resolveUrl(rel) {
  try {
    return new URL(rel, assetBase()).href;
  } catch {
    return rel;
  }
}

/** 常に同一オリジンの SkyWay トークン API */
function skyWayTokenUrl() {
  return resolveUrl("api/skyway-token");
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
  if (!skywaySession) {
    toast("接続がありません");
    return;
  }
  skywaySession.playCard(handIndex);
}

function endTurnAction() {
  if (!skywaySession) {
    toast("接続がありません");
    return;
  }
  skywaySession.endTurn();
}

function sendDeckToServer(cardIds) {
  if (!skywaySession) {
    toast("接続がありません");
    return;
  }
  skywaySession.setDeck(cardIds);
}

function sendReadyToServer(ready) {
  if (!skywaySession) {
    toast("接続がありません");
    return;
  }
  skywaySession.setReady(ready);
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

function makeCardFace(card, { wide, mini } = {}) {
  const root = document.createElement("div");
  if (wide) root.className = "card-face wide";
  else if (mini) root.className = "card-face mini";
  else root.className = "card-face";
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

function newDeckId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `d_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadDecksListRaw() {
  try {
    const raw = localStorage.getItem(LS_DECKS);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveDecksListRaw(decks) {
  localStorage.setItem(LS_DECKS, JSON.stringify(decks));
}

function migrateLegacyDeckIfNeeded() {
  if (loadDecksListRaw().length > 0) return;
  try {
    const raw = localStorage.getItem(LS_DECK_LEGACY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.length === 20) {
      const id = newDeckId();
      saveDecksListRaw([{ id, name: "デッキ1", cardIds: arr }]);
      localStorage.setItem(LS_EDITOR_DECK, id);
      localStorage.removeItem(LS_DECK_LEGACY);
    }
  } catch {
    /* ignore */
  }
}

function loadDecksList() {
  migrateLegacyDeckIfNeeded();
  let decks = loadDecksListRaw();
  if (decks.length === 0 && initialDeckIds.length === 20) {
    const id = newDeckId();
    decks = [{ id, name: "初期コピー", cardIds: initialDeckIds.slice() }];
    saveDecksListRaw(decks);
    localStorage.setItem(LS_EDITOR_DECK, id);
  }
  return decks;
}

function getEditorDeckId() {
  const decks = loadDecksList();
  const id = localStorage.getItem(LS_EDITOR_DECK);
  if (id && decks.some((d) => d.id === id)) return id;
  return decks[0]?.id || "";
}

function setEditorDeckId(id) {
  if (id) localStorage.setItem(LS_EDITOR_DECK, id);
}

function fillDeckEditorSelect() {
  const sel = document.getElementById("deck-editor-select");
  if (!sel) return;
  const cur = getEditorDeckId();
  sel.textContent = "";
  for (const d of loadDecksList()) {
    const op = document.createElement("option");
    op.value = d.id;
    op.textContent = d.name;
    sel.appendChild(op);
  }
  if (cur && [...sel.options].some((o) => o.value === cur)) {
    sel.value = cur;
  } else if (sel.options[0]) {
    sel.value = sel.options[0].value;
    setEditorDeckId(sel.value);
  }
}

function fillLobbyDeckSelect() {
  const sel = document.getElementById("select-lobby-deck");
  if (!sel) return;
  sel.textContent = "";
  const optInit = document.createElement("option");
  optInit.value = "__initial__";
  optInit.textContent = "初期デッキ";
  sel.appendChild(optInit);
  for (const d of loadDecksList()) {
    const op = document.createElement("option");
    op.value = d.id;
    op.textContent = d.name;
    sel.appendChild(op);
  }
  const saved = localStorage.getItem(LS_LOBBY_DECK);
  if (saved && [...sel.options].some((o) => o.value === saved)) {
    sel.value = saved;
  } else {
    const first = loadDecksList()[0]?.id;
    sel.value = first || "__initial__";
  }
}

function lobbyChosenDeckIds() {
  const sel = document.getElementById("select-lobby-deck");
  const v = sel?.value;
  if (v === "__initial__") {
    return initialDeckIds.length === 20 ? initialDeckIds.slice() : null;
  }
  const d = loadDecksList().find((x) => x.id === v);
  if (!d?.cardIds || d.cardIds.length !== 20) return null;
  return d.cardIds.slice();
}

/** 互換: 先頭の保存デッキの cardIds */
function loadSavedDeck() {
  const d = loadDecksList()[0];
  if (d?.cardIds?.length === 20) return d.cardIds.slice();
  return null;
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
  let ids = lobbyChosenDeckIds();
  if (!ids || ids.length !== 20) {
    const saved = loadSavedDeck();
    ids =
      saved?.length === 20
        ? saved
        : initialDeckIds.length === 20
          ? initialDeckIds.slice()
          : null;
  }
  if (ids?.length === 20) {
    const v = validateDeckClient(ids);
    if (v.ok) {
      sendDeckToServer(ids);
    }
  }
}

let lastBattleLogSeq = 0;
let lastSelfAttack = -1;
let lastOppAttack = -1;

function renderBattleLog(entries, youAre) {
  const box = $("#battle-log");
  if (!box) return;
  box.textContent = "";
  let maxSeq = lastBattleLogSeq;
  for (const e of entries || []) {
    if (e.seq > maxSeq) maxSeq = e.seq;
    const row = document.createElement("div");
    row.className = "log-row";
    const who =
      e.slot === null
        ? ""
        : e.slot === youAre
          ? "あなた › "
          : "相手 › ";
    row.textContent = `${who}${e.text}`;
    if (e.kind === "clash") row.classList.add("log-clash");
    else if (e.kind === "system") row.classList.add("log-sys");
    else if (e.kind === "negate") row.classList.add("log-neg");
    else if (e.slot === youAre) row.classList.add("log-you");
    else if (e.slot !== null) row.classList.add("log-opp");
    if (e.seq > lastBattleLogSeq) row.classList.add("flash");
    box.appendChild(row);
  }
  lastBattleLogSeq = maxSeq;
  box.scrollTop = box.scrollHeight;
}

function onGameState(state) {
  showScreen("screen-game");
  lastGameYouAre = state.youAre;
  $("#opp-hp").textContent = String(state.opponent.hp);
  $("#self-hp").textContent = String(state.you.hp);
  $("#opp-hand").textContent = String(
    state.opponent.handCount ?? state.opponent.hand?.length ?? 0
  );
  $("#opp-deck").textContent = String(state.opponent.deckCount);
  $("#opp-disc").textContent = String(state.opponent.discardCount);
  $("#self-deck").textContent = String(state.you.deckCount);
  $("#self-disc").textContent = String(state.you.discardCount);
  $("#turn-no").textContent = String(state.roundNumber);

  const oStock = String(state.opponent.attackStock | 0);
  const sStock = String(state.you.attackStock | 0);
  $("#opp-attack-stock").textContent = oStock;
  $("#self-attack-stock").textContent = sStock;

  const oa = $("#opp-attack-stock");
  const sa = $("#self-attack-stock");
  if ((state.opponent.attackStock | 0) > lastOppAttack) {
    oa.classList.add("pulse");
    clearTimeout(oa._ptm);
    oa._ptm = setTimeout(() => oa.classList.remove("pulse"), 480);
  }
  if ((state.you.attackStock | 0) > lastSelfAttack) {
    sa.classList.add("pulse");
    clearTimeout(sa._ptm);
    sa._ptm = setTimeout(() => sa.classList.remove("pulse"), 480);
  }
  lastOppAttack = state.opponent.attackStock | 0;
  lastSelfAttack = state.you.attackStock | 0;

  $("#cost-current").textContent = String(state.you.costPool);
  $("#cost-max").textContent = String(
    state.you.maxCost ?? state.you.costPool
  );

  const myLock = !!state.you.roundLocked;
  const opLock = !!state.opponent.roundLocked;
  const badgeSelf = $("#self-lock-badge");
  const badgeOpp = $("#opp-lock-badge");
  if (badgeSelf) {
    badgeSelf.hidden = !myLock;
  }
  if (badgeOpp) {
    badgeOpp.hidden = !opLock;
  }

  const banner = $("#turn-banner");
  if (myLock && opLock) {
    banner.textContent = "双方確定 — 交戦を解決中";
  } else if (myLock) {
    banner.textContent = "あなたは確定済み（相手の行動・確定待ち）";
  } else {
    banner.textContent = "同時行動 — カードを使い、準備ができたら確定";
  }
  banner.classList.toggle("wait", myLock);

  $("#cost-bar").classList.toggle("wait", myLock);

  const oppStrip = $("#opp-hand-cards");
  if (oppStrip) {
    oppStrip.textContent = "";
    const oh = state.opponent.hand || [];
    for (const c of oh) {
      oppStrip.appendChild(makeCardFace(c, { mini: true }));
    }
  }

  renderBattleLog(state.battleLog, state.youAre);

  const canPlay = !myLock;
  const hand = $("#hand");
  hand.textContent = "";
  state.you.hand.forEach((card, idx) => {
    const el = makeCardFace(card);
    el.dataset.index = String(idx);
    const affordable = canPlay && (card.cost | 0) <= state.you.costPool;
    if (!affordable) el.classList.add("disabled");
    if (canPlay && affordable) {
      el.addEventListener("click", () => {
        playCardAction(idx);
      });
    }
    hand.appendChild(el);
  });

  const btn = $("#btn-end-turn");
  btn.disabled = myLock;
  btn.textContent = myLock ? "確定済み" : "このラウンドを確定";
}

function onGameOver(payload) {
  lastBattleLogSeq = 0;
  lastSelfAttack = -1;
  lastOppAttack = -1;
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
      if (window.SCG_cardBalance?.assertNoStrictDominance) {
        window.SCG_cardBalance.assertNoStrictDominance(catalogById);
      }
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
  if (window.SCG_cardBalance?.assertNoStrictDominance) {
    window.SCG_cardBalance.assertNoStrictDominance(catalogById);
  }
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
    try {
      await fetchCatalog();
    } catch {
      toast("カードデータの読み込みに失敗しました");
      return;
    }
    const tokenUrl = skyWayTokenUrl();
    const code = randomRoomCode();
    const roomName = `scg_${code}`;
    toast("SkyWay に接続中…");
    try {
      const { createSkyWayP2P } = await loadSkyWayModule();
      skywaySession = createSkyWayP2P({
        tokenUrl,
        roomName,
        role: "host",
        cardById: catalogById,
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
      fillLobbyDeckSelect();
      autoSendDeckIfPossible();
    } catch (e) {
      console.error(e);
      toast(String(e.message || e));
      await disposeSkyWay();
    }
  });

  $("#btn-join-room").addEventListener("click", async () => {
    const code = $("#input-room-code").value.trim().toUpperCase();
    if (code.length !== 6) {
      toast("6桁のルームコードを入力してください");
      return;
    }
    try {
      await fetchCatalog();
    } catch {
      toast("カードデータの読み込みに失敗しました");
      return;
    }
    const tokenUrl = skyWayTokenUrl();
    const roomName = `scg_${code}`;
    toast("SkyWay に接続中…");
    try {
      const { createSkyWayP2P } = await loadSkyWayModule();
      skywaySession = createSkyWayP2P({
        tokenUrl,
        roomName,
        role: "guest",
        cardById: catalogById,
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
      fillLobbyDeckSelect();
      skywaySession._autoDeckOnce = true;
    } catch (e) {
      console.error(e);
      toast(String(e.message || e));
      await disposeSkyWay();
    }
  });

  $("#btn-leave-lobby").addEventListener("click", async () => {
    await disposeSkyWay();
    showScreen("screen-online-menu");
  });

  $("#btn-use-saved-deck").addEventListener("click", () => {
    const sel = $("#select-lobby-deck");
    if (sel?.value === "__initial__") {
      toast("上のリストから保存デッキを選んでください");
      return;
    }
    const ids = lobbyChosenDeckIds();
    if (!ids) {
      toast("保存されたデッキがありません");
      return;
    }
    const v = validateDeckClient(ids);
    if (!v.ok) {
      toast(v.reason);
      return;
    }
    sendDeckToServer(ids);
    toast("保存デッキを送信しました");
  });

  $("#select-lobby-deck")?.addEventListener("change", (e) => {
    localStorage.setItem(LS_LOBBY_DECK, e.target.value);
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
    await disposeSkyWay();
    showScreen("screen-title");
  });

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
    const id = getEditorDeckId();
    const inp = $("#deck-name-input");
    const nameRaw = (inp?.value || "").trim();
    const name = nameRaw.length ? nameRaw.slice(0, 24) : "無題デッキ";
    const decks = loadDecksList();
    const idx = decks.findIndex((d) => d.id === id);
    if (idx < 0) {
      toast("デッキが見つかりません");
      return;
    }
    decks[idx] = { ...decks[idx], name, cardIds: currentDeck.slice() };
    saveDecksListRaw(decks);
    fillDeckEditorSelect();
    syncDeckNameInput();
    toast("デッキを保存しました");
    renderDeckBuilder();
  });

  $("#deck-editor-select")?.addEventListener("change", (e) => {
    setEditorDeckId(e.target.value);
    syncDeckNameInput();
    const d = loadDecksList().find((x) => x.id === e.target.value);
    currentDeck =
      d?.cardIds?.length === 20
        ? d.cardIds.slice()
        : initialDeckIds.length === 20
          ? initialDeckIds.slice()
          : [];
    renderDeckBuilder();
  });

  $("#btn-deck-new")?.addEventListener("click", () => {
    const decks = loadDecksList();
    if (decks.length >= MAX_SAVED_DECKS) {
      toast(`保存は${MAX_SAVED_DECKS}個までです`);
      return;
    }
    const id = newDeckId();
    const base =
      initialDeckIds.length === 20 ? initialDeckIds.slice() : [];
    decks.push({ id, name: `新規デッキ${decks.length + 1}`, cardIds: base });
    saveDecksListRaw(decks);
    setEditorDeckId(id);
    fillDeckEditorSelect();
    syncDeckNameInput();
    currentDeck = base.slice();
    renderDeckBuilder();
    toast("新規デッキを作成しました");
  });

  $("#btn-deck-delete")?.addEventListener("click", () => {
    const decks = loadDecksList();
    if (decks.length <= 1) {
      toast("最後の1つは削除できません");
      return;
    }
    const id = getEditorDeckId();
    const next = decks.filter((d) => d.id !== id);
    saveDecksListRaw(next);
    setEditorDeckId(next[0].id);
    fillDeckEditorSelect();
    syncDeckNameInput();
    const d = next[0];
    currentDeck =
      d?.cardIds?.length === 20
        ? d.cardIds.slice()
        : initialDeckIds.length === 20
          ? initialDeckIds.slice()
          : [];
    renderDeckBuilder();
  });
}

function syncDeckNameInput() {
  const inp = $("#deck-name-input");
  if (!inp) return;
  const id = getEditorDeckId();
  const d = loadDecksList().find((x) => x.id === id);
  inp.value = d?.name || "";
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
  loadDecksList();
  fillDeckEditorSelect();
  syncDeckNameInput();
  const id = getEditorDeckId();
  const d = loadDecksList().find((x) => x.id === id);
  currentDeck =
    d?.cardIds?.length === 20
      ? d.cardIds.slice()
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
    /* 初回は静的データへフォールバック可能 */
  }
});
