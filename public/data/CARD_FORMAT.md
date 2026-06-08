# カードデータ記述ガイド（身内語録大戦）

カード効果の**依頼・設計**は [README.md](./README.md) を参照してください。

**すべてのカード定義は `public/data/cards.json` の1ファイルにまとめます。**

## cards.json の構造

```json
{
  "version": 2,
  "toneKeys": { "passion": "熱量", "logical": "冷徹", "chaos": "泥沼", "habit": "口癖" },
  "statusKeys": { "tsubo": "ツボ", "hiyori": "日和", "mute": "ミュート" },
  "cards": [ ... ]
}
```

## カード1件のフィールド

| フィールド | 必須 | 説明 |
|---|---|---|
| `order` | ○ | リスト順番 |
| `id` | ○ | 一意ID |
| `speaker` | ○ | 発言者名 |
| `cost` | ○ | 消費コスト |
| `text` | ○ | 語録テキスト |
| `tone` | ○ | 発言トーン1つ（`passion` / `logical` / `chaos` / `habit`） |
| `effect` | ○ | ゲーム効果の配列 |
| `speaker_effect` | — | 発言者コンボ時の追加効果 |
| `effect_note` | — | 人間向け効果メモ |
| `combo_note` | — | 人間向けコンボメモ |
| `implemented` | ○ | ゲームに入れる場合 `true` |
| `bug_free` | ○ | 検証済みなら `true` |
| `excluded` | ○ | 除外する場合 `true` |

## 発言トーン（1枚1属性）

| キー | 名称 |
|---|---|
| `passion` | 熱量 |
| `logical` | 冷徹 |
| `chaos` | 泥沼 |
| `habit` | 口癖 |

## 効果タイプ

- `damage` / `heal` / `draw` / `discardSelf`
- `damageIf` / `healIf`（`mode`, `threshold`）
- `statusOpponent` / `statusSelf`（`status`, `turns`）

## 新カード追加手順

1. `cards.json` の `cards` 配列にオブジェクトを追加
2. `implemented: true`, `excluded: false` を設定
3. 初期デッキに使う場合は `initial-deck.json` を更新

## 初期デッキ

`public/data/initial-deck.json` — 40枚（同一カード最大4枚）
