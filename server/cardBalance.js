const MAX_COST = 5;

/**
 * 効果を数値ベクトルに畳み込み（完全上位互換判定用）。
 * 条件付きダメージ／回復は保守的に「常に成立」とみなしフル value を加算する。
 * attackIfFirstLockerResolve は先行確定時のみ交戦力へ反映するため集計に含めない。
 * damageIf / healIf を持つカードは assert でペア検査から除外する。
 */
function aggregateForDominance(card) {
  const eff = card.effects || [];
  let dmg = 0;
  let heal = 0;
  let draw = 0;
  let selfDisc = 0;
  let oppDisc = 0;
  /** 相手の次ターンのコスト上限を下げる強さ（5 - cap の合計。大きいほど有利） */
  let oppCostCapDrop = 0;

  for (const e of eff) {
    const v = e.value | 0;
    switch (e.type) {
      case "damage":
        dmg += v;
        break;
      case "heal":
        heal += v;
        break;
      case "draw":
        draw += v;
        break;
      case "discardSelf":
      case "discardSelfChoose":
        selfDisc += v;
        break;
      case "discardOpponent":
      case "negateOpponentNextPlay":
        oppDisc += Math.max(1, v || 1);
        break;
      case "damageIf":
        dmg += v;
        break;
      case "healIf":
        heal += v;
        break;
      case "attackIfFirstLockerResolve":
        break;
      case "capOpponentNextTurn": {
        const cap = Math.max(1, Math.min(MAX_COST, e.cap | 0));
        oppCostCapDrop += MAX_COST - cap;
        break;
      }
      case "damageSelf":
        selfDisc += v;
        break;
      default:
        break;
    }
  }
  return {
    cost: card.cost | 0,
    dmg,
    heal,
    draw,
    selfDisc,
    oppDisc,
    oppCostCapDrop,
  };
}

/**
 * A が B を完全上位互換（同コスト以下で効果面が全部弱くなく、どこかで厳密に劣る）にしているか。
 * 低コスト・高ダメージ等は「良い」方向。
 */
function strictlyDominates(aVec, bVec) {
  if (aVec.cost > bVec.cost) return false;
  if (aVec.dmg < bVec.dmg) return false;
  if (aVec.heal < bVec.heal) return false;
  if (aVec.draw < bVec.draw) return false;
  if (aVec.oppDisc < bVec.oppDisc) return false;
  if (aVec.oppCostCapDrop < bVec.oppCostCapDrop) return false;
  if (aVec.selfDisc > bVec.selfDisc) return false;

  const strict =
    aVec.cost < bVec.cost ||
    aVec.dmg > bVec.dmg ||
    aVec.heal > bVec.heal ||
    aVec.draw > bVec.draw ||
    aVec.oppDisc > bVec.oppDisc ||
    aVec.oppCostCapDrop > bVec.oppCostCapDrop ||
    aVec.selfDisc < bVec.selfDisc;

  return strict;
}

function cardHasFirstLockerResolve(card) {
  return (card.effects || []).some((e) => e.type === "attackIfFirstLockerResolve");
}

function cardHasConditionalDamageIf(card) {
  return (card.effects || []).some((e) => e.type === "damageIf");
}

function cardHasConditionalHealIf(card) {
  return (card.effects || []).some((e) => e.type === "healIf");
}

function assertNoStrictDominance(byId) {
  const ids = Object.keys(byId);
  const vecs = {};
  for (const id of ids) {
    vecs[id] = aggregateForDominance(byId[id]);
  }
  const pairs = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = 0; j < ids.length; j++) {
      if (i === j) continue;
      const ida = ids[i];
      const idb = ids[j];
      if (
        cardHasFirstLockerResolve(byId[ida]) ||
        cardHasFirstLockerResolve(byId[idb])
      ) {
        continue;
      }
      if (
        cardHasConditionalDamageIf(byId[ida]) ||
        cardHasConditionalDamageIf(byId[idb]) ||
        cardHasConditionalHealIf(byId[ida]) ||
        cardHasConditionalHealIf(byId[idb])
      ) {
        continue;
      }
      if (strictlyDominates(vecs[ida], vecs[idb])) {
        pairs.push({ dominant: ida, weaker: idb });
      }
    }
  }
  if (pairs.length) {
    const msg = pairs
      .map((p) => `${byId[p.dominant].name}(${p.dominant}) ⊃ ${byId[p.weaker].name}(${p.weaker})`)
      .join("; ");
    throw new Error(`完全上位互換のカードペアがあります: ${msg}`);
  }
}

module.exports = {
  aggregateForDominance,
  assertNoStrictDominance,
};
