# Cloudflare で公開し、SkyWay トークンを設定する手順

このリポジトリは **静的ファイルを `public/`** に置き、**SkyWay 用 JWT は `functions/api/skyway-token.js`（Pages Function）** で発行します。シークレットキーはブラウザに出さず、Cloudflare の環境変数だけに保存します。

---

## 前提

- Cloudflare アカウントがあること
- SkyWay コンソールで **アプリ ID** と **シークレットキー** を取得済みであること  
  （[SkyWay コンソール](https://console.skyway.ntt.com/)）

---

## 1. GitHub にコードを push する

Cloudflare Pages は Git 連携が一般的です。リポジトリを GitHub 等に push してください。

---

## 2. Cloudflare Pages でプロジェクトを作る

1. [Cloudflare ダッシュボード](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. リポジトリを選択し、**Set up builds and deployments** で次を設定します。

| 項目 | 設定例 |
|------|--------|
| **Framework preset** | None（なし） |
| **Build command** | `npm install && npm run build:skyway` |
| **Build output directory** | `public` |
| **Root directory**（モノレポでない場合） | `/`（空またはリポジトリルート） |

3. **Save and Deploy** で初回デプロイが走ります。

---

## 3. 環境変数（トークン用シークレット）を設定する

1. Pages プロジェクト → **Settings** → **Variables and Secrets**
2. 次の 2 つを追加します。

| 名前 | 種類 | 値 |
|------|------|-----|
| `SKYWAY_APP_ID` | **Secret** または **Plaintext** | SkyWay のアプリケーション ID（UUID） |
| `SKYWAY_SECRET_KEY` | **必ず Secret** | SkyWay のシークレットキー（Base64 文字列） |

- **シークレットキーは必ず「Encrypt」された Secret** にしてください。Plaintext でも動きますが非推奨です。
3. 保存後、**Deployments** で **Retry deployment** するか、空コミットで再デプロイすると確実です（環境変数はデプロイ時にバンドルに反映されます）。

---

## 4. トークン API の URL（ゲーム側の挙動）

オンライン対戦は **常に「今開いているサイト」と同じオリジン** の `POST /api/skyway-token` を呼び出します。  
そのため Cloudflare Pages で `https://<プロジェクト名>.pages.dev/` に公開していれば、トークンは自動的に

```text
https://<プロジェクト名>.pages.dev/api/skyway-token
```

に向かいます。**ゲーム画面で URL を入力する欄はありません。**

別ドメインだけでトークンを出したい場合は、フロントの改修が必要です（現状は同一オリジンのみ）。

---

## 5. 動作確認（トークン API 単体）

ブラウザの開発者ツールのコンソール、または `curl` で POST します。

```bash
curl -sS -X POST "https://<プロジェクト名>.pages.dev/api/skyway-token" ^
  -H "Content-Type: application/json" ^
  -d "{\"roomName\":\"scg_ABC12X\"}"
```

- `roomName` は **`scg_` + 英数字6桁**（ゲームと同じ形式）である必要があります。
- 成功すると `{"token":"..."}` のような JSON が返ります。
- `503` と `SKYWAY_APP_ID` の文言が出る場合は、**環境変数が未設定**か、**再デプロイ前**の可能性があります。

---

## 6. ローカルで Pages + Functions を試す（任意）

Node と Wrangler を使います（Wrangler 4 は Node 22 推奨の警告が出ることがありますが、多くの環境で Node 20 でも動作します）。

```bash
npm install
npm run build:skyway
npx wrangler pages dev public --compatibility-flags=nodejs_compat
```

別ターミナルでシークレットを流し込む場合（Wrangler の推奨は `wrangler secret` では Pages ではダッシュボード設定が一般的です）。ローカルでは `.dev.vars` を使えます。

**`.dev.vars`**（リポジトリに **コミットしない**。`.gitignore` に追加済み推奨）

```env
SKYWAY_APP_ID=あなたのアプリID
SKYWAY_SECRET_KEY=あなたのシークレットキー
```

`wrangler pages dev` はプロジェクトルートの `.dev.vars` を読みます。

---

## 7. CLI だけでデプロイする場合

```bash
npm install
npm run build:skyway
npx wrangler pages deploy public
```

初回はブラウザログインが求められます。環境変数はダッシュボードで設定した値が使われます（`pages deploy` 時に `--var` で渡すことも可能ですが、シークレットはダッシュボード推奨）。

---

## 8. よくある問題

| 現象 | 対処 |
|------|------|
| `503` と環境変数エラー | Pages の Variables に `SKYWAY_APP_ID` / `SKYWAY_SECRET_KEY` を入れて **再デプロイ** |
| `500` やトークン生成エラー | `nodejs_compat` が有効か（`wrangler.toml` の `compatibility_flags`）を確認 |
| CORS エラー | 本 Function は `Access-Control-Allow-Origin: *` を返す想定。URL の typo（末尾スラッシュ等）を確認 |
| SkyWay 接続はできるがルームに入れない | アプリ ID・シークレットの取り違え、または SkyWay 側のアプリ設定を確認 |

---

## 9. カスタムドメイン

Pages プロジェクト → **Custom domains** でドメインを追加すると、トークン URL も

```text
https://game.example.com/api/skyway-token
```

のようになります。ゲーム内のトークン URL もその **HTTPS フル URL** に合わせてください。

---

## ファイル構成（参考）

```text
public/                 ← 静的サイト（HTML/CSS/JS/data）
functions/
  api/
    skyway-token.js     ← POST /api/skyway-token
wrangler.toml           ← Pages 用設定（nodejs_compat）
```

`npm run build:skyway` で `public/js/skyway-net.bundle.js` を生成してからデプロイしてください（CI の Build command に含めていれば自動です）。
