/**
 * ブラウザ（SkyWay ホスト）用。server/gameEngine.js と同じルールのため、変更時は両方を揃えてください。
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

export function startTurn(game, playerIndex) {
  const p = game.players[playerIndex];
  p.costPool = MAX_COST_PER_TURN;
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
      maxCost: MAX_COST_PER_TURN,
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
