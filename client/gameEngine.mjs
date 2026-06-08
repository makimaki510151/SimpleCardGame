/**
 * 身内語録大戦 — ターン制 TCG エンジン（SkyWay ホスト権威）
 */
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const MAX_HP = 40;
export const DECK_SIZE = 40;
export const MAX_COPIES_PER_CARD = 4;
export const INITIAL_DRAW = 5;
export const MAX_COST_CAP = 10;
export const DRAW_PER_TURN = 1;
export const FIRST_PLAYER_INITIAL_MAX = 3;
export const SECOND_PLAYER_INITIAL_MAX = 4;

/** 発言トーン（属性） */
export const TONE = {
  PASSION: "passion",
  LOGICAL: "logical",
  CHAOS: "chaos",
  HABIT: "habit",
};

export const TONE_LABEL = {
  passion: "熱量",
  logical: "冷徹",
  chaos: "泥沼",
  habit: "口癖",
};

/** バフ状態 */
export const STATUS = {
  KAKUSEI: "kakusei",
  SHUCHU: "shuchu",
  GANKYO: "gankyo",
};

export const STATUS_LABEL = {
  kakusei: "覚醒",
  shuchu: "集中",
  gankyo: "頑強",
};

const MAX_LOG = 40;

function pushLog(game, slot, text, cardId, kind, meta) {
  if (!game.log) game.log = [];
  const entry = {
    seq: (game._logSeq = (game._logSeq | 0) + 1),
    turn: game.turnNumber | 0,
    slot,
    text,
    cardId: cardId || null,
    kind: kind || "play",
    meta: meta == null ? null : meta,
  };
  game.log.push(entry);
  if (game.log.length > MAX_LOG) game.log.splice(0, game.log.length - MAX_LOG);
}

export function cardTone(cardDef) {
  return cardDef?.tone || null;
}

export function cardHasTone(cardDef, tone) {
  return cardTone(cardDef) === tone;
}

function createEmptyStatuses() {
  return {
    kakusei: 0,
    shuchu: 0,
    gankyo: 0,
    pendingToneBoost: [],
    toneBoostTones: [],
    pendingToneBan: [],
    bannedTonesThisTurn: [],
  };
}

function toneAttributeBoost(st, cardDef) {
  const tone = cardTone(cardDef);
  if (!tone) return false;
  if ((st.shuchu | 0) > 0 && tone === TONE.PASSION) return true;
  return (st.toneBoostTones || []).includes(tone);
}

export function createPlayerState(deckIds) {
  const deck = shuffle(deckIds.slice());
  return {
    hp: MAX_HP,
    deck,
    hand: [],
    discard: [],
    costPool: 0,
    maxCost: 0,
    turnCount: 0,
    lastPlayedSpeaker: null,
    lastPlayedTone: null,
    lastPlayedCardId: null,
    lastPlayDiscardCount: 0,
    nextSpeakerDamageBuff: null,
    statuses: createEmptyStatuses(),
  };
}

function playerStatuses(p) {
  if (!p.statuses) p.statuses = createEmptyStatuses();
  return p.statuses;
}

/** 山札のみから引く（捨て札は戻さない）。不足分は引かない */
function drawCards(p, n) {
  const drawn = [];
  for (let i = 0; i < n; i++) {
    if (p.deck.length === 0) break;
    drawn.push(p.deck.pop());
  }
  return drawn;
}

/** ターン開始・初期手札用。山札が足りなければ ok: false */
function drawCardsStrict(p, n) {
  const need = n | 0;
  const drawn = [];
  for (let i = 0; i < need; i++) {
    if (p.deck.length === 0) {
      return { ok: false, drawn };
    }
    drawn.push(p.deck.pop());
  }
  return { ok: true, drawn };
}

function discardRandomFromHand(p, n, ctx, cardById) {
  const take = Math.min(n | 0, p.hand.length);
  if (take <= 0) return 0;
  const idxs = p.hand.map((_, i) => i);
  shuffle(idxs);
  const toRemove = idxs.slice(0, take).sort((a, b) => b - a);
  for (const ix of toRemove) {
    const id = p.hand.splice(ix, 1)[0];
    p.discard.push(id);
    if (ctx && cardById?.[id]?.tone) {
      if (!ctx.lastDiscardedTones) ctx.lastDiscardedTones = [];
      ctx.lastDiscardedTones.push(cardById[id].tone);
    }
  }
  return take;
}

function discardAllFromHand(p) {
  const n = p.hand.length;
  if (n <= 0) return 0;
  while (p.hand.length > 0) {
    p.discard.push(p.hand.pop());
  }
  return n;
}

function recordDiscard(ctx, n) {
  if (ctx && n > 0) ctx.discardCountThisPlay = (ctx.discardCountThisPlay | 0) + n;
}

function evalCondition(game, actorIndex, cond, ctx) {
  const self = game.players[actorIndex];
  const opp = game.players[1 - actorIndex];
  switch (cond.mode) {
    case "opponentHandGte":
      return opp.hand.length >= (cond.threshold | 0);
    case "selfHandGte":
      return self.hand.length >= (cond.threshold | 0);
    case "selfHpLte":
      return self.hp <= (cond.threshold | 0);
    case "opponentHpGte":
      return opp.hp >= (cond.threshold | 0);
    case "opponentHandLte":
      return opp.hand.length <= (cond.threshold | 0);
    case "opponentHpLte":
      return opp.hp <= (cond.threshold | 0);
    case "selfLastSpeakerIs":
      return self.lastPlayedSpeaker === cond.speaker;
    case "opponentLastSpeakerIs": {
      const oppSpeaker = opp.lastPlayedSpeaker;
      return oppSpeaker != null && oppSpeaker === cond.speaker;
    }
    case "opponentLastSpeakerIsNot": {
      const oppSpeaker = opp.lastPlayedSpeaker;
      return oppSpeaker == null || oppSpeaker !== cond.speaker;
    }
    case "opponentLastToneIs":
      return opp.lastPlayedTone != null && opp.lastPlayedTone === cond.tone;
    case "opponentLastToneIsNot":
      return opp.lastPlayedTone == null || opp.lastPlayedTone !== cond.tone;
    case "selfLastToneIs":
      return self.lastPlayedTone != null && self.lastPlayedTone === cond.tone;
    case "opponentHpGtSelfHp":
      return opp.hp > self.hp;
    case "selfHpGteOpponentHp":
      return self.hp >= opp.hp;
    case "opponentHandGtSelfHand":
      return opp.hand.length > self.hand.length;
    case "opponentHandLteSelfHand":
      return opp.hand.length <= self.hand.length;
    case "lastDiscardedToneIs":
      return (ctx?.lastDiscardedTones || []).includes(cond.tone);
    default:
      return false;
  }
}

function cardEffects(cardDef) {
  return cardDef.effect || cardDef.effects || [];
}

function speakerCostReduction(cardDef, speakerCombo) {
  if (!speakerCombo) return 0;
  const se = cardDef.speaker_effect;
  if (!se) return 1;
  if (se.cost_reduction != null) return Math.max(0, se.cost_reduction | 0);
  return 1;
}

export function effectivePlayCost(cardDef, lastPlayedSpeaker, statuses = {}) {
  const base = cardDef.cost | 0;
  const speaker = cardDef.speaker;
  const hasCombo =
    !!speaker && lastPlayedSpeaker != null && speaker === lastPlayedSpeaker;
  let reduction = 0;
  if (hasCombo) {
    reduction = speakerCostReduction(cardDef, true);
    if ((statuses.gankyo | 0) > 0) reduction += 1;
  }
  if (toneAttributeBoost(statuses, cardDef)) {
    reduction += 1;
  }
  return Math.max(0, base - reduction);
}

function damageMultiplier(cardDef, speakerCombo, game, actorIndex, gankyoActive) {
  if (!speakerCombo) return 1;
  const se = cardDef.speaker_effect;
  if (!se) return 1;
  let mult = 1;
  if (se.damage_multiplier_if) {
    const cond = se.damage_multiplier_if;
    if (evalCondition(game, actorIndex, cond, null)) {
      mult = Math.max(1, cond.multiplier | 0);
    }
  } else if (se.damage_multiplier != null) {
    mult = Math.max(1, se.damage_multiplier | 0);
  }
  if (gankyoActive && mult > 1) mult += 1;
  return mult;
}

function scaledDamage(value, mult, flatBonus) {
  return Math.max(0, ((value | 0) + (flatBonus | 0)) * mult);
}

function calcHpDiffDamage(self, opp, maxCap) {
  if (opp.hp <= self.hp) return 0;
  const diff = Math.floor((opp.hp - self.hp) / 2);
  const cap = maxCap == null ? diff : (maxCap | 0);
  return Math.min(diff, cap);
}

function checkWinner(game) {
  if (game.players[0].hp <= 0) return 1;
  if (game.players[1].hp <= 0) return 0;
  return null;
}

function applyStatus(target, status, turns, addTurns) {
  const st = playerStatuses(target);
  const t = Math.max(1, turns | 0);
  switch (status) {
    case STATUS.KAKUSEI:
      st.kakusei = addTurns
        ? (st.kakusei | 0) + t
        : Math.max(st.kakusei | 0, t);
      break;
    case STATUS.SHUCHU:
      st.shuchu = addTurns
        ? (st.shuchu | 0) + t
        : Math.max(st.shuchu | 0, t);
      break;
    case STATUS.GANKYO:
      st.gankyo = addTurns
        ? (st.gankyo | 0) + t
        : Math.max(st.gankyo | 0, t);
      break;
    default:
      break;
  }
}

function onTurnStartStatuses(p) {
  const st = playerStatuses(p);
  if (st.pendingToneBoost?.length) {
    st.toneBoostTones = st.pendingToneBoost.slice();
    st.pendingToneBoost = [];
  } else {
    st.toneBoostTones = [];
  }
  if (st.pendingToneBan?.length) {
    st.bannedTonesThisTurn = st.pendingToneBan.slice();
    st.pendingToneBan = [];
  } else {
    st.bannedTonesThisTurn = [];
  }
}

function onTurnEndStatuses(p) {
  const st = playerStatuses(p);
  if (st.kakusei > 0) st.kakusei -= 1;
  if (st.shuchu > 0) st.shuchu -= 1;
  if (st.gankyo > 0) st.gankyo -= 1;
  st.toneBoostTones = [];
  st.bannedTonesThisTurn = [];
}

function publicStatuses(p) {
  const st = playerStatuses(p);
  return {
    kakusei: st.kakusei | 0,
    shuchu: st.shuchu | 0,
    gankyo: st.gankyo | 0,
    toneBoostTones: (st.toneBoostTones || []).slice(),
    pendingToneBoost: (st.pendingToneBoost || []).slice(),
    bannedTonesThisTurn: (st.bannedTonesThisTurn || []).slice(),
  };
}

function describeIfClause(e) {
  const th = e.threshold | 0;
  switch (e.mode) {
    case "opponentHandGte":
      return `相手手札${th}枚以上`;
    case "selfHandGte":
      return `自身手札${th}枚以上`;
    case "opponentHandLte":
      return `相手手札${th}枚以下`;
    case "selfHpLte":
      return `自身HP${th}以下`;
    case "opponentHpGte":
      return `相手HP${th}以上`;
    case "opponentHpLte":
      return `相手HP${th}以下`;
    case "selfLastSpeakerIs":
      return `直前が「${e.speaker || "?"}」`;
    case "opponentLastSpeakerIs":
      return `相手直前が「${e.speaker || "?"}」`;
    case "opponentLastSpeakerIsNot":
      return `相手直前が「${e.speaker || "?"}」以外`;
    case "opponentLastToneIs":
      return `相手直前が【${TONE_LABEL[e.tone] || e.tone || "?"}】`;
    case "opponentLastToneIsNot":
      return `相手直前が【${TONE_LABEL[e.tone] || e.tone || "?"}】以外`;
    case "selfLastToneIs":
      return `直前が【${TONE_LABEL[e.tone] || e.tone || "?"}】`;
    case "opponentHpGtSelfHp":
      return "相手HP>自身HP";
    case "selfHpGteOpponentHp":
      return "自身HP≧相手HP";
    case "opponentHandGtSelfHand":
      return "相手手札>自身手札";
    case "opponentHandLteSelfHand":
      return "相手手札≦自身手札";
    case "lastDiscardedToneIs":
      return `捨てた【${TONE_LABEL[e.tone] || e.tone || "?"}】`;
    default:
      return "？";
  }
}

function describeEffectLine(e) {
  const v = e.value | 0;
  switch (e.type) {
    case "damage":
      return `相手に${v}ダメージ`;
    case "damageIf":
      return `${describeIfClause(e)}で相手に${v}ダメージ`;
    case "heal":
      return `自身回復${v}`;
    case "healIf":
      return `${describeIfClause(e)}で自身回復${v}`;
    case "draw":
      return `ドロー${v}`;
    case "discardSelf":
      return `自身手札ランダム廃棄${v}`;
    case "damageSelf":
      return `自身に${v}ダメージ`;
    case "damageSelfIf":
      return `${describeIfClause(e)}で自身に${v}ダメージ`;
    case "drawIf":
      return `${describeIfClause(e)}でドロー${v}`;
    case "discardAllSelf":
      return "自身の手札をすべて捨てる";
    case "statusOpponentIf":
      return `${describeIfClause(e)}で相手に${STATUS_LABEL[e.status] || e.status}${e.turns | 0}T`;
    case "damageFromPrevDiscard":
      return `直前「${e.prevCardId || "?"}」の捨て枚数ダメ`;
    case "damageFromHpDiff":
      return `HP差半分ダメ${e.max != null ? `(最大${e.max | 0})` : ""}`;
    case "damageFromOpponentHandIf":
      return `${describeIfClause(e)}で相手手札数ダメ${e.max != null ? `(最大${e.max | 0})` : ""}`;
    case "statusSelfIf":
      return `${describeIfClause(e)}で自身に${STATUS_LABEL[e.status] || e.status}${e.turns | 0}T`;
    case "statusOpponentAdd":
      return `相手に${STATUS_LABEL[e.status] || e.status}+${e.turns | 0}T`;
    case "statusSelfAdd":
      return `自身に${STATUS_LABEL[e.status] || e.status}+${e.turns | 0}T`;
    case "toneBanOpponent":
      return `相手次T属性封じ`;
    case "toneBoostSelf": {
      const labels = (e.tones || [])
        .map((t) => TONE_LABEL[t] || t)
        .join("・");
      return `自身次T【${labels}】強化`;
    }
    default:
      break;
  }
  switch (e.type) {
    case "statusOpponent":
      return `相手に${STATUS_LABEL[e.status] || e.status}${e.turns | 0}T`;
    case "statusSelf":
      return `自身に${STATUS_LABEL[e.status] || e.status}${e.turns | 0}T`;
    default:
      return e.type || "?";
  }
}

function applyEffectList(game, actorIndex, effects, ctx) {
  const opponentIndex = 1 - actorIndex;
  const self = game.players[actorIndex];
  const opp = game.players[opponentIndex];
  const mult = ctx?.damageMultiplier || 1;
  const flatBonus = ctx?.damageFlatBonus || 0;
  const skipSelfDmg = !!ctx?.negateSelfDamage;
  const cardById = ctx?.cardById;

  for (const e of effects || []) {
    if (e.type === "damage") {
      const d = scaledDamage(e.value, mult, flatBonus);
      opp.hp = Math.max(0, opp.hp - d);
    } else if (e.type === "heal") {
      self.hp = Math.min(MAX_HP, self.hp + (e.value | 0));
    } else if (e.type === "draw") {
      const drawn = drawCards(self, e.value | 0);
      self.hand.push(...drawn);
    } else if (e.type === "drawIf") {
      if (evalCondition(game, actorIndex, e, ctx)) {
        const drawn = drawCards(self, e.value | 0);
        self.hand.push(...drawn);
      }
    } else if (e.type === "discardSelf") {
      if (!ctx?.negateSelfDiscard) {
        recordDiscard(
          ctx,
          discardRandomFromHand(self, e.value | 0, ctx, cardById)
        );
      }
    } else if (e.type === "discardAllSelf") {
      if (!ctx?.negateSelfDiscard) {
        recordDiscard(ctx, discardAllFromHand(self));
      }
    } else if (e.type === "damageSelf") {
      if (!skipSelfDmg) {
        self.hp = Math.max(0, self.hp - (e.value | 0));
      }
    } else if (e.type === "damageIf") {
      if (evalCondition(game, actorIndex, e, ctx)) {
        const d = scaledDamage(e.value, mult, flatBonus);
        opp.hp = Math.max(0, opp.hp - d);
      }
    } else if (e.type === "damageSelfIf") {
      if (!skipSelfDmg && evalCondition(game, actorIndex, e, ctx)) {
        self.hp = Math.max(0, self.hp - (e.value | 0));
      }
    } else if (e.type === "healIf") {
      if (evalCondition(game, actorIndex, e, ctx)) {
        self.hp = Math.min(MAX_HP, self.hp + (e.value | 0));
      }
    } else if (e.type === "damageFromHpDiff") {
      const raw = calcHpDiffDamage(self, opp, e.max);
      if (raw > 0) {
        const d = scaledDamage(raw, mult, flatBonus);
        opp.hp = Math.max(0, opp.hp - d);
      }
    } else if (e.type === "damageFromOpponentHandIf") {
      if (evalCondition(game, actorIndex, e, ctx)) {
        let raw = opp.hand.length;
        if (e.max != null) raw = Math.min(raw, e.max | 0);
        if (raw > 0) {
          const d = scaledDamage(raw, mult, flatBonus);
          opp.hp = Math.max(0, opp.hp - d);
        }
      }
    } else if (e.type === "statusOpponent") {
      applyStatus(opp, e.status, e.turns ?? 1);
    } else if (e.type === "statusOpponentAdd") {
      applyStatus(opp, e.status, e.turns ?? 1, true);
    } else if (e.type === "statusOpponentIf") {
      if (evalCondition(game, actorIndex, e, ctx)) {
        applyStatus(opp, e.status, e.turns ?? 1);
      }
    } else if (e.type === "statusSelf") {
      applyStatus(self, e.status, e.turns ?? 1);
    } else if (e.type === "statusSelfIf") {
      if (evalCondition(game, actorIndex, e, ctx)) {
        applyStatus(self, e.status, e.turns ?? 1);
      }
    } else if (e.type === "statusSelfAdd") {
      applyStatus(self, e.status, e.turns ?? 1, true);
    } else if (e.type === "toneBanOpponent") {
      const ost = playerStatuses(opp);
      ost.pendingToneBan = (e.tones || []).slice();
    } else if (e.type === "toneBoostSelf") {
      const sst = playerStatuses(self);
      sst.pendingToneBoost = (e.tones || []).slice();
    } else if (e.type === "damageFromPrevDiscard") {
      const prevId = e.prevCardId;
      if (prevId && ctx?.prevCardId === prevId && (ctx.prevDiscardCount | 0) > 0) {
        const d = scaledDamage(ctx.prevDiscardCount, mult, flatBonus);
        opp.hp = Math.max(0, opp.hp - d);
      }
    }
  }
}

/**
 * ゲーム開始 — 両者に初期手札5枚 → 先攻ターン開始（+1ドロー）
 */
export function startGame(game, firstPlayer = 0) {
  game.firstPlayer = firstPlayer | 0;
  game.turnNumber = 0;
  game.activePlayer = null;

  for (let i = 0; i < 2; i++) {
    const res = drawCardsStrict(game.players[i], INITIAL_DRAW);
    if (!res.ok) {
      pushLog(
        game,
        i,
        `初期手札${INITIAL_DRAW}枚を引けず山札切れ — 敗北`,
        null,
        "system",
        { deckOut: true }
      );
      return { winnerIndex: 1 - i };
    }
    game.players[i].hand.push(...res.drawn);
    pushLog(game, i, `初期手札 ${INITIAL_DRAW} 枚`, null, "system");
  }

  const turnRes = startTurn(game, game.firstPlayer);
  if (turnRes?.winnerIndex !== undefined) {
    return { winnerIndex: turnRes.winnerIndex };
  }
  return { ok: true };
}

/**
 * ターン開始フェイズ
 */
export function startTurn(game, playerIndex) {
  const p = game.players[playerIndex];
  onTurnStartStatuses(p);

  if (p.turnCount === 0) {
    p.maxCost =
      playerIndex === game.firstPlayer
        ? FIRST_PLAYER_INITIAL_MAX
        : SECOND_PLAYER_INITIAL_MAX;
  } else {
    p.maxCost = Math.min(MAX_COST_CAP, p.maxCost + 1);
  }
  p.turnCount += 1;
  p.costPool = p.maxCost;
  p.lastPlayedSpeaker = null;
  p.lastPlayedTone = null;
  p.nextSpeakerDamageBuff = null;

  const drawRes = drawCardsStrict(p, DRAW_PER_TURN);
  if (!drawRes.ok) {
    const winner = 1 - playerIndex;
    pushLog(
      game,
      playerIndex,
      "ターン開始ドロー時に山札切れ — 敗北",
      null,
      "system",
      { deckOut: true }
    );
    return { winnerIndex: winner };
  }
  p.hand.push(...drawRes.drawn);

  game.turnNumber = (game.turnNumber | 0) + 1;
  game.activePlayer = playerIndex;

  const st = playerStatuses(p);
  const statusBits = [];
  if (st.kakusei > 0) statusBits.push(`覚醒${st.kakusei}T`);
  if (st.shuchu > 0) statusBits.push(`集中${st.shuchu}T`);
  if (st.gankyo > 0) statusBits.push(`頑強${st.gankyo}T`);
  if (st.toneBoostTones?.length) {
    statusBits.push(
      `強化:${st.toneBoostTones.map(toneBanLabel).join("・")}`
    );
  }
  if (st.bannedTonesThisTurn?.length) {
    statusBits.push(
      `封じ:${st.bannedTonesThisTurn.map(toneBanLabel).join("・")}`
    );
  }

  const who = playerIndex === game.firstPlayer ? "先攻" : "後攻";
  let logText = `ターン${game.turnNumber} — ${who}の手番（コスト ${p.costPool}/${p.maxCost}）`;
  if (statusBits.length) logText += ` [${statusBits.join("・")}]`;
  pushLog(game, playerIndex, logText, null, "system");
  return { ok: true };
}

function toneBanLabel(tone) {
  return TONE_LABEL[tone] || tone;
}

export function canPlayCard(game, playerIndex, cardDef) {
  const p = game.players[playerIndex];
  const st = playerStatuses(p);
  const tone = cardTone(cardDef);
  if (tone && (st.bannedTonesThisTurn || []).includes(tone)) {
    const labels = (st.bannedTonesThisTurn || []).map(toneBanLabel).join("・");
    return {
      ok: false,
      reason: `属性封じのため【${toneBanLabel(tone)}】カードはプレイできません。（封じ: ${labels}）`,
    };
  }
  return { ok: true };
}

export function playCard(game, playerIndex, handIndex, cardById) {
  if (game.activePlayer !== playerIndex) {
    return { ok: false, reason: "手番ではありません。" };
  }
  const p = game.players[playerIndex];
  if (handIndex < 0 || handIndex >= p.hand.length) {
    return { ok: false, reason: "手札が不正です。" };
  }

  const cardId = p.hand[handIndex];
  const def = cardById[cardId];
  if (!def) return { ok: false, reason: "カード定義がありません。" };

  const can = canPlayCard(game, playerIndex, def);
  if (!can.ok) return can;

  const st = playerStatuses(p);
  const speakerCombo =
    !!def.speaker &&
    p.lastPlayedSpeaker != null &&
    def.speaker === p.lastPlayedSpeaker;
  const gankyoActive = (st.gankyo | 0) > 0;

  const payCost = effectivePlayCost(def, p.lastPlayedSpeaker, st);
  if (payCost > p.costPool) {
    return { ok: false, reason: "コストが足りません。" };
  }

  p.costPool -= payCost;
  p.hand.splice(handIndex, 1);
  p.discard.push(cardId);

  let damageFlatBonus = 0;
  if (
    p.nextSpeakerDamageBuff?.speaker &&
    def.speaker === p.nextSpeakerDamageBuff.speaker
  ) {
    damageFlatBonus = p.nextSpeakerDamageBuff.bonus | 0;
    p.nextSpeakerDamageBuff = null;
  }
  if (toneAttributeBoost(st, def)) {
    damageFlatBonus += 1;
  }
  if (gankyoActive && speakerCombo) {
    damageFlatBonus += 1;
  }

  const se = def.speaker_effect;
  const ctx = {
    damageMultiplier: damageMultiplier(
      def,
      speakerCombo,
      game,
      playerIndex,
      gankyoActive
    ),
    speakerCombo,
    damageFlatBonus,
    cardById,
    negateSelfDamage:
      speakerCombo && !!se?.negate_self_damage,
    negateSelfDiscard:
      speakerCombo && !!se?.negate_self_discard,
    prevCardId: p.lastPlayedCardId,
    prevDiscardCount: p.lastPlayDiscardCount | 0,
    discardCountThisPlay: 0,
    lastDiscardedTones: [],
  };

  if (speakerCombo && se?.effects?.length) {
    applyEffectList(game, playerIndex, se.effects, ctx);
  }

  applyEffectList(game, playerIndex, cardEffects(def), ctx);

  if (speakerCombo && se?.post_effects?.length) {
    applyEffectList(game, playerIndex, se.post_effects, ctx);
  }

  if (speakerCombo && se?.set_next_speaker_damage_buff) {
    p.nextSpeakerDamageBuff = { ...se.set_next_speaker_damage_buff };
  }

  p.lastPlayedSpeaker = def.speaker || null;
  p.lastPlayedTone = def.tone || null;
  p.lastPlayedCardId = cardId;
  p.lastPlayDiscardCount = ctx.discardCountThisPlay | 0;

  const opp = game.players[1 - playerIndex];
  if ((st.kakusei | 0) > 0) {
    opp.hp = Math.max(0, opp.hp - 1);
    pushLog(
      game,
      playerIndex,
      "覚醒 — 相手に1ダメージ",
      cardId,
      "status",
      { status: "kakusei" }
    );
  }

  const label = def.text || def.name || cardId;
  const effText = cardEffects(def).map(describeEffectLine).join(" / ");
  let logText = label;
  if (speakerCombo) {
    logText += gankyoActive ? "（発言者コンボ・頑強）" : "（発言者コンボ）";
  } else if (toneAttributeBoost(st, def)) {
    logText += (st.shuchu | 0) > 0 ? "（集中）" : "（属性強化）";
  }
  if (effText) logText += ` — ${effText}`;
  if (payCost !== (def.cost | 0)) {
    logText += ` [コスト${def.cost}→${payCost}]`;
  }
  pushLog(game, playerIndex, logText, cardId, "play", {
    speakerCombo,
    payCost,
    kakusei: (st.kakusei | 0) > 0,
    shuchu: (st.shuchu | 0) > 0,
    gankyo: gankyoActive,
  });

  const winner = checkWinner(game);
  if (winner !== null) {
    return { ok: true, winnerIndex: winner };
  }
  return { ok: true, speakerCombo };
}

export function endTurn(game, playerIndex) {
  if (game.activePlayer !== playerIndex) {
    return { ok: false, reason: "手番ではありません。" };
  }

  onTurnEndStatuses(game.players[playerIndex]);
  pushLog(game, playerIndex, "ターン終了", null, "endTurn");

  const next = 1 - playerIndex;
  const turnRes = startTurn(game, next);
  if (turnRes?.winnerIndex !== undefined) {
    return { ok: true, winnerIndex: turnRes.winnerIndex };
  }
  return { ok: true };
}

export function publicSnapshot(game, viewerIndex, cardById) {
  const oppIndex = 1 - viewerIndex;
  const self = game.players[viewerIndex];
  const opp = game.players[oppIndex];
  return {
    you: {
      hp: self.hp,
      maxHp: MAX_HP,
      hand: self.hand.map((id) => cardById[id]),
      deckCount: self.deck.length,
      discardCount: self.discard.length,
      costPool: self.costPool,
      maxCost: self.maxCost,
      lastPlayedSpeaker: self.lastPlayedSpeaker,
      lastPlayedTone: self.lastPlayedTone,
      turnCount: self.turnCount,
      statuses: publicStatuses(self),
    },
    opponent: {
      hp: opp.hp,
      maxHp: MAX_HP,
      handCount: opp.hand.length,
      deckCount: opp.deck.length,
      discardCount: opp.discard.length,
      lastPlayedSpeaker: opp.lastPlayedSpeaker,
      lastPlayedTone: opp.lastPlayedTone,
      costPool: opp.costPool,
      maxCost: opp.maxCost,
      statuses: publicStatuses(opp),
    },
    turnNumber: game.turnNumber,
    activePlayer: game.activePlayer,
    isYourTurn: game.activePlayer === viewerIndex,
    firstPlayer: game.firstPlayer,
    youAre: viewerIndex,
    battleLog: (game.log || []).slice(),
  };
}
