const { SkyWayAuthToken, uuidV4 } = require("@skyway-sdk/token");

const ROOM_RE = /^scg_[A-Z0-9]{6}$/;

function mintSkyWayToken(appId, secretKey, roomName) {
  if (!ROOM_RE.test(roomName)) {
    throw new Error("invalid room name");
  }
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 12;
  const token = new SkyWayAuthToken({
    jti: uuidV4(),
    iat,
    exp,
    version: 3,
    scope: {
      appId,
      turn: { enabled: true },
      rooms: [
        {
          name: roomName,
          methods: ["create", "close", "updateMetadata"],
          member: {
            name: "*",
            methods: ["publish", "subscribe", "updateMetadata"],
          },
        },
      ],
    },
  });
  return token.encode(secretKey);
}

module.exports = { mintSkyWayToken, ROOM_RE };
