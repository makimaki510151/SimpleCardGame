# カード JSON 記述ガイド（身内語録大戦）

カードは `public/data/cards/{id}.json` に1枚1ファイルで置き、`manifest.json` の `cardIds` に ID を登録します。

## 必須フィールド

| フィールド | 型 | 説明 |
|---|---|---|
| `id` | string | 一意ID（ファイル名と一致させる） |
| `speaker` | string | 発言者名（例: `"A君"`）。コンボ判定に使用 |
| `text` | string | 語録テキスト（対戦画面に大きく表示） |
| `cost` | number | 基本消費コスト（整数） |
| `effect` | array | メイン効果（下記「効果タイプ」参照） |

## 任意フィールド

| フィールド | 型 | 説明 |
|---|---|---|
| `speaker_effect` | object | 発言者コンボ時の追加・変更効果（下記参照） |

## 発言者コンボ（speaker_effect）

直前にプレイしたカードの `speaker` と同じ場合、ターン中に自動発動します。

**デフォルト**: コスト -1（最低0）

`speaker_effect` で上書き・追加できます:

```json
"speaker_effect": {
  "cost_reduction": 1,
  "damage_multiplier": 2,
  "effects": [
    { "type": "draw", "value": 1 }
  ]
}
```

| キー | 説明 |
|---|---|
| `cost_reduction` | コンボ時のコスト軽減量（省略時は 1） |
| `damage_multiplier` | コンボ時のダメージ倍率（`damage` / `damageIf` に適用） |
| `effects` | コンボ成立時にメイン効果の前に発動する追加効果 |

## 効果タイプ（effect / speaker_effect.effects）

### damage
相手ライフを直接減らす。

```json
{ "type": "damage", "value": 3 }
```

### heal
自身を回復（上限は初期ライフ20）。

```json
{ "type": "heal", "value": 2 }
```

### draw
カードを引く。

```json
{ "type": "draw", "value": 1 }
```

### discardSelf
自身の手札をランダムに捨てる。

```json
{ "type": "discardSelf", "value": 1 }
```

### damageIf / healIf
条件成立時のみ発動。`mode` と `threshold`（または `speaker`）を指定。

```json
{
  "type": "damageIf",
  "mode": "opponentHpLte",
  "threshold": 10,
  "value": 4
}
```

条件モード一覧:

| mode | 意味 |
|---|---|
| `opponentHandGte` | 相手手札 ≥ threshold |
| `selfHandGte` | 自身手札 ≥ threshold |
| `opponentHandLte` | 相手手札 ≤ threshold |
| `selfHpLte` | 自身HP ≤ threshold |
| `opponentHpGte` | 相手HP ≥ threshold |
| `opponentHpLte` | 相手HP ≤ threshold |
| `selfLastSpeakerIs` | 直前の自身プレイの発言者が `speaker` と一致 |
| `opponentLastSpeakerIs` | 直前の相手プレイの発言者が `speaker` と一致 |

## 記述例

`_template.json` をコピーして編集してください。

## manifest への追加

`manifest.json`:

```json
{
  "cardIds": ["my_card_id", "..."]
}
```

## 初期デッキ

`public/data/initial-deck.json` に20枚分の ID 配列を記述します（同一カード最大2枚）。
