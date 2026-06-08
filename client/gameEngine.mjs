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

export const MAX_HP = 20;
export const DECK_SIZE = 40;
export const MAX_COPIES_PER_CARD = 4;
export const INITIAL_DRAW = 5;
export const MAX_COST_CAP = 10;
export const DRAW_PER_TURN = 1;
export const FIRST_PLAYER_INITIAL_MAX = 3;
export const SECOND_PLAYER_INITIAL_MAX = 4;

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
  };
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

function discardRandomFromHand(p, n) {
  const take = Math.min(n | 0, p.hand.length);
  if (take <= 0) return;
  const idxs = p.hand.map((_, i) => i);
  shuffle(idxs);
  const toRemove = idxs.slice(0, take).sort((a, b) => b - a);
  for (const ix of toRemove) {
    const id = p.hand.splice(ix, 1)[0];
    p.discard.push(id);
  }
}

function evalCondition(game, actorIndex, cond) {
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

export function effectivePlayCost(cardDef, lastPlayedSpeaker) {
  const base = cardDef.cost | 0;
  const speaker = cardDef.speaker;
  if (!speaker || !lastPlayedSpeaker || speaker !== lastPlayedSpeaker) {
    return base;
  }
  const reduction = speakerCostReduction(cardDef, true);
  return Math.max(0, base - reduction);
}

function damageMultiplier(cardDef, speakerCombo) {
  if (!speakerCombo) return 1;
  const se = cardDef.speaker_effect;
  if (!se || se.damage_multiplier == null) return 1;
  return Math.max(1, se.damage_multiplier | 0);
}

function scaledDamage(value, mult) {
  return Math.max(0, (value | 0) * mult);
}

function checkWinner(game) {
  if (game.players[0].hp <= 0) return 1;
  if (game.players[1].hp <= 0) return 0;
  return null;
}

function describeEffectLine(e) {
  const v = e.value | 0;
  switch (e.type) {
    case "damage":
      return `相手に${v}ダメージ`;
    case "damageIf":
      return `条件で相手に${v}ダメージ`;
    case "heal":
      return `自身回復${v}`;
    case "healIf":
      return `条件で自身回復${v}`;
    case "draw":
      return `ドロー${v}`;
    case "discardSelf":
      return `自身手札ランダム廃棄${v}`;
    default:
      return e.type || "?";
  }
}

function applyEffectList(game, actorIndex, effects, ctx) {
  const opponentIndex = 1 - actorIndex;
  const self = game.players[actorIndex];
  const opp = game.players[opponentIndex];
  const mult = ctx.damageMultiplier || 1;

  for (const e of effects || []) {
    if (e.type === "damage") {
      const d = scaledDamage(e.value, mult);
      opp.hp = Math.max(0, opp.hp - d);
    } else if (e.type === "heal") {
      self.hp = Math.min(MAX_HP, self.hp + (e.value | 0));
    } else if (e.type === "draw") {
      const drawn = drawCards(self, e.value | 0);
      self.hand.push(...drawn);
    } else if (e.type === "discardSelf") {
      discardRandomFromHand(self, e.value | 0);
    } else if (e.type === "damageIf") {
      if (evalCondition(game, actorIndex, e)) {
        const d = scaledDamage(e.value, mult);
        opp.hp = Math.max(0, opp.hp - d);
      }
    } else if (e.type === "healIf") {
      if (evalCondition(game, actorIndex, e)) {
        self.hp = Math.min(MAX_HP, self.hp + (e.value | 0));
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
    pushLog(
      game,
      i,
      `初期手札 ${INITIAL_DRAW} 枚`,
      null,
      "system"
    );
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

  const who = playerIndex === game.firstPlayer ? "先攻" : "後攻";
  pushLog(
    game,
    playerIndex,
    `ターン${game.turnNumber} — ${who}の手番（空気 ${p.costPool}/${p.maxCost}）`,
    null,
    "system"
  );
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

  const speakerCombo =
    !!def.speaker &&
    p.lastPlayedSpeaker != null &&
    def.speaker === p.lastPlayedSpeaker;

  const payCost = effectivePlayCost(def, p.lastPlayedSpeaker);
  if (payCost > p.costPool) {
    return { ok: false, reason: "コスト（空気）が足りません。" };
  }

  p.costPool -= payCost;
  p.hand.splice(handIndex, 1);
  p.discard.push(cardId);

  const ctx = {
    damageMultiplier: damageMultiplier(def, speakerCombo),
    speakerCombo,
  };

  if (speakerCombo) {
    const se = def.speaker_effect;
    if (se?.effects?.length) {
      applyEffectList(game, playerIndex, se.effects, ctx);
    }
  }

  applyEffectList(game, playerIndex, cardEffects(def), ctx);

  p.lastPlayedSpeaker = def.speaker || null;

  const label = def.text || def.name || cardId;
  const effText = cardEffects(def).map(describeEffectLine).join(" / ");
  let logText = label;
  if (speakerCombo) {
    logText += "（発言者コンボ）";
  }
  if (effText) logText += ` — ${effText}`;
  if (payCost !== (def.cost | 0)) {
    logText += ` [コスト${def.cost}→${payCost}]`;
  }
  pushLog(game, playerIndex, logText, cardId, "play", {
    speakerCombo,
    payCost,
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
      turnCount: self.turnCount,
    },
    opponent: {
      hp: opp.hp,
      maxHp: MAX_HP,
      hand: opp.hand.map((id) => cardById[id]),
      handCount: opp.hand.length,
      deckCount: opp.deck.length,
      discardCount: opp.discard.length,
      lastPlayedSpeaker: opp.lastPlayedSpeaker,
      costPool: opp.costPool,
      maxCost: opp.maxCost,
    },
    turnNumber: game.turnNumber,
    activePlayer: game.activePlayer,
    isYourTurn: game.activePlayer === viewerIndex,
    firstPlayer: game.firstPlayer,
    youAre: viewerIndex,
    battleLog: (game.log || []).slice(),
  };
}
