const fs = require("fs");
const path = require("path");
const { assertNoStrictDominance } = require("./cardBalance");

const CARDS_DIR = path.join(__dirname, "..", "public", "data", "cards");

const EFFECT_TYPES = new Set([
  "damage",
  "heal",
  "draw",
  "discardSelf",
  "damageIf",
  "healIf",
]);

function validateCardShape(card, fileId) {
  if (!card || typeof card !== "object") {
    throw new Error(`Invalid card: ${fileId}`);
  }
  if (card.id !== fileId) {
    throw new Error(`Card id mismatch: file ${fileId}.json has id ${card.id}`);
  }
  if (typeof card.speaker !== "string" || !card.speaker.trim()) {
    throw new Error(`Card ${fileId}: speaker is required`);
  }
  if (typeof card.text !== "string" || !card.text.trim()) {
    throw new Error(`Card ${fileId}: text is required`);
  }
  if (typeof card.cost !== "number" || card.cost < 0) {
    throw new Error(`Card ${fileId}: cost must be a non-negative number`);
  }
  const effects = card.effect || card.effects;
  if (!Array.isArray(effects)) {
    throw new Error(`Card ${fileId}: effect must be an array`);
  }
  for (const e of effects) {
    if (!e || typeof e.type !== "string" || !EFFECT_TYPES.has(e.type)) {
      throw new Error(`Card ${fileId}: unknown effect type ${e?.type}`);
    }
  }
  if (card.speaker_effect != null) {
    const se = card.speaker_effect;
    if (typeof se !== "object") {
      throw new Error(`Card ${fileId}: speaker_effect must be an object`);
    }
    if (se.effects != null) {
      if (!Array.isArray(se.effects)) {
        throw new Error(`Card ${fileId}: speaker_effect.effects must be an array`);
      }
      for (const e of se.effects) {
        if (!e || typeof e.type !== "string" || !EFFECT_TYPES.has(e.type)) {
          throw new Error(`Card ${fileId}: unknown speaker_effect type ${e?.type}`);
        }
      }
    }
  }
}

function loadCardCatalog() {
  const manifestPath = path.join(CARDS_DIR, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const byId = {};
  for (const id of manifest.cardIds) {
    if (id.startsWith("_")) continue;
    const filePath = path.join(CARDS_DIR, `${id}.json`);
    const card = JSON.parse(fs.readFileSync(filePath, "utf8"));
    validateCardShape(card, id);
    byId[id] = card;
  }
  assertNoStrictDominance(byId);
  return { manifest, byId };
}

const DECK_SIZE = 40;
const MAX_COPIES_PER_CARD = 4;

function validateDeck(cardIds, byId) {
  if (!Array.isArray(cardIds) || cardIds.length !== DECK_SIZE) {
    return { ok: false, reason: `デッキはちょうど${DECK_SIZE}枚である必要があります。` };
  }
  const counts = {};
  for (const cid of cardIds) {
    if (!byId[cid]) {
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
  DECK_SIZE,
  MAX_COPIES_PER_CARD,
};
