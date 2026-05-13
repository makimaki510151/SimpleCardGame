require("dotenv").config();
const path = require("path");
const express = require("express");
const { loadCardCatalog } = require("./cards");
const { mintSkyWayToken, ROOM_RE: SKYWAY_ROOM_RE } = require("./skywayToken");

const { byId: cardById, manifest } = loadCardCatalog();
const initialDeck = JSON.parse(
  require("fs").readFileSync(
    path.join(__dirname, "..", "public", "data", "initial-deck.json"),
    "utf8"
  )
).cardIds;

const app = express();
app.use(express.json({ limit: "32kb" }));

const PUBLIC = path.join(__dirname, "..", "public");
app.use(express.static(PUBLIC));

app.get("/api/cards", (_req, res) => {
  res.json({
    cards: manifest.cardIds.map((id) => cardById[id]),
    initialDeck: initialDeck.slice(),
  });
});

app.options("/api/skyway-token", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(204).end();
});

app.post("/api/skyway-token", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const appId = process.env.SKYWAY_APP_ID;
  const secret = process.env.SKYWAY_SECRET_KEY;
  const roomName = req.body && req.body.roomName;
  if (!appId || !secret) {
    res.status(503).json({
      error: "SKYWAY_APP_ID / SKYWAY_SECRET_KEY がサーバーに設定されていません。",
    });
    return;
  }
  if (!roomName || !SKYWAY_ROOM_RE.test(String(roomName))) {
    res.status(400).json({ error: "roomName が不正です（scg_XXXXXX 形式）。" });
    return;
  }
  try {
    const token = mintSkyWayToken(appId, secret, String(roomName));
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
