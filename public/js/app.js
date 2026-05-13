const LS_DECK_LEGACY = "scg_deck_v1";
const LS_DECKS = "scg_decks_v1";
const LS_EDITOR_DECK = "scg_editor_deck_id";
const LS_LOBBY_DECK = "scg_lobby_deck_id";
const MAX_SAVED_DECKS = 16;
const SS_DUEL_ZOOM_LG = "scg_duel_zoom_lg";

let catalogById = {};
let initialDeckIds = [];
let currentDeck = [];
let lastGameYouAre = 0;
let lobbyCatalogLoaded = false;

let skywaySession = null;
/** 直近の対戦スナップショット（選択捨てキャンセル時の再描画用） */
let lastDuelGameState = null;
/** 選択捨て待ち: { playIndex, need, picks } */
let pendingChooseDiscard = null;

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

function sumDiscardSelfChoose(effects) {
  let n = 0;
  for (const e of effects || []) {
    if (e.type === "discardSelfChoose") n += e.value | 0;
  }
  return n;
}

function discardChooseCountFromCard(card) {
  const eff = catalogById[card?.id]?.effects;
  return sumDiscardSelfChoose(eff);
}

function postPlayIndexForDiscardPick(clickedIndex, playIndex) {
  if (clickedIndex === playIndex) return null;
  return clickedIndex < playIndex ? clickedIndex : clickedIndex - 1;
}

function playCardAction(handIndex, discardPicks) {
  if (!skywaySession) {
    toast("接続がありません");
    return;
  }
  skywaySession.playCard(handIndex, discardPicks);
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
  const duel = id === "screen-game";
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.toggle("active", s.id === id);
  });
  document.documentElement.classList.toggle("scg-duel-view", duel);
  document.body.classList.toggle("scg-duel-view", duel);
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
  const eff = card.effects || [];
  const hasIf = eff.some(
    (e) => e.type === "damageIf" || e.type === "healIf"
  );

  function appendSpan(seg) {
    const span = document.createElement("span");
    span.textContent = seg.t;
    span.className = `seg-${seg.c || "muted"}`;
    return span;
  }

  if (!hasIf) {
    for (const seg of parts) {
      container.appendChild(appendSpan(seg));
    }
    return;
  }

  const condIdx = parts.findIndex((s) => s.c === "condition");
  if (condIdx < 0) {
    for (const seg of parts) {
      container.appendChild(appendSpan(seg));
    }
    return;
  }

  let bonusStart = condIdx;
  while (bonusStart > 0 && parts[bonusStart - 1].c === "muted") {
    const ixMuted = bonusStart - 1;
    if (ixMuted > 0) {
      const before = parts[ixMuted - 1].c;
      const mutedTxt = (parts[ixMuted].t || "").trim();
      if (
        before === "draw" ||
        before === "heal" ||
        before === "damage" ||
        before === "discard" ||
        (before === "cap" && mutedTxt === "に。")
      ) {
        break;
      }
    }
    bonusStart = ixMuted;
  }

  for (let i = 0; i < bonusStart; i++) {
    container.appendChild(appendSpan(parts[i]));
  }
  const wrap = document.createElement("div");
  wrap.className = "card-body-bonus-wrap";
  const lab = document.createElement("div");
  lab.className = "card-body-bonus-label";
  lab.textContent = "追加効果（条件）";
  wrap.appendChild(lab);
  for (let i = bonusStart; i < parts.length; i++) {
    wrap.appendChild(appendSpan(parts[i]));
  }
  container.appendChild(wrap);
}

function makeCardFace(card, { wide } = {}) {
  const root = document.createElement("div");
  root.className = wide ? "card-face wide" : "card-face";
  if (card?.id) root.dataset.cardId = card.id;

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const headPanel = document.createElement("div");
  headPanel.className = "card-panel card-panel--head";

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = card.name || card.id;

  const cost = document.createElement("div");
  cost.className = "card-cost";
  const c = Math.min(5, Math.max(0, card.cost | 0));
  cost.textContent = String(c);

  headPanel.append(title, cost);

  const bodyPanel = document.createElement("div");
  bodyPanel.className = "card-panel card-panel--body";

  const body = document.createElement("div");
  body.className = "card-body";
  renderCardBody(body, card);

  bodyPanel.appendChild(body);
  inner.append(headPanel, bodyPanel);
  root.appendChild(inner);
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
  fillLobbyDeckSelect();
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

/** 互換: 送信可能な（20枚の）保存デッキがあればその cardIds */
function loadSavedDeck() {
  for (const d of loadDecksList()) {
    if (d?.cardIds?.length === 20) return d.cardIds.slice();
  }
  return null;
}

function validateDeckCounts(ids) {
  if (!Array.isArray(ids)) {
    return { ok: false, reason: "デッキデータが不正です。" };
  }
  if (ids.length > 20) {
    return { ok: false, reason: "20枚までです。" };
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

function validateDeckClient(ids) {
  if (!Array.isArray(ids) || ids.length !== 20) {
    return { ok: false, reason: "デッキはちょうど20枚である必要があります。" };
  }
  return validateDeckCounts(ids);
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
  const slot = skywaySession?.role === "host" ? 0 : 1;
  const chk = $("#chk-ready");
  const pl = msg.players?.[slot];
  if (chk && pl) chk.checked = !!pl.ready;
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
let duelPrevSelfHp = null;
let duelPrevOppHp = null;

function applyDuelZoomClass() {
  const g = document.getElementById("screen-game");
  if (!g) return;
  const lg = sessionStorage.getItem(SS_DUEL_ZOOM_LG) !== "0";
  g.classList.toggle("duel-zoom-lg", lg);
  const btn = document.getElementById("btn-duel-zoom-toggle");
  if (btn) {
    btn.textContent = lg ? "カード: 大" : "カード: 標準";
    btn.setAttribute("aria-pressed", lg ? "true" : "false");
  }
}

function openCardZoomPreview(cardId) {
  const def = catalogById[cardId];
  if (!def) return;
  const mount = document.getElementById("card-zoom-mount");
  const back = document.getElementById("card-zoom-backdrop");
  if (!mount || !back) return;
  mount.textContent = "";
  mount.appendChild(makeCardFace(def, { wide: true }));
  back.hidden = false;
  document.body.classList.add("scg-card-zoom-open");
  document.documentElement.classList.add("scg-card-zoom-open");
}

function closeCardZoomPreview() {
  const back = document.getElementById("card-zoom-backdrop");
  if (back) back.hidden = true;
  document.body.classList.remove("scg-card-zoom-open");
  document.documentElement.classList.remove("scg-card-zoom-open");
}

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
  applyDuelZoomClass();
  lastGameYouAre = state.youAre;
  $("#opp-hp").textContent = String(state.opponent.hp);
  $("#self-hp").textContent = String(state.you.hp);
  const selfHp = state.you.hp | 0;
  const oppHp = state.opponent.hp | 0;
  if (duelPrevSelfHp !== null && selfHp < duelPrevSelfHp) {
    const hpEl = $("#self-hp");
    const field = document.querySelector(".duel-self-field");
    hpEl?.classList.add("hp-hit");
    field?.classList.add("duel-field-damage");
    clearTimeout(hpEl?._hitTm);
    if (hpEl) {
      hpEl._hitTm = setTimeout(() => {
        hpEl.classList.remove("hp-hit");
        field?.classList.remove("duel-field-damage");
      }, 720);
    }
  }
  if (duelPrevOppHp !== null && oppHp < duelPrevOppHp) {
    const hpEl = $("#opp-hp");
    const field = document.querySelector(".duel-opp-field");
    hpEl?.classList.add("hp-hit");
    field?.classList.add("duel-field-damage");
    clearTimeout(hpEl?._hitTm);
    if (hpEl) {
      hpEl._hitTm = setTimeout(() => {
        hpEl.classList.remove("hp-hit");
        field?.classList.remove("duel-field-damage");
      }, 720);
    }
  }
  duelPrevSelfHp = selfHp;
  duelPrevOppHp = oppHp;
  const maxHp = state.you.maxHp ?? state.opponent.maxHp ?? 50;
  document.querySelectorAll(".duel-hp-max").forEach((el) => {
    el.textContent = `/${maxHp}`;
  });
  $("#opp-hand").textContent = String(
    state.opponent.handCount ?? state.opponent.hand?.length ?? 0
  );
  $("#opp-deck").textContent = String(state.opponent.deckCount);
  $("#opp-disc").textContent = String(state.opponent.discardCount);
  $("#self-deck").textContent = String(state.you.deckCount);
  $("#self-disc").textContent = String(state.you.discardCount);
  const selfHandCt = $("#self-hand");
  if (selfHandCt) {
    selfHandCt.textContent = String(state.you.hand?.length ?? 0);
  }
  $("#turn-no").textContent = String(state.roundNumber);

  const oStock = String(state.opponent.attackStock | 0);
  const sStock = String(state.you.attackStock | 0);
  $("#opp-attack-stock").textContent = oStock;
  $("#self-attack-stock").textContent = sStock;

  const oa = $("#opp-attack-stock");
  const sa = $("#self-attack-stock");
  const pendAtk = state.you.pendingFirstLockAttack | 0;
  if (sa) {
    sa.title =
      pendAtk > 0
        ? `先行確定時に交戦力+${pendAtk}（確定した時点で加算）`
        : "";
  }
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
  const costCurPile = $("#cost-current-pile");
  const costMaxPile = $("#cost-max-pile");
  if (costCurPile) costCurPile.textContent = String(state.you.costPool);
  if (costMaxPile) {
    costMaxPile.textContent = String(
      state.you.maxCost ?? state.you.costPool
    );
  }

  const myLock = !!state.you.roundLocked;
  const opLock = !!state.opponent.roundLocked;
  if (myLock) pendingChooseDiscard = null;

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
  $("#cost-bar-pile")?.classList.toggle("wait", myLock);

  const oppStrip = $("#opp-hand-cards");
  if (oppStrip) {
    oppStrip.textContent = "";
    const oh = state.opponent.hand || [];
    for (const c of oh) {
      const el = makeCardFace(c);
      el.title = "クリックで拡大表示";
      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        openCardZoomPreview(c.id);
      });
      oppStrip.appendChild(el);
    }
  }

  renderBattleLog(state.battleLog, state.youAre);

  const canPlay = !myLock;
  const hand = $("#hand");
  hand.textContent = "";
  state.you.hand.forEach((card, idx) => {
    const el = makeCardFace(card);
    el.dataset.index = String(idx);
    const pend = pendingChooseDiscard;
    const affordable = canPlay && (card.cost | 0) <= state.you.costPool;
    const chooseNeed = discardChooseCountFromCard(card);

    if (!pend && !affordable) el.classList.add("disabled");
    if (pend) {
      if (idx === pend.playIndex) el.classList.add("card-pending-source");
      else if (canPlay) el.classList.add("card-pending-pick");
    }

    if (pend && idx === pend.playIndex) {
      el.title = "クリックでキャンセル · Ctrl+クリックで拡大（Mac は ⌘）";
    } else if (pend && idx !== pend.playIndex) {
      el.title =
        "クリックで捨て札として選ぶ · Ctrl+クリックで拡大（Mac は ⌘）";
    } else if (canPlay && affordable) {
      const hint =
        chooseNeed > 0
          ? "（使用時に手札を選んで捨てます）"
          : "";
      el.title = `クリックで使用${hint} · Ctrl+クリックで拡大（Mac は ⌘）`;
    } else {
      el.title = "Ctrl+クリックで拡大（Mac は ⌘）";
    }

    el.addEventListener("click", (ev) => {
      if (ev.ctrlKey || ev.metaKey) {
        ev.preventDefault();
        ev.stopPropagation();
        openCardZoomPreview(card.id);
        return;
      }
      if (!canPlay) return;

      const p2 = pendingChooseDiscard;
      if (p2) {
        if (idx === p2.playIndex) {
          pendingChooseDiscard = null;
          toast("選択をキャンセルしました");
          onGameState(state);
          return;
        }
        const post = postPlayIndexForDiscardPick(idx, p2.playIndex);
        if (post === null) {
          toast("使用するカード以外を選んでください");
          return;
        }
        p2.picks.push(post);
        if (new Set(p2.picks).size !== p2.picks.length) {
          p2.picks.pop();
          toast("同じ手札位置は2回選べません");
          return;
        }
        if (p2.picks.length < p2.need) {
          toast(`あと ${p2.need - p2.picks.length} 枚、捨てるカードを選んでください`);
          onGameState(state);
          return;
        }
        const playIx = p2.playIndex;
        const picks = p2.picks.slice();
        pendingChooseDiscard = null;
        playCardAction(playIx, picks);
        return;
      }

      if (!affordable) return;

      if (chooseNeed > 0) {
        if (state.you.hand.length - 1 < chooseNeed) {
          toast("選んで捨てるには手札が足りません");
          return;
        }
        pendingChooseDiscard = {
          playIndex: idx,
          need: chooseNeed,
          picks: [],
        };
        toast(
          `このカードを使うには、手札から${chooseNeed}枚選んで捨ててください`
        );
        onGameState(state);
        return;
      }
      playCardAction(idx);
    });
    hand.appendChild(el);
  });

  const btn = $("#btn-end-turn");
  btn.disabled = myLock;
  btn.textContent = myLock ? "確定済み" : "このラウンドを確定";

  lastDuelGameState = state;
}

function onGameOver(payload) {
  closeCardZoomPreview();
  pendingChooseDiscard = null;
  lastBattleLogSeq = 0;
  lastSelfAttack = -1;
  lastOppAttack = -1;
  duelPrevSelfHp = null;
  duelPrevOppHp = null;
  const youWin = payload.winnerSlot === lastGameYouAre;
  const disconnect = payload.reason === "disconnect";
  showScreen("screen-result");
  const panel = $("#result-panel");
  if (panel) {
    panel.classList.remove("result-panel--win", "result-panel--lose");
    panel.classList.add(youWin ? "result-panel--win" : "result-panel--lose");
  }
  const hero = $("#result-hero");
  if (hero) {
    hero.textContent = youWin ? "勝利" : "敗北";
  }
  $("#result-title").textContent = youWin ? "あなたの勝ち" : "あなたの負け";
  let detail = youWin
    ? "相手のHPを0にし、デュエルを制しました。"
    : "あなたのHPが0になり、デュエルは続行できません。";
  if (disconnect) {
    detail = youWin
      ? "相手が切断したため、こちらの不戦勝となりました。"
      : "ホストとの接続が切れました。結果は記録されません。";
  }
  $("#result-detail").textContent = detail;
  $("#result-msg").textContent = youWin
    ? "お疲れさまでした。タイトルに戻って次の対戦を準備できます。"
    : "タイトルに戻り、デッキや立ち回りを見直してみましょう。";
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

function orderedUniqueDeckIds(ids) {
  const seen = new Set();
  const order = [];
  for (const id of ids) {
    if (!seen.has(id)) {
      seen.add(id);
      order.push(id);
    }
  }
  return order;
}

function cardSearchBlob(card) {
  if (!card) return "";
  const bits = [card.id, card.name];
  for (const seg of card.body || []) {
    if (seg && seg.t) bits.push(seg.t);
  }
  return bits.join(" ").toLowerCase();
}

function renderDeckListScreen() {
  const root = $("#deck-list-root");
  if (!root) return;
  root.textContent = "";
  const decks = loadDecksList();
  for (const d of decks) {
    const ids = Array.isArray(d.cardIds) ? d.cardIds : [];
    const row = document.createElement("div");
    row.className = "deck-list-row";
    const meta = document.createElement("div");
    meta.className = "deck-list-meta";
    const name = document.createElement("div");
    name.className = "deck-list-name";
    name.textContent = d.name || "無題";
    const sub = document.createElement("div");
    sub.className = "deck-list-sub";
    const v = validateDeckClient(ids);
    sub.textContent = v.ok ? "20 / 20 枚（送信可）" : `${ids.length} / 20 枚`;
    meta.append(name, sub);
    const actions = document.createElement("div");
    actions.className = "deck-list-actions";
    const bEdit = document.createElement("button");
    bEdit.type = "button";
    bEdit.className = "btn";
    bEdit.textContent = "編集";
    bEdit.dataset.deckAct = "edit";
    bEdit.dataset.deckId = d.id;
    const bCopy = document.createElement("button");
    bCopy.type = "button";
    bCopy.className = "btn ghost";
    bCopy.textContent = "コピー";
    bCopy.dataset.deckAct = "copy";
    bCopy.dataset.deckId = d.id;
    const bDel = document.createElement("button");
    bDel.type = "button";
    bDel.className = "btn ghost";
    bDel.textContent = "削除";
    bDel.dataset.deckAct = "delete";
    bDel.dataset.deckId = d.id;
    if (decks.length <= 1) bDel.disabled = true;
    actions.append(bEdit, bCopy, bDel);
    row.append(meta, actions);
    root.appendChild(row);
  }
}

function renderDeckBuilder() {
  if (!document.getElementById("screen-deck")?.classList.contains("active")) {
    return;
  }
  const strip = $("#deck-strip");
  const grid = $("#catalog-grid");
  if (strip) strip.textContent = "";
  if (grid) grid.textContent = "";

  if (strip) {
    const order = orderedUniqueDeckIds(currentDeck);
    for (const cid of order) {
      const n = currentDeck.filter((x) => x === cid).length;
      const def = catalogById[cid];
      if (!def) continue;
      const wrap = document.createElement("div");
      wrap.className = "deck-strip-item";
      const face = makeCardFace(def, { wide: true });
      face.classList.add("deck-strip-card");
      face.title =
        "−/+で枚数調整 · Ctrl+クリックで拡大（Mac は ⌘）";
      face.addEventListener("click", (ev) => {
        if (ev.ctrlKey || ev.metaKey) {
          ev.preventDefault();
          ev.stopPropagation();
          openCardZoomPreview(cid);
        }
      });
      const badge = document.createElement("span");
      badge.className = "deck-strip-count";
      badge.textContent = `×${n}`;
      const row = document.createElement("div");
      row.className = "deck-strip-controls";
      const minus = document.createElement("button");
      minus.type = "button";
      minus.className = "btn ghost deck-strip-btn";
      minus.textContent = "−1";
      minus.addEventListener("click", () => {
        for (let k = currentDeck.length - 1; k >= 0; k--) {
          if (currentDeck[k] === cid) {
            currentDeck.splice(k, 1);
            break;
          }
        }
        renderDeckBuilder();
      });
      const plus = document.createElement("button");
      plus.type = "button";
      plus.className = "btn ghost deck-strip-btn";
      plus.textContent = "+1";
      const atCap = n >= 3 || currentDeck.length >= 20;
      plus.disabled = atCap;
      plus.addEventListener("click", () => {
        const counts = {};
        for (const x of currentDeck) counts[x] = (counts[x] || 0) + 1;
        if ((counts[cid] || 0) >= 3) {
          toast("同じカードは3枚までです");
          return;
        }
        if (currentDeck.length >= 20) {
          toast("20枚までです");
          return;
        }
        currentDeck.push(cid);
        renderDeckBuilder();
      });
      row.append(minus, plus);
      wrap.append(face, badge, row);
      strip.appendChild(wrap);
    }
  }

  const q = ($("#catalog-filter-text")?.value || "").trim().toLowerCase();
  const costF = $("#catalog-filter-cost")?.value || "all";
  const ids = Object.keys(catalogById)
    .filter((id) => {
      const card = catalogById[id];
      const c = card.cost | 0;
      if (costF !== "all" && String(c) !== costF) return false;
      if (!q) return true;
      return cardSearchBlob(card).includes(q);
    })
    .sort();
  for (const id of ids) {
    const card = catalogById[id];
    const face = makeCardFace(card, { wide: true });
    face.title =
      "クリックでデッキに追加 · Ctrl+クリックで拡大（Mac は ⌘）";
    face.addEventListener("click", (ev) => {
      if (ev.ctrlKey || ev.metaKey) {
        ev.preventDefault();
        ev.stopPropagation();
        openCardZoomPreview(id);
        return;
      }
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
  const rowOk = validateDeckCounts(currentDeck);
  const full = validateDeckClient(currentDeck);
  if (currentDeck.length === 0) {
    st.textContent = "";
    st.className = "deck-status";
  } else if (!rowOk.ok) {
    st.textContent = `（${rowOk.reason}）`;
    st.className = "deck-status bad";
  } else if (full.ok) {
    st.textContent = "（送信可能）";
    st.className = "deck-status ok";
  } else {
    st.textContent = `（あと ${20 - currentDeck.length} 枚で完成）`;
    st.className = "deck-status";
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
        openDeckList();
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
        onActionError: (p) => {
          pendingChooseDiscard = null;
          toast(p.message || "操作エラー");
        },
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
        onActionError: (p) => {
          pendingChooseDiscard = null;
          toast(p.message || "操作エラー");
        },
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

  $("#btn-copy-room-code")?.addEventListener("click", async () => {
    const el = $("#lobby-code");
    const code = el?.textContent?.trim().replace(/\s+/g, "");
    if (!code || code === "------") {
      toast("コピーできるルームIDがありません");
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      toast("ルームIDをコピーしました");
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        toast("ルームIDをコピーしました");
      } catch {
        toast("コピーに失敗しました");
      }
    }
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

  $("#btn-duel-zoom-toggle")?.addEventListener("click", () => {
    const cur = sessionStorage.getItem(SS_DUEL_ZOOM_LG);
    if (cur === "0") {
      sessionStorage.removeItem(SS_DUEL_ZOOM_LG);
    } else {
      sessionStorage.setItem(SS_DUEL_ZOOM_LG, "0");
    }
    applyDuelZoomClass();
  });

  $("#card-zoom-backdrop")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      closeCardZoomPreview();
    }
  });

  $("#card-zoom-surface")?.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const back = document.getElementById("card-zoom-backdrop");
      if (back && !back.hidden) {
        closeCardZoomPreview();
        return;
      }
      if (pendingChooseDiscard) {
        pendingChooseDiscard = null;
        toast("選択捨てをキャンセルしました");
        if (lastDuelGameState) onGameState(lastDuelGameState);
      }
    }
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
    fillLobbyDeckSelect();
    syncDeckNameInput();
    toast("デッキを保存しました");
    renderDeckBuilder();
  });

  $("#btn-deck-editor-back")?.addEventListener("click", () => {
    openDeckList();
  });

  $("#btn-deck-create-empty")?.addEventListener("click", () => {
    const decks = loadDecksList();
    if (decks.length >= MAX_SAVED_DECKS) {
      toast(`保存は${MAX_SAVED_DECKS}個までです`);
      return;
    }
    const nameIn = window.prompt("新しいデッキの名前", `デッキ${decks.length + 1}`);
    if (nameIn === null) return;
    const name = (nameIn || "").trim().slice(0, 24) || `デッキ${decks.length + 1}`;
    const id = newDeckId();
    decks.push({ id, name, cardIds: [] });
    saveDecksListRaw(decks);
    setEditorDeckId(id);
    fillLobbyDeckSelect();
    renderDeckListScreen();
    openDeckEditor();
    toast("空のデッキを作成しました");
  });

  $("#deck-list-root")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-deck-act]");
    if (!btn) return;
    const act = btn.getAttribute("data-deck-act");
    const did = btn.getAttribute("data-deck-id");
    if (!did) return;
    const decks = loadDecksList();
    const d = decks.find((x) => x.id === did);
    if (!d) return;
    if (act === "edit") {
      setEditorDeckId(did);
      openDeckEditor();
    } else if (act === "copy") {
      if (decks.length >= MAX_SAVED_DECKS) {
        toast(`保存は${MAX_SAVED_DECKS}個までです`);
        return;
      }
      const nameIn = window.prompt("コピーの名前", `${d.name}のコピー`);
      if (nameIn === null) return;
      const name =
        (nameIn || "").trim().slice(0, 24) || `${d.name}のコピー`;
      const id = newDeckId();
      const cardIds = Array.isArray(d.cardIds) ? d.cardIds.slice() : [];
      decks.push({ id, name, cardIds });
      saveDecksListRaw(decks);
      setEditorDeckId(id);
      fillLobbyDeckSelect();
      renderDeckListScreen();
      openDeckEditor();
      toast("デッキをコピーしました");
    } else if (act === "delete") {
      if (decks.length <= 1) {
        toast("最後の1つは削除できません");
        return;
      }
      if (!window.confirm(`「${d.name}」を削除しますか？`)) return;
      const next = decks.filter((x) => x.id !== did);
      saveDecksListRaw(next);
      if (getEditorDeckId() === did) {
        setEditorDeckId(next[0].id);
      }
      fillLobbyDeckSelect();
      renderDeckListScreen();
      toast("デッキを削除しました");
    }
  });

  $("#btn-deck-copy")?.addEventListener("click", () => {
    let decks = loadDecksList();
    if (decks.length >= MAX_SAVED_DECKS) {
      toast(`保存は${MAX_SAVED_DECKS}個までです`);
      return;
    }
    const cur = decks.find((x) => x.id === getEditorDeckId());
    const nameIn = window.prompt("コピーの名前", `${cur?.name || "デッキ"}のコピー`);
    if (nameIn === null) return;
    const name =
      (nameIn || "").trim().slice(0, 24) || `${cur?.name || "デッキ"}のコピー`;
    const id = newDeckId();
    const cardIds = currentDeck.slice();
    decks.push({ id, name, cardIds });
    saveDecksListRaw(decks);
    setEditorDeckId(id);
    fillLobbyDeckSelect();
    syncDeckNameInput();
    renderDeckBuilder();
    toast("コピーを作成して切り替えました");
  });

  $("#btn-deck-delete-editor")?.addEventListener("click", () => {
    const decks = loadDecksList();
    if (decks.length <= 1) {
      toast("最後の1つは削除できません");
      return;
    }
    const id = getEditorDeckId();
    const d = decks.find((x) => x.id === id);
    if (!window.confirm(`「${d?.name || ""}」を削除しますか？`)) return;
    const next = decks.filter((x) => x.id !== id);
    saveDecksListRaw(next);
    setEditorDeckId(next[0].id);
    fillLobbyDeckSelect();
    const nd = next[0];
    currentDeck = Array.isArray(nd?.cardIds) ? nd.cardIds.slice() : [];
    syncDeckNameInput();
    renderDeckBuilder();
    openDeckList();
    toast("デッキを削除しました");
  });

  let catalogFilterTm = 0;
  const refilterCatalog = () => {
    clearTimeout(catalogFilterTm);
    catalogFilterTm = setTimeout(() => renderDeckBuilder(), 160);
  };
  $("#catalog-filter-text")?.addEventListener("input", refilterCatalog);
  $("#catalog-filter-cost")?.addEventListener("change", refilterCatalog);
}

function syncDeckNameInput() {
  const inp = $("#deck-name-input");
  if (!inp) return;
  const id = getEditorDeckId();
  const d = loadDecksList().find((x) => x.id === id);
  inp.value = d?.name || "";
}

async function openDeckList() {
  if (!Object.keys(catalogById).length) {
    try {
      await fetchCatalog();
    } catch {
      toast("カード一覧の取得に失敗しました");
      return;
    }
  }
  loadDecksList();
  fillLobbyDeckSelect();
  renderDeckListScreen();
  showScreen("screen-deck-list");
}

async function openDeckEditor() {
  if (!Object.keys(catalogById).length) {
    try {
      await fetchCatalog();
    } catch {
      toast("カード一覧の取得に失敗しました");
      return;
    }
  }
  loadDecksList();
  const id = getEditorDeckId();
  const d = loadDecksList().find((x) => x.id === id);
  currentDeck = Array.isArray(d?.cardIds) ? d.cardIds.slice() : [];
  syncDeckNameInput();
  showScreen("screen-deck");
  renderDeckBuilder();
}

async function openDeckBuilder() {
  await openDeckList();
}

window.addEventListener("DOMContentLoaded", async () => {
  wireUi();
  applyDuelZoomClass();
  try {
    await fetchCatalog();
  } catch {
    /* 初回は静的データへフォールバック可能 */
  }
});
