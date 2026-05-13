const http = require("http");
require("dotenv").config();
const path = require("path");
const express = require("express");
const { Server } = require("socket.io");
const { loadCardCatalog, validateDeck } = require("./cards");
const { mintSkyWayToken, ROOM_RE: SKYWAY_ROOM_RE } = require("./skywayToken");
const {
  createPlayerState,
  startTurn,
  endTurn,
  playCard,
  publicSnapshot,
} = require("./gameEngine");

const { byId: cardById, manifest } = loadCardCatalog();
const initialDeck = JSON.parse(
  require("fs").readFileSync(
    path.join(__dirname, "..", "public", "data", "initial-deck.json"),
    "utf8"
  )
).cardIds;

const app = express();
app.use(express.json({ limit: "32kb" }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

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

function randomRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

/** @type {Map<string, { code: string, joinOrder: string[], sockets: Map<string, { socketId: string, nickname: string, deck: string[] | null, ready: boolean }>, game: object | null, broadcastState?: () => void }>} */
const rooms = new Map();

function getOrCreateRoom(code) {
  let r = rooms.get(code);
  if (!r) {
    r = { code, joinOrder: [], sockets: new Map(), game: null };
    rooms.set(code, r);
  }
  return r;
}

function roomPlayerList(room) {
  return Array.from(room.sockets.values()).map((p) => ({
    nickname: p.nickname,
    ready: p.ready,
    hasDeck: Array.isArray(p.deck) && p.deck.length === 20,
  }));
}

function tryStartGame(room) {
  if (room.game) return;
  if (room.joinOrder.length !== 2) return;
  const k0 = room.joinOrder[0];
  const k1 = room.joinOrder[1];
  const p0 = room.sockets.get(k0);
  const p1 = room.sockets.get(k1);
  if (!p0 || !p1) return;
  const d0 = validateDeck(p0.deck, cardById);
  const d1 = validateDeck(p1.deck, cardById);
  if (!d0.ok || !d1.ok) return;
  if (!p0.ready || !p1.ready) return;

  const game = {
    players: [createPlayerState(p0.deck), createPlayerState(p1.deck)],
    turnIndex: Math.floor(Math.random() * 2),
    turnNumber: 1,
    socketOrder: [k0, k1],
  };
  startTurn(game, game.turnIndex);
  room.game = game;

  const sendState = () => {
    for (let i = 0; i < 2; i++) {
      const socketId = game.socketOrder[i];
      const s = io.sockets.sockets.get(socketId);
      if (s) {
        s.emit("gameState", publicSnapshot(game, i, cardById));
      }
    }
  };
  room.broadcastState = sendState;
  sendState();
}

io.on("connection", (socket) => {
  let currentRoom = null;
  let myKey = socket.id;

  socket.on("createRoom", ({ nickname } = {}) => {
    let code = randomRoomCode();
    while (rooms.has(code) && rooms.get(code).sockets.size > 0) {
      code = randomRoomCode();
    }
    const room = getOrCreateRoom(code);
    room.sockets.set(myKey, {
      socketId: socket.id,
      nickname: nickname || "プレイヤー",
      deck: null,
      ready: false,
    });
    room.joinOrder.push(myKey);
    currentRoom = room;
    socket.join(code);
    socket.emit("roomJoined", {
      code,
      role: "host",
      players: roomPlayerList(room),
      catalog: { initialDeck: initialDeck.slice(), cards: manifest.cardIds.map((id) => cardById[id]) },
    });
  });

  socket.on("joinRoom", ({ code, nickname } = {}) => {
    const c = String(code || "").trim().toUpperCase();
    const room = rooms.get(c);
    if (!room || room.sockets.size >= 2) {
      socket.emit("roomError", { message: "ルームに参加できません。" });
      return;
    }
    room.sockets.set(myKey, {
      socketId: socket.id,
      nickname: nickname || "プレイヤー",
      deck: null,
      ready: false,
    });
    room.joinOrder.push(myKey);
    currentRoom = room;
    socket.join(c);
    socket.emit("roomJoined", {
      code: c,
      role: "guest",
      players: roomPlayerList(room),
      catalog: { initialDeck: initialDeck.slice(), cards: manifest.cardIds.map((id) => cardById[id]) },
    });
    io.to(c).emit("roomUpdate", { players: roomPlayerList(room) });
  });

  socket.on("setDeck", ({ cardIds } = {}) => {
    if (!currentRoom || currentRoom.game) return;
    const me = currentRoom.sockets.get(myKey);
    if (!me) return;
    const v = validateDeck(cardIds, cardById);
    if (!v.ok) {
      socket.emit("deckError", { message: v.reason });
      return;
    }
    me.deck = cardIds.slice();
    me.ready = false;
    io.to(currentRoom.code).emit("roomUpdate", {
      players: roomPlayerList(currentRoom),
    });
  });

  socket.on("setReady", ({ ready } = {}) => {
    if (!currentRoom || currentRoom.game) return;
    const me = currentRoom.sockets.get(myKey);
    if (!me) return;
    me.ready = !!ready;
    io.to(currentRoom.code).emit("roomUpdate", {
      players: roomPlayerList(currentRoom),
    });
    tryStartGame(currentRoom);
  });

  socket.on("playCard", ({ handIndex } = {}) => {
    if (!currentRoom || !currentRoom.game) return;
    const game = currentRoom.game;
    const idx = game.socketOrder.indexOf(myKey);
    if (idx < 0) return;
    const res = playCard(game, idx, handIndex | 0, cardById);
    if (!res.ok) {
      socket.emit("actionError", { message: res.reason });
      return;
    }
    currentRoom.broadcastState();
    if (res.winnerIndex !== undefined) {
      io.to(currentRoom.code).emit("gameOver", { winnerSlot: res.winnerIndex });
      currentRoom.game = null;
    }
  });

  socket.on("endTurn", () => {
    if (!currentRoom || !currentRoom.game) return;
    const game = currentRoom.game;
    const idx = game.socketOrder.indexOf(myKey);
    if (idx < 0) return;
    if (game.turnIndex !== idx) {
      socket.emit("actionError", { message: "あなたのターンではありません。" });
      return;
    }
    endTurn(game);
    currentRoom.broadcastState();
  });

  socket.on("leaveRoom", () => {
    if (!currentRoom) return;
    const code = currentRoom.code;
    const hadGame = !!currentRoom.game;
    currentRoom.sockets.delete(myKey);
    currentRoom.joinOrder = currentRoom.joinOrder.filter((k) =>
      currentRoom.sockets.has(k)
    );
    socket.leave(code);
    if (hadGame) {
      const game = currentRoom.game;
      const idx = game.socketOrder.indexOf(myKey);
      if (idx >= 0) {
        io.to(code).emit("gameOver", { winnerSlot: 1 - idx, reason: "disconnect" });
      }
      currentRoom.game = null;
    }
    currentRoom = null;
    if (!rooms.has(code)) return;
    const room = rooms.get(code);
    if (room.sockets.size === 0) {
      rooms.delete(code);
    } else {
      io.to(code).emit("roomUpdate", { players: roomPlayerList(room) });
      io.to(code).emit("opponentLeft", {});
    }
  });

  socket.on("disconnect", () => {
    if (!currentRoom) return;
    const code = currentRoom.code;
    currentRoom.sockets.delete(myKey);
    currentRoom.joinOrder = currentRoom.joinOrder.filter((k) =>
      currentRoom.sockets.has(k)
    );
    if (currentRoom.game) {
      const game = currentRoom.game;
      const idx = game.socketOrder.indexOf(myKey);
      if (idx >= 0) {
        io.to(code).emit("gameOver", { winnerSlot: 1 - idx, reason: "disconnect" });
      }
      currentRoom.game = null;
    }
    if (currentRoom.sockets.size === 0) {
      rooms.delete(code);
    } else {
      io.to(code).emit("roomUpdate", { players: roomPlayerList(currentRoom) });
      io.to(code).emit("opponentLeft", {});
    }
    currentRoom = null;
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
