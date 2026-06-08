const fs = require("fs");
const path = require("path");
const { assertNoStrictDominance } = require("./cardBalance");

const DATA_DIR = path.join(__dirname, "..", "public", "data");
const CARDS_FILE = path.join(DATA_DIR, "cards.json");

const EFFECT_TYPES = new Set([
  "damage",
  "heal",
  "draw",
  "discardSelf",
  "damageIf",
  "healIf",
  "statusOpponent",
  "statusSelf",
]);

const STATUS_TYPES = new Set(["tsubo", "hiyori", "mute"]);
const TONE_TYPES = new Set(["passion", "logical", "chaos", "habit"]);

function validateEffectsList(effects, fileId, ctx) {
  for (const e of effects) {
    if (!e || typeof e.type !== "string" || !EFFECT_TYPES.has(e.type)) {
      throw new Error(`Card ${fileId}: unknown ${ctx} type ${e?.type}`);
    }
    if (e.type === "statusOpponent" || e.type === "statusSelf") {
      if (!STATUS_TYPES.has(e.status)) {
        throw new Error(`Card ${fileId}: unknown status ${e.status}`);
      }
    }
  }
}

function validateCardShape(card, fileId) {
  if (!card || typeof card !== "object") {
    throw new Error(`Invalid card: ${fileId}`);
  }
  if (card.id !== fileId) {
    throw new Error(`Card id mismatch: ${fileId}`);
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
  if (!TONE_TYPES.has(card.tone)) {
    throw new Error(
      `Card ${fileId}: tone must be passion, logical, chaos, or habit`
    );
  }
  const effects = card.effect || card.effects;
  if (!Array.isArray(effects)) {
    throw new Error(`Card ${fileId}: effect must be an array`);
  }
  validateEffectsList(effects, fileId, "effect");
  if (card.speaker_effect != null) {
    const se = card.speaker_effect;
    if (typeof se !== "object") {
      throw new Error(`Card ${fileId}: speaker_effect must be an object`);
    }
    if (se.effects != null) {
      if (!Array.isArray(se.effects)) {
        throw new Error(`Card ${fileId}: speaker_effect.effects must be an array`);
      }
      validateEffectsList(se.effects, fileId, "speaker_effect");
    }
  }
}

function toGameCard(row) {
  return {
    id: row.id,
    speaker: row.speaker,
    text: row.text,
    cost: row.cost,
    tone: row.tone,
    effect: row.effect || row.effects || [],
    speaker_effect: row.speaker_effect,
  };
}

function loadCardsFile() {
  return JSON.parse(fs.readFileSync(CARDS_FILE, "utf8"));
}

function loadCardCatalog() {
  const data = loadCardsFile();
  const byId = {};
  const cardIds = [];
  for (const row of data.cards || []) {
    if (row.excluded || !row.implemented) continue;
    validateCardShape(row, row.id);
    byId[row.id] = toGameCard(row);
    cardIds.push(row.id);
  }
  assertNoStrictDominance(byId);
  return {
    manifest: { cardIds },
    byId,
    registry: data,
  };
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
  loadCardsFile,
  validateDeck,
  shuffle,
  CARDS_FILE,
  DECK_SIZE,
  MAX_COPIES_PER_CARD,
};
