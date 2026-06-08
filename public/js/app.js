const LS_DECK_LEGACY = "scg_deck_v1";
const LS_DECKS = "scg_decks_v1";
const LS_EDITOR_DECK = "scg_editor_deck_id";
const LS_LOBBY_DECK = "scg_lobby_deck_id";
const MAX_SAVED_DECKS = 16;
const SS_DUEL_ZOOM_LG = "scg_duel_zoom_lg";
const DECK_SIZE = 40;
/** 1デッキあたり同一カードの上限枚数 */
const MAX_COPIES_PER_CARD = 4;

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

function cardEffectList(card) {
  return card?.effect || card?.effects || [];
}

function effectivePlayCost(card, lastPlayedSpeaker) {
  const base = card.cost | 0;
  const speaker = card.speaker;
  if (!speaker || !lastPlayedSpeaker || speaker !== lastPlayedSpeaker) {
    return base;
  }
  const se = card.speaker_effect;
  const reduction =
    se && se.cost_reduction != null ? Math.max(0, se.cost_reduction | 0) : 1;
  return Math.max(0, base - reduction);
}

function describeEffectShort(e) {
  const v = e.value | 0;
  switch (e.type) {
    case "damage":
      return `相手${v}ダメ`;
    case "heal":
      return `回復${v}`;
    case "draw":
      return `ドロー${v}`;
    case "discardSelf":
      return `手札捨${v}`;
    case "damageIf":
      return `条件${v}ダメ`;
    case "healIf":
      return `条件回復${v}`;
    default:
      return e.type || "";
  }
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
  const S = typeof ScgSfx !== "undefined" ? ScgSfx : null;
  if (!S) return;
  const m = String(msg || "");
  const warnRe =
    /失敗|できません|ないです|不正|足りません|操作エラー|読み込めません|見つかりません|コピーに失敗|最大\d+個まで|最後の1つは削除|\d+個までです|使用するカード以外|同じ手札位置は2回|捨てるには手札が足りません/;
  const okRe = /しました|送信|保存|作成|切り替え|削除しました|コピーしました/;
  if (warnRe.test(m)) S.toastWarn();
  else if (okRe.test(m) && !/失敗/.test(m)) S.toastOk();
  else S.toastNeutral();
}

function actorHandLen(state, slot) {
  return slot === state.youAre
    ? state.you.hand?.length ?? 0
    : state.opponent.handCount ?? state.opponent.hand?.length ?? 0;
}

function actorHpVal(state, slot) {
  return slot === state.youAre ? state.you.hp | 0 : state.opponent.hp | 0;
}

function evalIfEffectForActor(effect, state, actorSlot) {
  const mode = effect.mode;
  const oppSlot = 1 - actorSlot;
  const selfHand = actorHandLen(state, actorSlot);
  const oppHand = actorHandLen(state, oppSlot);
  const selfHp = actorHpVal(state, actorSlot);
  const oppHp = actorHpVal(state, oppSlot);
  const th = effect.threshold | 0;
  const selfSpeaker =
    actorSlot === state.youAre
      ? state.you.lastPlayedSpeaker
      : state.opponent.lastPlayedSpeaker;
  const oppSpeaker =
    oppSlot === state.youAre
      ? state.you.lastPlayedSpeaker
      : state.opponent.lastPlayedSpeaker;
  switch (mode) {
    case "opponentHandGte":
      return oppHand >= th;
    case "selfHandGte":
      return selfHand >= th;
    case "selfHpLte":
      return selfHp <= th;
    case "opponentHpGte":
      return oppHp >= th;
    case "opponentHandLte":
      return oppHand <= th;
    case "opponentHpLte":
      return oppHp <= th;
    case "selfLastSpeakerIs":
      return selfSpeaker === effect.speaker;
    case "opponentLastSpeakerIs":
      return oppSpeaker === effect.speaker;
    default:
      return false;
  }
}

function speakerComboReady(card, lastPlayedSpeaker) {
  return (
    !!card?.speaker &&
    lastPlayedSpeaker != null &&
    card.speaker === lastPlayedSpeaker
  );
}

/** 無条件の数値の直後に続く「，相手手札…」など、条件句へ続く前置き muted（本文では bonus 側にまとめる） */
function isCommaLinkedConditionalPreamble(parts, ixMuted) {
  if (ixMuted <= 0) return false;
  const before = parts[ixMuted - 1].c;
  if (
    before !== "draw" &&
    before !== "heal" &&
    before !== "damage" &&
    before !== "discard"
  ) {
    return false;
  }
  const t = String(parts[ixMuted]?.t ?? "").trim();
  return /^[，、](相手|自身)/.test(t);
}

function computeBonusStartIndex(parts, eff) {
  const hasIf = eff.some(
    (e) =>
      e.type === "damageIf" ||
      e.type === "damageSelfIf" ||
      e.type === "healIf" ||
      e.type === "attackIfFirstLockerResolve"
  );
  if (!hasIf) return -1;
  const candidates = [];
  const condIdx = parts.findIndex((s) => s.c === "condition");
  if (condIdx >= 0) {
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
          if (!isCommaLinkedConditionalPreamble(parts, ixMuted)) {
            break;
          }
        }
      }
      bonusStart = ixMuted;
    }
    candidates.push(bonusStart);
  }
  if (eff.some((e) => e.type === "attackIfFirstLockerResolve")) {
    const ix = parts.findIndex(
      (p) => typeof p.t === "string" && p.t.includes("先行確定")
    );
    if (ix >= 0) candidates.push(ix);
  }
  if (!candidates.length) return -1;
  return Math.min(...candidates);
}

/** カード本文：セグメントをインラインで連結し、幅に応じてブラウザが折り返す */
function appendSegSpan(container, seg) {
  const span = document.createElement("span");
  span.textContent = String(seg.t ?? "");
  span.className = `seg-${seg.c || "muted"}`;
  const raw = String(seg.t ?? "").trim();
  if (/^\d+$/.test(raw)) span.classList.add("card-body-num-token");
  container.appendChild(span);
}

function appendCardBodyParts(container, parts, start, end) {
  let i = start;
  while (i < end) {
    const a = parts[i];
    const b = parts[i + 1];
    const c = parts[i + 2];
    if (a?.c === "muted" && b?.c === "condition") {
      const post = c;
      const postOk =
        post &&
        (post.c === "muted" ||
          post.c === "damage" ||
          post.c === "heal" ||
          post.c === "draw" ||
          post.c === "discard" ||
          post.c === "cap");
      if (postOk) {
        appendSegSpan(container, a);
        appendSegSpan(container, b);
        appendSegSpan(container, post);
        i += 3;
        continue;
      }
      if (!post) {
        appendSegSpan(container, a);
        appendSegSpan(container, b);
        i += 2;
        continue;
      }
    }
    appendSegSpan(container, a);
    i += 1;
  }
}

function renderCardBody(container, card, duelCtx) {
  container.textContent = "";
  const quote = document.createElement("div");
  quote.className = "card-quote";
  quote.textContent = card.text || card.name || card.id || "";
  container.appendChild(quote);

  const eff = cardEffectList(card);
  if (eff.length) {
    const fx = document.createElement("div");
    fx.className = "card-effect-line";
    const parts = eff.map((e) => {
      if (e.type === "damageIf" || e.type === "healIf") {
        const met =
          duelCtx?.state &&
          evalIfEffectForActor(e, duelCtx.state, duelCtx.actorSlot);
        return `${describeEffectShort(e)}${met === true ? "✓" : met === false ? "×" : ""}`;
      }
      return describeEffectShort(e);
    });
    fx.textContent = parts.join(" · ");
    container.appendChild(fx);
  }

  if (card.speaker_effect) {
    const combo = document.createElement("div");
    combo.className = "card-combo-hint";
    const bits = ["コンボ"];
    if (card.speaker_effect.damage_multiplier > 1) {
      bits.push(`ダメ×${card.speaker_effect.damage_multiplier}`);
    }
    if (card.speaker_effect.effects?.length) {
      bits.push(
        card.speaker_effect.effects.map(describeEffectShort).join("·")
      );
    }
    combo.textContent = bits.join(" ");
    container.appendChild(combo);
  }
}

function makeCardFace(card, { wide, duelCtx } = {}) {
  const root = document.createElement("div");
  root.className = wide ? "card-face wide" : "card-face";
  if (card?.id) root.dataset.cardId = card.id;

  const lastSp =
    duelCtx?.actorSlot === duelCtx?.state?.youAre
      ? duelCtx?.state?.you?.lastPlayedSpeaker
      : duelCtx?.state?.opponent?.lastPlayedSpeaker;
  if (speakerComboReady(card, lastSp)) {
    root.classList.add("card-combo-ready");
  }

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const headPanel = document.createElement("div");
  headPanel.className = "card-panel card-panel--head";

  const speaker = document.createElement("div");
  speaker.className = "card-speaker";
  speaker.textContent = card.speaker || "—";

  const cost = document.createElement("div");
  cost.className = "card-cost";
  const displayCost =
    duelCtx?.state != null
      ? effectivePlayCost(card, lastSp)
      : Math.min(10, Math.max(0, card.cost | 0));
  cost.textContent = String(displayCost);
  if (displayCost < (card.cost | 0)) {
    cost.title = `基本コスト ${card.cost}`;
    cost.classList.add("card-cost--reduced");
  }

  headPanel.append(speaker, cost);

  const bodyPanel = document.createElement("div");
  bodyPanel.className = "card-panel card-panel--body";

  const body = document.createElement("div");
  body.className = "card-body";
  renderCardBody(body, card, duelCtx);

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
    if (Array.isArray(arr) && arr.length === DECK_SIZE) {
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
  if (
    decks.length === 0 &&
    initialDeckIds.length === DECK_SIZE &&
    validateDeckClient(initialDeckIds).ok
  ) {
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
  const initOk =
    initialDeckIds.length === DECK_SIZE && validateDeckClient(initialDeckIds).ok;
  optInit.textContent = initOk ? "初期デッキ" : "初期デッキ（対戦不可）";
  optInit.disabled = !initOk;
  sel.appendChild(optInit);
  for (const d of loadDecksList()) {
    const op = document.createElement("option");
    op.value = d.id;
    const legal =
      Array.isArray(d.cardIds) &&
      d.cardIds.length === DECK_SIZE &&
      validateDeckClient(d.cardIds).ok;
    op.textContent = legal ? d.name : `${d.name}（対戦不可）`;
    op.disabled = !legal;
    sel.appendChild(op);
  }
  const saved = localStorage.getItem(LS_LOBBY_DECK);
  const opts = [...sel.options];
  if (saved && opts.some((o) => o.value === saved && !o.disabled)) {
    sel.value = saved;
  } else {
    const firstLegal = opts.find((o) => !o.disabled);
    if (firstLegal) sel.value = firstLegal.value;
  }
}

function lobbyChosenDeckIds() {
  const sel = document.getElementById("select-lobby-deck");
  const v = sel?.value;
  let ids = null;
  if (v === "__initial__") {
    if (initialDeckIds.length === DECK_SIZE) ids = initialDeckIds.slice();
  } else {
    const d = loadDecksList().find((x) => x.id === v);
    if (d?.cardIds?.length === DECK_SIZE) ids = d.cardIds.slice();
  }
  if (!ids) return null;
  return validateDeckClient(ids).ok ? ids : null;
}

/** 互換: 送信可能な保存デッキがあればその cardIds */
function loadSavedDeck() {
  for (const d of loadDecksList()) {
    if (d?.cardIds?.length === DECK_SIZE && validateDeckClient(d.cardIds).ok) {
      return d.cardIds.slice();
    }
  }
  return null;
}

function validateDeckCounts(ids) {
  if (!Array.isArray(ids)) {
    return { ok: false, reason: "デッキデータが不正です。" };
  }
  if (ids.length > DECK_SIZE) {
    return { ok: false, reason: `${DECK_SIZE}枚までです。` };
  }
  const counts = {};
  for (const cid of ids) {
    if (!catalogById[cid]) {
      return { ok: false, reason: `不明なカード: ${cid}` };
    }
    counts[cid] = (counts[cid] || 0) + 1;
    if (counts[cid] > MAX_COPIES_PER_CARD) {
      return {
        ok: false,
        reason: `同じカードは1デッキに${MAX_COPIES_PER_CARD}枚までです。`,
      };
    }
  }
  return { ok: true };
}

function validateDeckClient(ids) {
  if (!Array.isArray(ids) || ids.length !== DECK_SIZE) {
    return { ok: false, reason: `デッキはちょうど${DECK_SIZE}枚である必要があります。` };
  }
  return validateDeckCounts(ids);
}

const DECK_CODE_PREFIX = "SCG1|";

function encodeDeckCode(cardIds) {
  if (!Array.isArray(cardIds) || cardIds.length !== DECK_SIZE) return "";
  return `${DECK_CODE_PREFIX}${cardIds.join("|")}`;
}

function decodeDeckCode(raw) {
  const s = String(raw || "").trim();
  if (!s) return { ok: false, reason: "デッキコードが空です。" };
  const body = s.startsWith(DECK_CODE_PREFIX) ? s.slice(DECK_CODE_PREFIX.length) : s;
  const ids = body.split("|").map((x) => x.trim()).filter(Boolean);
  if (ids.length !== DECK_SIZE) {
    return {
      ok: false,
      reason: `形式が不正です。SCG1| で始まり、${DECK_SIZE}枚のカードIDを | で区切ります。`,
    };
  }
  const v = validateDeckClient(ids);
  if (!v.ok) return v;
  return { ok: true, cardIds: ids };
}

function prefillLobbyDeckCodeFromSelect() {
  const ta = document.getElementById("lobby-deck-code");
  if (!ta) return;
  const ids = lobbyChosenDeckIds();
  if (ids && ids.length === DECK_SIZE) {
    ta.value = encodeDeckCode(ids);
  }
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
    else bits.push("デッキ未設定");
    if (p.ready) bits.push("準備OK");
    right.textContent = bits.join(" · ");
    li.append(left, right);
    ul.appendChild(li);
  });
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

function openCardZoomPreview(cardId, { actorSlot } = {}) {
  const def = catalogById[cardId];
  if (!def) return;
  const mount = document.getElementById("card-zoom-mount");
  const back = document.getElementById("card-zoom-backdrop");
  if (!mount || !back) return;
  mount.textContent = "";
  const duel = document.documentElement.classList.contains("scg-duel-view");
  const st = lastDuelGameState;
  let duelCtx = null;
  if (
    duel &&
    st &&
    typeof actorSlot === "number" &&
    (actorSlot === 0 || actorSlot === 1)
  ) {
    duelCtx = { state: st, actorSlot };
  }
  mount.appendChild(makeCardFace(def, { wide: true, duelCtx }));
  back.hidden = false;
  document.body.classList.add("scg-card-zoom-open");
  document.documentElement.classList.add("scg-card-zoom-open");
  if (typeof ScgSfx !== "undefined") ScgSfx.cardPreview();
}

function closeCardZoomPreview() {
  const back = document.getElementById("card-zoom-backdrop");
  if (back) back.hidden = true;
  document.body.classList.remove("scg-card-zoom-open");
  document.documentElement.classList.remove("scg-card-zoom-open");
}

/** 交戦ダメージログを、閲覧者 youAre 視点の文言に統一する */
function formatClashDamageLogLine(e, youAre) {
  const m = e.meta;
  let damage;
  let high;
  let low;
  let victimSlot;
  if (m && m.clashDamage) {
    damage = m.damage | 0;
    high = m.winnerAttack | 0;
    low = m.loserAttack | 0;
    victimSlot = m.victimSlot | 0;
  } else if (e.kind === "clash" && e.slot != null && typeof e.text === "string") {
    const rx =
      /^交戦で (\d+) ダメージ（相手の交戦力 (\d+) \/ 自分 (\d+)）$/;
    const mm = e.text.match(rx);
    if (!mm) return e.text;
    damage = mm[1] | 0;
    high = mm[2] | 0;
    low = mm[3] | 0;
    victimSlot = e.slot | 0;
  } else {
    return e.text;
  }
  if (youAre === victimSlot) {
    return `交戦で ${damage} ダメージ（相手の交戦力 ${high} / あなたの交戦力 ${low}）`;
  }
  return `交戦で相手に ${damage} ダメージ（あなたの交戦力 ${high} / 相手の交戦力 ${low}）`;
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
    const clashDamageRow =
      e.kind === "clash" &&
      (e.meta?.clashDamage ||
        (typeof e.text === "string" && /交戦で \d+ ダメージ/.test(e.text)));
    let who = "";
    let body = e.text;
    if (e.kind === "clash" && e.slot == null) {
      who = "";
      body = e.text;
    } else if (clashDamageRow) {
      who = "";
      body = formatClashDamageLogLine(e, youAre);
    } else {
      who =
        e.slot === null
          ? ""
          : e.slot === youAre
            ? "あなた › "
            : "相手 › ";
      body = e.text;
    }
    row.textContent = `${who}${body}`;
    if (e.kind === "clash") row.classList.add("log-clash");
    else if (e.kind === "system") row.classList.add("log-sys");
    else if (e.kind === "negate") row.classList.add("log-neg");
    else if (!clashDamageRow && e.slot === youAre) row.classList.add("log-you");
    else if (!clashDamageRow && e.slot !== null) row.classList.add("log-opp");
    if (e.seq > lastBattleLogSeq) row.classList.add("flash");
    box.appendChild(row);
  }
  lastBattleLogSeq = maxSeq;
  box.scrollTop = box.scrollHeight;
}

let duelLogResizeObserver = null;

function updateDuelLogMaxHeight() {
  const screen = document.getElementById("screen-game");
  const opp = document.querySelector(".duel-opp-field");
  const selfField = document.querySelector(".duel-self-field");
  if (!screen || !opp || !selfField) return;
  const sum = Math.ceil(
    opp.getBoundingClientRect().height +
      selfField.getBoundingClientRect().height
  );
  const px = Math.max(140, Math.min(sum, 560));
  screen.style.setProperty("--duel-log-max-h", `${px}px`);
}

function bindDuelLayoutMetricsOnce() {
  const screen = document.getElementById("screen-game");
  if (!screen || screen.dataset.duelLayoutBound === "1") return;
  screen.dataset.duelLayoutBound = "1";
  const ro = new ResizeObserver(() => updateDuelLogMaxHeight());
  const opp = document.querySelector(".duel-opp-field");
  const selfField = document.querySelector(".duel-self-field");
  if (opp) ro.observe(opp);
  if (selfField) ro.observe(selfField);
  duelLogResizeObserver = ro;
  window.addEventListener("resize", updateDuelLogMaxHeight);
}

function fillStatusRail(bodyEl, rows) {
  if (!bodyEl) return;
  bodyEl.textContent = "";
  if (!rows.length) {
    const div = document.createElement("div");
    div.className = "duel-fx-line duel-fx-line--empty";
    div.textContent = "なし";
    bodyEl.appendChild(div);
    return;
  }
  for (const row of rows) {
    const div = document.createElement("div");
    div.className = `duel-fx-line duel-fx-line--${row.kind}`;
    if (row.strong) div.classList.add("duel-fx-line--strong");
    div.textContent = row.text;
    bodyEl.appendChild(div);
  }
}

function renderDuelStatusRails(state) {
  const you = state.you;
  const opp = state.opponent;
  const oppRows = [];
  if (opp.lastPlayedSpeaker) {
    oppRows.push({
      kind: "spk",
      text: `直前発言: ${opp.lastPlayedSpeaker}`,
    });
  }
  if (!state.isYourTurn) {
    oppRows.push({
      kind: "turn",
      text: "相手の手番",
      strong: true,
    });
  }
  if (opp.costPool != null) {
    oppRows.push({
      kind: "air",
      text: `空気 ${opp.costPool}/${opp.maxCost}`,
    });
  }
  fillStatusRail($("#opp-status-rail-body"), oppRows);

  const selfRows = [];
  if (you.lastPlayedSpeaker) {
    selfRows.push({
      kind: "spk",
      text: `直前発言: ${you.lastPlayedSpeaker}`,
    });
  }
  if (state.isYourTurn) {
    selfRows.push({
      kind: "turn",
      text: "あなたの手番",
      strong: true,
    });
  }
  fillStatusRail($("#self-status-rail-body"), selfRows);
}

/**
 * 直近のログ・HP の変化から SE を鳴らす（lastBattleLogSeq 更新前に呼ぶ）。
 */
function playDuelSfx(state, snap) {
  const S = typeof ScgSfx === "undefined" ? null : ScgSfx;
  if (!S || !lastDuelGameState) return;
  const youAre = state.youAre | 0;
  const selfHp = state.you.hp | 0;
  const oppHp = state.opponent.hp | 0;
  const logs = state.battleLog || [];
  const newEntries = logs
    .filter((e) => e.seq > lastBattleLogSeq)
    .sort((a, b) => a.seq - b.seq);
  for (const e of newEntries) {
    if (e.kind === "play") {
      if (e.slot === youAre) S.playCard();
      else if (e.slot != null) S.oppPlay();
      if (e.meta?.speakerCombo) S.attackTick();
    } else if (e.kind === "endTurn") {
      S.lockConfirm();
    } else if (e.kind === "system") {
      S.roundSystem();
    }
  }
  const ps = snap.sfxPrevSelfHp;
  const po = snap.sfxPrevOppHp;
  if (ps !== null && selfHp > ps) S.heal();
  if (ps !== null && selfHp < ps) S.selfHurt();
  if (po !== null && oppHp < po) S.dealDamage();
}

function onGameState(state) {
  const sfxSnap = {
    sfxPrevSelfHp: duelPrevSelfHp,
    sfxPrevOppHp: duelPrevOppHp,
  };
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
  const maxHp = state.you.maxHp ?? state.opponent.maxHp ?? 20;
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
  $("#turn-no").textContent = String(state.turnNumber ?? 1);

  const oppSpEl = $("#opp-last-speaker");
  if (oppSpEl) {
    oppSpEl.textContent = state.opponent.lastPlayedSpeaker || "—";
  }
  const selfSpEl = $("#self-last-speaker");
  if (selfSpEl) {
    selfSpEl.textContent = state.you.lastPlayedSpeaker || "—";
  }

  const costCurPile = $("#cost-current-pile");
  const costMaxPile = $("#cost-max-pile");
  if (costCurPile) costCurPile.textContent = String(state.you.costPool);
  if (costMaxPile) {
    costMaxPile.textContent = String(
      state.you.maxCost ?? state.you.costPool
    );
  }

  const isYourTurn = !!state.isYourTurn;
  const duelActorYou = state.youAre | 0;
  const duelActorOpp = 1 - duelActorYou;
  const selfDuelCtx = { state, actorSlot: duelActorYou };
  const oppDuelCtx = { state, actorSlot: duelActorOpp };
  pendingChooseDiscard = null;

  const banner = $("#turn-banner");
  if (isYourTurn) {
    banner.textContent = "あなたの手番 — カードを使い、終わったらターン終了";
  } else {
    banner.textContent = "相手の手番 — 相手のプレイを待っています";
  }
  banner.classList.toggle("wait", !isYourTurn);

  $("#cost-bar-pile")?.classList.toggle("wait", !isYourTurn);

  const oppStrip = $("#opp-hand-cards");
  if (oppStrip) {
    oppStrip.textContent = "";
    const oh = state.opponent.hand || [];
    for (const c of oh) {
      const el = makeCardFace(c, { duelCtx: oppDuelCtx });
      el.title = "クリックで拡大表示";
      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        openCardZoomPreview(c.id, { actorSlot: duelActorOpp });
      });
      oppStrip.appendChild(el);
    }
  }

  playDuelSfx(state, sfxSnap);

  renderBattleLog(state.battleLog, state.youAre);

  const canPlay = isYourTurn;
  const lastSp = state.you.lastPlayedSpeaker;
  const hand = $("#hand");
  hand.textContent = "";
  state.you.hand.forEach((card, idx) => {
    const el = makeCardFace(card, { duelCtx: selfDuelCtx });
    el.dataset.index = String(idx);
    const payCost = effectivePlayCost(card, lastSp);
    const affordable = canPlay && payCost <= state.you.costPool;
    const combo = speakerComboReady(card, lastSp);

    if (!affordable) el.classList.add("disabled");
    if (combo && affordable) el.classList.add("card-combo-ready");

    if (canPlay && affordable) {
      const comboHint = combo ? "（発言者コンボ）" : "";
      el.title = `クリックで使用${comboHint} · Ctrl+クリックで拡大（Mac は ⌘）`;
    } else if (!canPlay) {
      el.title = "手番ではありません";
    } else {
      el.title = "空気が足りません";
    }

    el.addEventListener("click", (ev) => {
      if (ev.ctrlKey || ev.metaKey) {
        ev.preventDefault();
        ev.stopPropagation();
        openCardZoomPreview(card.id, { actorSlot: duelActorYou });
        return;
      }
      if (!canPlay || !affordable) return;
      playCardAction(idx);
    });
    hand.appendChild(el);
  });

  const btn = $("#btn-end-turn");
  btn.disabled = !isYourTurn;
  btn.textContent = "ターン終了";

  bindDuelLayoutMetricsOnce();
  renderDuelStatusRails(state);
  requestAnimationFrame(() => {
    updateDuelLogMaxHeight();
    requestAnimationFrame(updateDuelLogMaxHeight);
  });

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
  if (typeof ScgSfx !== "undefined") {
    if (youWin && !disconnect) ScgSfx.gameWin();
    else if (!youWin) ScgSfx.gameLose();
  }
  const deckOut = payload.reason === "deckOut";
  let detail = youWin
    ? deckOut
      ? "相手が山札切れとなり、デュエルを制しました。"
      : "相手のHPを0にし、デュエルを制しました。"
    : deckOut
      ? "山札切れにより、デュエルは続行できません。"
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
  const mergeInitialFromStatic = async () => {
    if (initialDeckIds.length === DECK_SIZE) return;
    const init = await fetch(resolveUrl("data/initial-deck.json")).then((r) => {
      if (!r.ok) throw new Error("initial");
      return r.json();
    });
    const ids = init.cardIds;
    if (Array.isArray(ids) && ids.length === DECK_SIZE) initialDeckIds = ids.slice();
  };

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
      await mergeInitialFromStatic();
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
  const bits = [card.id, card.speaker, card.text, card.name];
  for (const e of cardEffectList(card)) {
    bits.push(describeEffectShort(e));
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
    sub.textContent = v.ok
      ? `${DECK_SIZE} / ${DECK_SIZE} 枚（送信可）`
      : `${ids.length} / ${DECK_SIZE} 枚`;
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
      const atCap = n >= MAX_COPIES_PER_CARD || currentDeck.length >= DECK_SIZE;
      plus.disabled = atCap;
      plus.addEventListener("click", () => {
        const counts = {};
        for (const x of currentDeck) counts[x] = (counts[x] || 0) + 1;
        if ((counts[cid] || 0) >= MAX_COPIES_PER_CARD) {
          toast(`同じカードは${MAX_COPIES_PER_CARD}枚までです`);
          return;
        }
        if (currentDeck.length >= DECK_SIZE) {
          toast(`${DECK_SIZE}枚までです`);
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
      if ((counts[id] || 0) >= MAX_COPIES_PER_CARD) {
        toast(`同じカードは${MAX_COPIES_PER_CARD}枚までです`);
        return;
      }
      if (currentDeck.length >= DECK_SIZE) {
        toast(`${DECK_SIZE}枚までです`);
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
    st.textContent = `（あと ${DECK_SIZE - currentDeck.length} 枚で完成）`;
    st.className = "deck-status";
  }
}

function wireUi() {
  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (typeof ScgSfx !== "undefined") ScgSfx.uiTap();
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
      if (typeof ScgSfx !== "undefined") ScgSfx.uiTap();
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
      prefillLobbyDeckCodeFromSelect();
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
      prefillLobbyDeckCodeFromSelect();
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

  $("#btn-lobby-deck-apply")?.addEventListener("click", () => {
    const ta = document.getElementById("lobby-deck-code");
    const raw = ta?.value || "";
    const dec = decodeDeckCode(raw);
    if (!dec.ok || !dec.cardIds) {
      toast(dec.reason);
      return;
    }
    sendDeckToServer(dec.cardIds);
    toast("デッキコードを取り込み、接続先に設定しました");
  });

  $("#btn-lobby-deck-export")?.addEventListener("click", async () => {
    const ids = lobbyChosenDeckIds();
    if (!ids) {
      toast(`エクスポートできる${DECK_SIZE}枚のデッキがありません`);
      return;
    }
    const code = encodeDeckCode(ids);
    const ta = document.getElementById("lobby-deck-code");
    if (ta) ta.value = code;
    try {
      await navigator.clipboard.writeText(code);
      toast("デッキコードをコピーしました");
    } catch {
      toast("クリップボードにコピーできませんでした（欄に表示済みです）");
    }
  });

  $("#select-lobby-deck")?.addEventListener("change", (e) => {
    const v = e.target.value;
    localStorage.setItem(LS_LOBBY_DECK, v);
    prefillLobbyDeckCodeFromSelect();
    if (!skywaySession) return;
    let raw = null;
    if (v === "__initial__") {
      raw = initialDeckIds.length === DECK_SIZE ? initialDeckIds.slice() : null;
    } else {
      const d = loadDecksList().find((x) => x.id === v);
      raw =
        d?.cardIds && d.cardIds.length === DECK_SIZE ? d.cardIds.slice() : null;
    }
    if (!raw) {
      if (v === "__initial__") {
        toast("初期デッキが読み込めていません。カード一覧を開いてから戻ってください。");
      }
      return;
    }
    const v2 = validateDeckClient(raw);
    if (!v2.ok) {
      toast(v2.reason);
      return;
    }
    sendDeckToServer(raw);
  });

  $("#chk-ready").addEventListener("change", (e) => {
    const on = e.target.checked;
    if (on) {
      let raw = null;
      const sel = document.getElementById("select-lobby-deck");
      const key = sel?.value;
      if (key === "__initial__") {
        raw =
          initialDeckIds.length === DECK_SIZE ? initialDeckIds.slice() : null;
      } else if (key) {
        const d = loadDecksList().find((x) => x.id === key);
        raw =
          d?.cardIds && d.cardIds.length === DECK_SIZE ? d.cardIds.slice() : null;
      }
      const v = raw && validateDeckClient(raw);
      if (!v || !v.ok) {
        e.target.checked = false;
        toast(
          v?.reason ||
            `対戦用のデッキを選んでください（${DECK_SIZE}枚・同じカードは${MAX_COPIES_PER_CARD}枚まで）。`
        );
        return;
      }
    }
    sendReadyToServer(on);
  });

  $("#btn-end-turn").addEventListener("click", () => {
    endTurnAction();
  });

  $("#btn-duel-zoom-toggle")?.addEventListener("click", () => {
    if (typeof ScgSfx !== "undefined") ScgSfx.uiTap();
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

  $("#btn-deck-export-code")?.addEventListener("click", async () => {
    const v = validateDeckClient(currentDeck);
    if (!v.ok) {
      toast(`${DECK_SIZE}枚そろっていないためコード化できません`);
      return;
    }
    const code = encodeDeckCode(currentDeck);
    try {
      await navigator.clipboard.writeText(code);
      toast("デッキコードをコピーしました");
    } catch {
      window.prompt("コピーできない環境のため、手動でコピーしてください", code);
    }
  });

  $("#btn-deck-import-code")?.addEventListener("click", () => {
    const raw = window.prompt(
      `デッキコードを貼り付け（SCG1|で始まる${DECK_SIZE}枚）`
    );
    if (raw == null) return;
    const dec = decodeDeckCode(raw);
    if (!dec.ok || !dec.cardIds) {
      toast(dec.reason);
      return;
    }
    currentDeck = dec.cardIds.slice();
    renderDeckBuilder();
    toast("デッキ内容をコードから読み込みました（保存は「保存」で確定）");
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
