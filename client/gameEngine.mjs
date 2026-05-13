/**
 * SkyWay ホスト用ゲームエンジン。効果を追加したら server/cardBalance.js の集計も見直す。
 */
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const MAX_HP = 100;
export const MAX_COST_PER_TURN = 5;
export const DRAW_PER_TURN = 5;

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

export function startTurn(game, playerIndex) {
  const p = game.players[playerIndex];
  const cap =
    p.costCapOnNextTurn != null
      ? Math.max(1, Math.min(MAX_COST_PER_TURN, p.costCapOnNextTurn | 0))
      : MAX_COST_PER_TURN;
  p.costCapOnNextTurn = null;
  p.turnMaxCost = cap;
  p.costPool = cap;
  const drawn = drawCards(p, DRAW_PER_TURN);
  p.hand.push(...drawn);
}

function discardEntireHand(p) {
  while (p.hand.length > 0) {
    p.discard.push(p.hand.pop());
  }
}

export function endTurn(game) {
  const p = game.players[game.turnIndex];
  discardEntireHand(p);
  game.turnIndex = 1 - game.turnIndex;
  game.turnNumber += 1;
  startTurn(game, game.turnIndex);
}

function applyCardEffects(game, actorIndex, cardDef) {
  const opponentIndex = 1 - actorIndex;
  const self = game.players[actorIndex];
  const opp = game.players[opponentIndex];
  const effects = cardDef.effects || [];
  for (const e of effects) {
    if (e.type === "damage") {
      opp.hp = Math.max(0, opp.hp - (e.value | 0));
    } else if (e.type === "heal") {
      self.hp = Math.min(MAX_HP, self.hp + (e.value | 0));
    } else if (e.type === "draw") {
      const drawn = drawCards(self, e.value | 0);
      self.hand.push(...drawn);
    } else if (e.type === "discardSelf") {
      discardRandomFromHand(self, e.value | 0);
    } else if (e.type === "discardOpponent") {
      discardRandomFromHand(opp, e.value | 0);
    } else if (e.type === "damageIf") {
      if (evalCondition(game, actorIndex, e)) {
        opp.hp = Math.max(0, opp.hp - (e.value | 0));
      }
    } else if (e.type === "healIf") {
      if (evalCondition(game, actorIndex, e)) {
        self.hp = Math.min(MAX_HP, self.hp + (e.value | 0));
      }
    } else if (e.type === "capOpponentNextTurn") {
      const cap = Math.max(1, Math.min(MAX_COST_PER_TURN, e.cap | 0));
      opp.costCapOnNextTurn = cap;
    }
  }
}

export function playCard(game, playerIndex, handIndex, cardById) {
  if (game.turnIndex !== playerIndex) {
    return { ok: false, reason: "あなたのターンではありません。" };
  }
  const p = game.players[playerIndex];
  if (handIndex < 0 || handIndex >= p.hand.length) {
    return { ok: false, reason: "手札が不正です。" };
  }
  const cardId = p.hand[handIndex];
  const def = cardById[cardId];
  if (!def) return { ok: false, reason: "カード定義がありません。" };
  const cost = def.cost | 0;
  if (cost > p.costPool) {
    return { ok: false, reason: "コストが足りません。" };
  }
  p.costPool -= cost;
  p.hand.splice(handIndex, 1);
  p.discard.push(cardId);
  applyCardEffects(game, playerIndex, def);

  if (game.players[1 - playerIndex].hp <= 0) {
    return { ok: true, winnerIndex: playerIndex };
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
      maxCost: self.turnMaxCost ?? MAX_COST_PER_TURN,
    },
    opponent: {
      hp: opp.hp,
      maxHp: MAX_HP,
      handCount: opp.hand.length,
      deckCount: opp.deck.length,
      discardCount: opp.discard.length,
    },
    turnIndex: game.turnIndex,
    youAre: viewerIndex,
    turnNumber: game.turnNumber,
  };
}
