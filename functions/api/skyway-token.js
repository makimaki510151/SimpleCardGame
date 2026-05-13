/**
 * Cloudflare Pages Function
 * 公開URL: https://<プロジェクト>.pages.dev/api/skyway-token
 * ダッシュボードで SKYWAY_APP_ID / SKYWAY_SECRET_KEY を設定してください。
 */
import { SkyWayAuthToken, uuidV4 } from "@skyway-sdk/token";

const ROOM_RE = /^scg_[A-Z0-9]{6}$/;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: { ...cors } });
}

export async function onRequestPost(context) {
  try {
    const appId = context.env.SKYWAY_APP_ID;
    const secretKey = context.env.SKYWAY_SECRET_KEY;
    if (!appId || !secretKey) {
      return json(
        {
          error:
            "SKYWAY_APP_ID / SKYWAY_SECRET_KEY が Pages の環境変数にありません。",
        },
        503
      );
    }
    const body = await context.request.json().catch(() => ({}));
    const roomName = body.roomName;
    if (!roomName || !ROOM_RE.test(String(roomName))) {
      return json({ error: "roomName が不正です（scg_XXXXXX 形式）。" }, 400);
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
    return json({ token: token.encode(secretKey) });
  } catch (e) {
    return json({ error: String(e?.message || e) }, 500);
  }
}
