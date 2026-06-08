const MAX_COST = 10;

function cardEffects(card) {
  return card.effect || card.effects || [];
}

/**
 * 効果を数値ベクトルに畳み込み（完全上位互換判定用）。
 */
function aggregateForDominance(card) {
  const eff = cardEffects(card);
  let dmg = 0;
  let heal = 0;
  let draw = 0;
  let selfDisc = 0;

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
        selfDisc += v;
        break;
      case "damageIf":
        dmg += v;
        break;
      case "healIf":
        heal += v;
        break;
      default:
        break;
    }
  }

  const se = card.speaker_effect;
  if (se?.effects) {
    for (const e of se.effects) {
      const v = e.value | 0;
      if (e.type === "damage") dmg += v;
      else if (e.type === "heal") heal += v;
      else if (e.type === "draw") draw += v;
    }
  }

  return {
    cost: card.cost | 0,
    dmg,
    heal,
    draw,
    selfDisc,
    oppDisc: 0,
    oppCostCapDrop: 0,
    hasIf: eff.some((e) => e.type === "damageIf" || e.type === "healIf"),
  };
}

function dominates(a, b) {
  if (a.cost > b.cost) return false;
  if (a.dmg < b.dmg) return false;
  if (a.heal < b.heal) return false;
  if (a.draw < b.draw) return false;
  if (a.selfDisc > b.selfDisc) return false;
  if (a.oppDisc < b.oppDisc) return false;
  if (a.oppCostCapDrop < b.oppCostCapDrop) return false;
  const strict =
    a.cost < b.cost ||
    a.dmg > b.dmg ||
    a.heal > b.heal ||
    a.draw > b.draw ||
    a.selfDisc < b.selfDisc ||
    a.oppDisc > b.oppDisc ||
    a.oppCostCapDrop > b.oppCostCapDrop;
  return strict;
}

function assertNoStrictDominance(byId) {
  const ids = Object.keys(byId);
  const vecs = ids.map((id) => ({ id, v: aggregateForDominance(byId[id]) }));
  for (let i = 0; i < vecs.length; i++) {
    for (let j = 0; j < vecs.length; j++) {
      if (i === j) continue;
      const a = vecs[i];
      const b = vecs[j];
      if (a.v.hasIf || b.v.hasIf) continue;
      if (dominates(a.v, b.v)) {
        throw new Error(
          `Card balance: ${a.id} strictly dominates ${b.id} (same cost, better or equal in all axes)`
        );
      }
    }
  }
}

module.exports = {
  aggregateForDominance,
  assertNoStrictDominance,
  MAX_COST,
};
