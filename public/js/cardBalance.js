(function (g) {
  const MAX_COST = 5;

  function aggregateForDominance(card) {
    const eff = card.effects || [];
    let dmg = 0;
    let heal = 0;
    let draw = 0;
    let selfDisc = 0;
    let oppDisc = 0;
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
        case "damageSelfIf":
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

  g.SCG_cardBalance = {
    assertNoStrictDominance(byId) {
      const ids = Object.keys(byId);
      const vecs = {};
      for (const id of ids) {
        vecs[id] = aggregateForDominance(byId[id]);
      }
      const hasFirst = (id) =>
        (byId[id].effects || []).some((e) => e.type === "attackIfFirstLockerResolve");
      const hasDamageIf = (id) =>
        (byId[id].effects || []).some(
          (e) => e.type === "damageIf" || e.type === "damageSelfIf"
        );
      const hasHealIf = (id) =>
        (byId[id].effects || []).some((e) => e.type === "healIf");
      const pairs = [];
      for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < ids.length; j++) {
          if (i === j) continue;
          const ida = ids[i];
          const idb = ids[j];
          if (hasFirst(ida) || hasFirst(idb)) continue;
          if (
            hasDamageIf(ida) ||
            hasDamageIf(idb) ||
            hasHealIf(ida) ||
            hasHealIf(idb)
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
          .map(
            (p) =>
              `${byId[p.dominant].name}(${p.dominant}) ⊃ ${byId[p.weaker].name}(${p.weaker})`
          )
          .join("; ");
        throw new Error(`完全上位互換のカードペアがあります: ${msg}`);
      }
    },
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
