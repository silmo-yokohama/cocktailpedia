# 追加要件: AI自動入力機能（カクテル登録画面）

**ステータス**: ドラフト
**作成日**: 2026-01-31
**更新日**: 2026-01-31

---

## 0. 背景・目的

### 0.1 現状の課題

- 現在アプリに登録されているカクテルは **7件（テストデータ）のみ**
- 将来的に **300件以上** のカクテル登録を目指している
- カクテル1件あたりの情報量が多く、手作業での登録は時間がかかりすぎる

### 0.2 機能追加の目的

- **AIによる自動入力** でカクテル情報の登録作業を効率化
- 管理画面からGUIで操作でき、**直感的** に使える
- AIの出力を **確認・修正してから登録** できるフロー
- **1日数件程度** のペースでコツコツ登録数を増やしていく

### 0.3 前提条件

| 項目 | 内容 |
|------|------|
| 公開時期 | 未定（急いでいない） |
| コスト | **無料枠のみ** で運用 |
| 想定ペース | 1日5〜10件程度 |
| 目標達成見込み | 約2ヶ月で300件 |

### 0.4 無料枠での運用可能性

| モデル | RPD (日) | 備考 |
|-------|----------|------|
| gemini-2.5-flash | 約20〜250 | テキスト生成用 |
| gemini-2.5-flash-lite | 1,000 | より余裕あり（代替案） |
| gemini-2.5-flash-image | 不明 | 画像生成用 |

**結論**: 1日5〜10件程度の登録であれば、無料枠で十分運用可能。

---

## 1. 概要

### 1.1 対象画面

管理画面 - カクテル登録画面

### 1.2 機能概要

カクテル登録画面に以下の **2つのAI支援機能** を追加する：

1. **カクテル情報自動入力ボタン**: カクテル名からレシピ情報を取得しフォームを自動入力
2. **画像自動生成ボタン**: 画像登録フォーム内で、カクテル画像をAI生成

※ 画像生成はオプショナル（レシピ自動入力とは独立して実行可能）

### 1.3 処理フロー

**カクテル情報自動入力:**

```
カクテル名入力
    ↓
[カクテル情報を自動入力ボタン押下]
    ↓
Gemini API（gemini-2.5-flash）へリクエスト
  → カクテル名からレシピ情報をJSON形式で取得
    ↓
レスポンスをパース
    ↓
材料マスタとのマッチング処理
  → 未登録材料がある場合は警告表示・簡易登録フォームを表示
    ↓
フォームへ自動入力（画像以外）
    ↓
[ユーザーが確認・修正]
    ↓
[登録ボタン押下] → 通常の登録処理
```

**画像自動生成（オプショナル）:**

```
[画像を自動生成ボタン押下]（画像登録フォーム内）
    ↓
Nano Banana（gemini-2.5-flash-image）へリクエスト
  → フォームの情報（カクテル名、グラス、色等）から画像を生成
    ↓
生成された画像をSupabase Storageにアップロード
    ↓
image_urlフィールドに自動入力
```

---

## 2. 使用API・モデル

### 2.1 テキスト生成（レシピ取得）

| 項目 | 値 |
|------|-----|
| API | Gemini API |
| モデル | `gemini-2.5-flash` |
| プラン | 無料枠 |
| 用途 | カクテルレシピ情報のJSON生成 |

### 2.2 画像生成

| 項目 | 値 |
|------|-----|
| API | Gemini API (Nano Banana) |
| モデル | `gemini-2.5-flash-image` |
| プラン | 無料枠 |
| 用途 | カクテル画像の生成 |
| 生成タイミング | 毎回生成（キャッシュなし） |

### 2.3 コスト考慮事項

- 無料枠のレート制限に注意が必要
- 無料枠ではコンテンツがプロダクト改善に使用される
- 画像生成は有料時 1枚あたり約$0.039

---

## 3. 自動入力対象フィールド

### 3.1 cocktails テーブル

| フィールド | 必須 | 許容値/制約 | AI入力 |
|----------|------|------------|--------|
| `name` | ✅ | TEXT | ✅ |
| `name_en` | - | TEXT | ✅ |
| `name_alias` | - | TEXT | ✅ |
| `slug` | ✅ | UNIQUE TEXT (例: gin-tonic) | ✅ |
| `description` | - | TEXT | ✅ |
| `cocktail_word` | - | TEXT | ✅ |
| `base` | ✅ | gin, vodka, rum, tequila, whiskey, brandy, liqueur, wine, beer, non_alcoholic, other | ✅ |
| `technique` | ✅ | shake, stir, build, blend | ✅ |
| `glass` | ✅ | cocktail, rocks, highball, collins, champagne_flute, champagne_saucer, wine, shot, copper_mug, goblet, other | ✅ |
| `alcohol_percentage` | ✅ | 0-100 の整数 | ✅ |
| `temperature` | ✅ | ice, hot, crushed_ice, frozen | ✅ |
| `carbonation` | ✅ | strong, weak, none | ✅ |
| `color` | - | red, orange, yellow, green, blue, purple, pink, brown, amber, white, clear, layered | ✅ |
| `variation_text` | - | TEXT（カンマ区切り） | ✅ |
| `image_url` | - | TEXT | ✅ (Nano Banana生成→Storage保存) |

### 3.2 recipe_items（材料リスト）

| フィールド | 必須 | 備考 | AI入力 |
|----------|------|------|--------|
| `ingredient_id` | ✅ | 材料マスタから取得 | ✅ (マッチング処理) |
| `amount` | - | 「30ml」「適量」等 | ✅ |
| `sort_order` | ✅ | 表示順 | ✅ |

---

## 4. プロンプト設計

### 4.1 設計方針

**ハルシネーション防止のポイント:**

1. **選択肢を明示**: base, technique, glass等は許容値のみ選ばせる
2. **JSON Schema指定**: 構造化出力でレスポンス形式を強制
3. **存在しない情報は`null`**: わからない場合は推測せず`null`を返す
4. **材料は一般名で**: 商品名ではなく「ジン」「ライムジュース」等

### 4.2 プロンプトテンプレート

```
あなたはカクテルのプロです。
以下のカクテル名について、レシピ情報をJSON形式で返してください。

【重要なルール】
- 確実にわかる情報のみ記載し、推測や創作は絶対にしないでください
- わからない項目は null を設定してください
- 各フィールドの許容値は指定されたもののみ使用してください
- 材料名は一般名称を使用してください（商品名は使わない）

【カクテル名】
{cocktail_name}

【レスポンス形式】
以下のJSON Schemaに従ってください:
{json_schema}
```

### 4.3 レスポンスJSON Schema

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "description": "カクテル名（日本語）" },
    "name_en": { "type": ["string", "null"], "description": "英語名" },
    "name_alias": { "type": ["string", "null"], "description": "別名" },
    "slug": { "type": "string", "description": "URLスラッグ（英小文字・ハイフン区切り）" },
    "description": { "type": ["string", "null"], "description": "説明・由来・歴史" },
    "cocktail_word": { "type": ["string", "null"], "description": "カクテル言葉" },
    "base": {
      "type": "string",
      "enum": ["gin", "vodka", "rum", "tequila", "whiskey", "brandy", "liqueur", "wine", "beer", "non_alcoholic", "other"]
    },
    "technique": {
      "type": "string",
      "enum": ["shake", "stir", "build", "blend"]
    },
    "glass": {
      "type": "string",
      "enum": ["cocktail", "rocks", "highball", "collins", "champagne_flute", "champagne_saucer", "wine", "shot", "copper_mug", "goblet", "other"]
    },
    "alcohol_percentage": { "type": "integer", "minimum": 0, "maximum": 100 },
    "temperature": {
      "type": "string",
      "enum": ["ice", "hot", "crushed_ice", "frozen"]
    },
    "carbonation": {
      "type": "string",
      "enum": ["strong", "weak", "none"]
    },
    "color": {
      "type": ["string", "null"],
      "enum": ["red", "orange", "yellow", "green", "blue", "purple", "pink", "brown", "amber", "white", "clear", "layered", null]
    },
    "variation_text": { "type": ["string", "null"], "description": "バリエーション（カンマ区切り）" },
    "ingredients": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "description": "材料名（一般名称）" },
          "name_en": { "type": ["string", "null"], "description": "英語名" },
          "category": {
            "type": ["string", "null"],
            "enum": ["spirits", "liqueur", "wine", "juice", "soda", "syrup", "dairy", "fruit", "herb", "other", null]
          },
          "amount": { "type": ["string", "null"], "description": "分量（30ml, 適量 等）" }
        },
        "required": ["name"]
      }
    }
  },
  "required": ["name", "slug", "base", "technique", "glass", "alcohol_percentage", "temperature", "carbonation", "ingredients"]
}
```

---

## 5. 材料マスタとのマッチング処理

### 5.1 マッチング方針

- **完全一致のみ**で検索（部分一致・曖昧検索は行わない）
- 見つからない材料は「未登録材料」として扱う
- ユーザーは**新規登録**または**既存材料の選択**を選べる

### 5.2 処理フロー

```
AIレスポンスから材料リスト取得
    ↓
各材料について:
  ├─ 材料名で ingredients テーブルを完全一致検索
  │    ├─ 一致 → 紐付けOK
  │    └─ 見つからない → 未登録材料リストに追加
    ↓
未登録材料がある場合:
  → 画面上に「未登録材料があります」警告
  → 各材料について以下のいずれかを選択:
      (A) 既存材料から選択（ドロップダウン）
      (B) 新規登録（簡易フォーム）
```

### 5.3 未登録材料の処理UI

未登録材料ごとに以下のUIを表示：

```
[ドライジン] ← AIが返した材料名
  ○ 既存材料を使用: [ジン ▼]  ← 材料マスタのドロップダウン
  ○ 新規登録: [名前: ドライジン] [カテゴリ: spirits ▼]
  [確定]
```

**UI動作:**
- デフォルトは「新規登録」を選択状態
- 既存材料ドロップダウンには材料マスタ全件を表示
- 確定後、レシピ項目に自動紐付け


---

## 6. 画像生成（オプショナル）

画像生成はレシピ自動入力とは**独立した機能**として提供する。

### 6.1 UI配置

- 画像登録フォーム内に「**画像を自動生成**」ボタンを配置
- レシピ自動入力ボタンとは別に、任意のタイミングで実行可能

### 6.2 処理フロー

1. 「画像を自動生成」ボタン押下
2. フォームの情報（カクテル名、グラス、色）を取得
3. Nano Banana（gemini-2.5-flash-image）へリクエスト
4. 生成された画像をSupabase Storageにアップロード
5. アップロード後のURLをフォームの`image_url`に設定

### 6.3 画像生成プロンプト

```
A professional photograph of {cocktail_name} cocktail.
Served in a {glass_type} glass.
Color: {color}.
Beautiful lighting, high quality, appetizing, bar setting.
```

### 6.4 画像仕様

| 項目 | 値 |
|------|-----|
| 解像度 | 1024x1024 px |
| 形式 | PNG |
| 保存先 | Supabase Storage (cocktails/images/) |

### 6.5 画像生成を使わない場合

- 手動で画像をアップロード可能
- 画像なしでも登録可能（後から追加も可）

---

## 7. バリデーション

### 7.1 AIリクエスト前のバリデーション

| チェック項目 | タイミング | 処理 |
|-------------|----------|------|
| **カクテル名が空** | 送信前 | エラー表示（「カクテル名を入力してください」） |
| **カクテル名が長すぎる** | 送信前 | エラー表示（100文字以内） |
| **カクテル名が既に登録済み** | 送信前（DB照会） | **エラーで弾く（登録不可）** ※完全一致 |

### 7.2 AIレスポンスのバリデーション

| チェック項目 | 処理 |
|-------------|------|
| `error: unknown_cocktail` | 「該当するカクテルが見つかりませんでした」表示 |
| JSONパース失敗 | リトライ（最大2回）→ エラー表示 |
| 必須フィールド欠損 | エラー表示 |
| 許容値外の値 | その項目をnullに置換して警告表示 |

### 7.3 slug重複時の処理

AIが生成したslugがDBに既存の場合：

1. 警告メッセージを表示
2. **slug入力欄を表示してユーザーに決めてもらう**
3. ユーザーが入力したslugで再度重複チェック

**slugのバリデーション正規表現:** `/^[a-z0-9-]+$/`（英小文字・数字・ハイフンのみ）

---

## 8. エラーハンドリング

| エラー | 原因 | 対処方法 |
|-------|------|---------|
| **429 Too Many Requests** | レート制限超過 | 「時間を置いてやり直してください」メッセージ表示 |
| **400 Bad Request** | プロンプト不正、セーフティフィルター | 「カクテル情報を取得できませんでした」 |
| **401/403 Unauthorized** | APIキー無効・権限不足 | 「API設定を確認してください」 |
| **500 Internal Server Error** | API側の一時障害 | リトライ（最大2回）or 「時間を置いてやり直してください」 |
| **ネットワークエラー** | タイムアウト、接続失敗 | リトライ（最大2回）or 「接続できませんでした」 |
| **レスポンスパース失敗** | JSONが不正 | 再リクエスト（最大2回）or エラー表示 |
| **画像生成失敗** | セーフティフィルター発動等 | 画像なしで続行（手動アップロードを促す） |
| **存在しないカクテル** | AIが情報を持っていない | 「このカクテルの情報は見つかりませんでした」 |

---

## 9. 制約事項

| 項目 | 制約 |
|------|------|
| **コスト** | 無料枠のみ使用 |
| **レート制限** | 無料枠のレート制限に従う |
| **自動登録なし** | フォーム自動入力のみ。登録はユーザーが確認後に実行 |

---

## 10. 未決定事項

- [ ] 未登録材料処理UIの詳細設計

---

## 11. 参考リンク

- [Gemini API ドキュメント](https://ai.google.dev/gemini-api/docs?hl=ja)
- [Gemini API 料金](https://ai.google.dev/pricing?hl=ja)
- [Nano Banana による画像生成](https://ai.google.dev/gemini-api/docs/image-generation?hl=ja)
- [レート制限](https://ai.google.dev/gemini-api/docs/rate-limits?hl=ja)
