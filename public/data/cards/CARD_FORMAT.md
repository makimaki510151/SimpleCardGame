<style>table, th, td { white-space: nowrap; }</style>

# カード JSON 記述ガイド（身内語録大戦）

カードは `public/data/cards/{id}.json` に1枚1ファイルで置き、`manifest.json` の `cardIds` に ID を登録します。

## 必須フィールド

<table>
<thead><tr><th>フィールド</th><th>型</th><th>説明</th></tr></thead>
<tbody>
<tr><td><code>id</code></td><td>string</td><td>一意ID（ファイル名と一致させる）</td></tr>
<tr><td><code>speaker</code></td><td>string</td><td>発言者名（例: <code>"A君"</code>）。コンボ判定に使用</td></tr>
<tr><td><code>text</code></td><td>string</td><td>語録テキスト（対戦画面に大きく表示）</td></tr>
<tr><td><code>cost</code></td><td>number</td><td>基本消費コスト（整数）</td></tr>
<tr><td><code>effect</code></td><td>array</td><td>メイン効果（下記「効果タイプ」参照）</td></tr>
</tbody>
</table>

## 任意フィールド

<table>
<thead><tr><th>フィールド</th><th>型</th><th>説明</th></tr></thead>
<tbody>
<tr><td><code>speaker_effect</code></td><td>object</td><td>発言者コンボ時の追加・変更効果（下記参照）</td></tr>
</tbody>
</table>

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

<table>
<thead><tr><th>キー</th><th>説明</th></tr></thead>
<tbody>
<tr><td><code>cost_reduction</code></td><td>コンボ時のコスト軽減量（省略時は 1）</td></tr>
<tr><td><code>damage_multiplier</code></td><td>コンボ時のダメージ倍率（<code>damage</code> / <code>damageIf</code> に適用）</td></tr>
<tr><td><code>effects</code></td><td>コンボ成立時にメイン効果の前に発動する追加効果</td></tr>
</tbody>
</table>

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
山札からカードを引く（捨て札は山札に戻さない。山札が空なら引けない）。

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

<table>
<thead><tr><th>mode</th><th>意味</th></tr></thead>
<tbody>
<tr><td><code>opponentHandGte</code></td><td>相手手札 ≥ threshold</td></tr>
<tr><td><code>selfHandGte</code></td><td>自身手札 ≥ threshold</td></tr>
<tr><td><code>opponentHandLte</code></td><td>相手手札 ≤ threshold</td></tr>
<tr><td><code>selfHpLte</code></td><td>自身HP ≤ threshold</td></tr>
<tr><td><code>opponentHpGte</code></td><td>相手HP ≥ threshold</td></tr>
<tr><td><code>opponentHpLte</code></td><td>相手HP ≤ threshold</td></tr>
<tr><td><code>selfLastSpeakerIs</code></td><td>直前の自身プレイの発言者が <code>speaker</code> と一致</td></tr>
<tr><td><code>opponentLastSpeakerIs</code></td><td>直前の相手プレイの発言者が <code>speaker</code> と一致</td></tr>
</tbody>
</table>

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

`public/data/initial-deck.json` に40枚分の ID 配列を記述します（同一カード最大4枚）。

進捗管理は `CARD_LIST.md` を参照してください。
