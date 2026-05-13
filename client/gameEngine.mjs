/**
 * SkyWay ホスト用ゲームエンジン。効果を追加したら server/cardBalance.js の集計も見直す。
 * ルール: 同時行動 → 両者「確定」後に交戦力を比較し差分ダメージ。先確定で交戦力ボーナス。
 */
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const MAX_HP = 50;
export const MAX_COST_PER_TURN = 5;
export const DRAW_PER_TURN = 5;
/** 先にラウンド確定したプレイヤーに付与される交戦力ボーナス（蓄積に加算） */
export const FIRST_LOCK_ATTACK_BONUS = 2;

const MAX_LOG = 40;

function pushLog(game, slot, text, cardId, kind) {
  if (!game.log) game.log = [];
  const entry = {
    seq: (game._logSeq = (game._logSeq | 0) + 1),
    round: game.roundNumber | 0,
    slot,
    text,
    cardId: cardId || null,
    kind: kind || "play",
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
    costPool: MAX_COST_PER_TURN,
    turnMaxCost: MAX_COST_PER_TURN,
    costCapOnNextTurn: null,
    attackStock: 0,
    roundLocked: false,
    /** このプレイヤーが次にカードを使おうとしたとき、回数分プレイが無効化される */
    negateIncomingPlays: 0,
    /** 先行確定時に attackStock へ加算する分（カード使用時に蓄積） */
    pendingFirstLockAttack: 0,
  };
}

function reshuffleDiscardIntoDeck(p) {
  if (p.discard.length === 0) return;
  const pile = shuffle(p.discard.slice());
  p.deck.push(...pile);
  p.discard.length = 0;
}

function drawCards(p, n) {
  const drawn = [];
  for (let i = 0; i < n; i++) {
    if (p.deck.length === 0) {
      reshuffleDiscardIntoDeck(p);
    }
    if (p.deck.length === 0) break;
    drawn.push(p.deck.pop());
  }
  return drawn;
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
    default:
      return false;
  }
}

function discardEntireHand(p) {
  while (p.hand.length > 0) {
    p.discard.push(p.hand.pop());
  }
}

function applyCostCapForRound(p) {
  const cap =
    p.costCapOnNextTurn != null
      ? Math.max(1, Math.min(MAX_COST_PER_TURN, p.costCapOnNextTurn | 0))
      : MAX_COST_PER_TURN;
  p.costCapOnNextTurn = null;
  p.turnMaxCost = cap;
  p.costPool = cap;
}

/**
 * 新ラウンド開始: 両者ドロー・コスト更新・ロック解除
 */
export function startRound(game) {
  for (const p of game.players) {
    p.roundLocked = false;
    p.attackStock = 0;
    p.pendingFirstLockAttack = 0;
    applyCostCapForRound(p);
    const drawn = drawCards(p, DRAW_PER_TURN);
    p.hand.push(...drawn);
  }
  game.firstLocker = null;
  pushLog(
    game,
    null,
    `ラウンド ${game.roundNumber} — 同時行動。カードを使い「確定」で交戦へ`,
    null,
    "system"
  );
}

function sumDiscardSelfChoose(effects) {
  let n = 0;
  for (const e of effects || []) {
    if (e.type === "discardSelfChoose") n += e.value | 0;
  }
  return n;
}

function describeEffectLine(e) {
  const v = e.value | 0;
  switch (e.type) {
    case "damage":
      return `交戦力${v}`;
    case "damageIf":
      return `交戦力${v}（条件）`;
    case "heal":
      return `自身回復${v}`;
    case "draw":
      return `カードドロー${v}`;
    case "discardSelf":
      return `自身手札ランダム廃棄${v}`;
    case "discardSelfChoose":
      return `自身手札選択廃棄${v}`;
    case "discardOpponent":
      return `相手手札ランダム廃棄${v}`;
    case "negateOpponentNextPlay":
      return `相手次プレイ無効${Math.max(1, v || 1)}`;
    case "healIf":
      return `自身回復${v}（条件）`;
    case "capOpponentNextTurn":
      return `次ターン相手コスト上限${e.cap | 0}`;
    case "damageSelf":
      return `自身ダメージ${v}`;
    case "attackIfFirstLockerResolve":
      return `先行確定時交戦力${v}`;
    default:
      return e.type || "?";
  }
}

function applyCardEffects(game, actorIndex, cardDef, ctx = {}) {
  const opponentIndex = 1 - actorIndex;
  const self = game.players[actorIndex];
  const opp = game.players[opponentIndex];
  const effects = cardDef.effects || [];
  const choosePool =
    ctx.chooseDiscardPool && ctx.chooseDiscardPool.length
      ? ctx.chooseDiscardPool
      : null;
  for (const e of effects) {
    if (e.type === "damage") {
      self.attackStock += e.value | 0;
    } else if (e.type === "heal") {
      self.hp = Math.min(MAX_HP, self.hp + (e.value | 0));
    } else if (e.type === "draw") {
      const drawn = drawCards(self, e.value | 0);
      self.hand.push(...drawn);
    } else if (e.type === "discardSelf") {
      discardRandomFromHand(self, e.value | 0);
    } else if (e.type === "discardSelfChoose") {
      const n = e.value | 0;
      for (let k = 0; k < n; k++) {
        if (!choosePool || choosePool.length === 0) break;
        const ix = choosePool.shift();
        if (ix < 0 || ix >= self.hand.length) break;
        const id = self.hand.splice(ix, 1)[0];
        self.discard.push(id);
      }
    } else if (
      e.type === "discardOpponent" ||
      e.type === "negateOpponentNextPlay"
    ) {
      const n = Math.max(1, e.value | 0);
      opp.negateIncomingPlays = (opp.negateIncomingPlays | 0) + n;
    } else if (e.type === "damageIf") {
      if (evalCondition(game, actorIndex, e)) {
        self.attackStock += e.value | 0;
      }
    } else if (e.type === "healIf") {
      if (evalCondition(game, actorIndex, e)) {
        self.hp = Math.min(MAX_HP, self.hp + (e.value | 0));
      }
    } else if (e.type === "capOpponentNextTurn") {
      const cap = Math.max(1, Math.min(MAX_COST_PER_TURN, e.cap | 0));
      opp.costCapOnNextTurn = cap;
    } else if (e.type === "damageSelf") {
      self.hp = Math.max(0, self.hp - (e.value | 0));
    } else if (e.type === "attackIfFirstLockerResolve") {
      self.pendingFirstLockAttack =
        (self.pendingFirstLockAttack | 0) + (e.value | 0);
    }
  }
}

export function playCard(game, playerIndex, handIndex, cardById, opts = {}) {
  const p = game.players[playerIndex];
  if (p.roundLocked) {
    return { ok: false, reason: "確定済みのためカードは使えません。" };
  }
  if (handIndex < 0 || handIndex >= p.hand.length) {
    return { ok: false, reason: "手札が不正です。" };
  }

  if (p.negateIncomingPlays > 0) {
    p.negateIncomingPlays -= 1;
    const wouldId = p.hand[handIndex];
    const wouldName = cardById[wouldId]?.name || wouldId;
    pushLog(
      game,
      playerIndex,
      `無効化 — ${wouldName} は発動しなかった（相手の妨害）`,
      wouldId,
      "negate"
    );
    return { ok: true, negated: true };
  }

  const cardId = p.hand[handIndex];
  const def = cardById[cardId];
  if (!def) return { ok: false, reason: "カード定義がありません。" };
  const cost = def.cost | 0;
  if (cost > p.costPool) {
    return { ok: false, reason: "コストが足りません。" };
  }

  const needChoose = sumDiscardSelfChoose(def.effects);
  const picks = opts.discardPicks;
  const L = p.hand.length;
  if (needChoose > 0) {
    if (!Array.isArray(picks) || picks.length !== needChoose) {
      return {
        ok: false,
        reason: `このカードは使用時に手札を${needChoose}枚選んで捨てる必要があります。`,
      };
    }
    if (L - 1 < needChoose) {
      return { ok: false, reason: "選んで捨てる手札が足りません。" };
    }
    const uniq = new Set(picks);
    if (uniq.size !== picks.length) {
      return { ok: false, reason: "捨てる手札の指定が重複しています。" };
    }
    for (const ix of picks) {
      const n = ix | 0;
      if (n < 0 || n >= L - 1) {
        return { ok: false, reason: "捨てる手札の指定が不正です。" };
      }
    }
  } else if (picks && picks.length > 0) {
    return { ok: false, reason: "このカードでは手札の指定捨ては不要です。" };
  }

  p.costPool -= cost;
  p.hand.splice(handIndex, 1);
  p.discard.push(cardId);

  const choosePool =
    needChoose > 0 ? [...picks].sort((a, b) => b - a) : null;
  applyCardEffects(game, playerIndex, def, {
    chooseDiscardPool: choosePool,
  });

  const effText = (def.effects || []).map(describeEffectLine).join(" / ");
  pushLog(
    game,
    playerIndex,
    `${def.name || cardId}${effText ? ` — ${effText}` : ""}`,
    cardId,
    "play"
  );

  return { ok: true };
}

/**
 * ラウンド確定（ロック）。両者ロック済みなら呼び出し側で resolveRound を実行。
 */
export function lockRound(game, playerIndex) {
  const p = game.players[playerIndex];
  if (p.roundLocked) {
    return { ok: false, reason: "すでに確定済みです。" };
  }
  p.roundLocked = true;
  if (game.firstLocker === null) {
    game.firstLocker = playerIndex;
    p.attackStock += FIRST_LOCK_ATTACK_BONUS;
    pushLog(
      game,
      playerIndex,
      `先に確定 — 交戦力+${FIRST_LOCK_ATTACK_BONUS}（先確定ボーナス）`,
      null,
      "lock"
    );
    const delayed = p.pendingFirstLockAttack | 0;
    if (delayed > 0) {
      p.attackStock += delayed;
      p.pendingFirstLockAttack = 0;
      pushLog(
        game,
        playerIndex,
        `先行確定 — 交戦力+${delayed}（カード効果）`,
        null,
        "lock"
      );
    }
  } else {
    pushLog(game, playerIndex, "ラウンド確定", null, "lock");
  }
  return { ok: true };
}

export function bothLocked(game) {
  return game.players[0].roundLocked && game.players[1].roundLocked;
}

/**
 * 交戦解決 → 手札全捨て → 次ラウンド
 */
export function resolveRound(game, cardById) {
  const a0 = game.players[0].attackStock;
  const a1 = game.players[1].attackStock;

  if (a0 > a1) {
    const d = a0 - a1;
    game.players[1].hp = Math.max(0, game.players[1].hp - d);
    pushLog(
      game,
      1,
      `交戦で ${d} ダメージ（相手の交戦力 ${a0} / 自分 ${a1}）`,
      null,
      "clash"
    );
  } else if (a1 > a0) {
    const d = a1 - a0;
    game.players[0].hp = Math.max(0, game.players[0].hp - d);
    pushLog(
      game,
      0,
      `交戦で ${d} ダメージ（相手の交戦力 ${a1} / 自分 ${a0}）`,
      null,
      "clash"
    );
  } else {
    pushLog(game, null, `交戦 — 同値（${a0}）でダメージなし`, null, "clash");
  }

  for (const p of game.players) {
    discardEntireHand(p);
  }

  if (game.players[0].hp <= 0 || game.players[1].hp <= 0) {
    const winnerIndex = game.players[0].hp <= 0 ? 1 : 0;
    return { winnerIndex };
  }

  game.roundNumber += 1;
  game.firstLocker = null;
  startRound(game);
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
      maxCost: self.turnMaxCost ?? MAX_COST_PER_TURN,
      attackStock: self.attackStock,
      pendingFirstLockAttack: self.pendingFirstLockAttack | 0,
      roundLocked: self.roundLocked,
      negateIncomingPlays: self.negateIncomingPlays,
    },
    opponent: {
      hp: opp.hp,
      maxHp: MAX_HP,
      hand: opp.hand.map((id) => cardById[id]),
      handCount: opp.hand.length,
      deckCount: opp.deck.length,
      discardCount: opp.discard.length,
      attackStock: opp.attackStock,
      roundLocked: opp.roundLocked,
      negateIncomingPlays: opp.negateIncomingPlays,
    },
    roundNumber: game.roundNumber,
    youAre: viewerIndex,
    firstLocker: game.firstLocker,
    battleLog: (game.log || []).slice(),
  };
}
