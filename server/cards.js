const fs = require("fs");
const path = require("path");
const { assertNoStrictDominance } = require("./cardBalance");

const CARDS_DIR = path.join(__dirname, "..", "public", "data", "cards");

function loadCardCatalog() {
  const manifestPath = path.join(CARDS_DIR, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const byId = {};
  for (const id of manifest.cardIds) {
    const filePath = path.join(CARDS_DIR, `${id}.json`);
    const card = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (card.id !== id) {
      throw new Error(`Card id mismatch: file ${id}.json has id ${card.id}`);
    }
    byId[id] = card;
  }
  assertNoStrictDominance(byId);
  return { manifest, byId };
}

function validateDeck(cardIds, byId) {
  if (!Array.isArray(cardIds) || cardIds.length !== 20) {
    return { ok: false, reason: "デッキはちょうど20枚である必要があります。" };
  }
  const counts = {};
  for (const cid of cardIds) {
    if (!byId[cid]) {
      return { ok: false, reason: `不明なカード: ${cid}` };
    }
    counts[cid] = (counts[cid] || 0) + 1;
    if (counts[cid] > 3) {
      return { ok: false, reason: "同じカードは1デッキに3枚までです。" };
    }
  }
  return { ok: true };
}

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = {
  loadCardCatalog,
  validateDeck,
  shuffle,
  CARDS_DIR,
};
