# タスク: Gemini API連携モジュール

| 項目 | 内容 |
|------|------|
| ステータス | **実装完了** |
| 作成日 | 2026-01-31 |
| 完了日 | 2026-01-31 |
| 前提タスク | なし（最初のタスク） |
| PR | [#9](https://github.com/silmo-yokohama/cocktailpedia/pull/9) |

---

## 実装範囲

Gemini APIとの通信を担当するモジュールを作成する。

- API呼び出しユーティリティ（`lib/gemini.ts`）
- Server Action（`actions/ai-cocktail.ts`）
- プロンプトテンプレート定義
- エラーハンドリング・リトライロジック

---

## 新規作成ファイル

### `src/lib/gemini.ts`

**実装内容:**

```typescript
// 主要な関数
export async function generateCocktailRecipe(cocktailName: string): Promise<CocktailRecipeResponse>
export async function generateCocktailImage(name: string, glass: string, color: string): Promise<string>

// 内部関数
async function callGeminiAPI(prompt: string, model: string): Promise<string>
async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number): Promise<T>
```

**プロンプトテンプレート:**

```
あなたはカクテルのプロです。
以下のカクテル名について、レシピ情報をJSON形式で返してください。

【重要なルール】
- 確実にわかる情報のみ記載し、推測や創作は絶対にしないでください
- わからない項目は null を設定してください
- 各フィールドの許容値は指定されたもののみ使用してください
- 材料名は一般名称を使用してください（商品名は使わない）
- 情報を持っていないカクテルの場合は {"error": "unknown_cocktail"} を返してください

【カクテル名】
{cocktailName}

【レスポンス形式】
{jsonSchema}
```

**リトライロジック:**
- 最大2回リトライ
- 指数バックオフ（1秒 → 2秒）

---

### `src/actions/ai-cocktail.ts`

**実装内容:**

```typescript
"use server"

// カクテル情報をAIから取得
export async function fetchCocktailRecipe(cocktailName: string): Promise<ActionResult<CocktailRecipeResponse>>

// 画像を生成してStorageに保存
export async function generateCocktailImageAction(
  name: string, 
  glass: string, 
  color: string
): Promise<ActionResult<string>> // URL返却
```

**バリデーション:**
- カクテル名が空でないか
- カクテル名が100文字以内か
- カクテル名が既に登録済みでないか（DB照会、完全一致）

---

### `src/types/ai.ts`（型定義）

```typescript
// AIレスポンスの型
export interface CocktailRecipeResponse {
  name: string
  name_en: string | null
  name_alias: string | null
  slug: string
  description: string | null
  cocktail_word: string | null
  base: BaseType
  technique: TechniqueType
  glass: GlassType
  alcohol_percentage: number
  temperature: TemperatureType
  carbonation: CarbonationType
  color: ColorType | null
  variation_text: string | null
  ingredients: IngredientInput[]
}

export interface IngredientInput {
  name: string
  name_en: string | null
  category: IngredientCategory | null
  amount: string | null
}

// エラーレスポンス
export interface AIErrorResponse {
  error: "unknown_cocktail" | "parse_error" | "api_error"
  message?: string
}
```

---

## 達成すべきこと

- [ ] `lib/gemini.ts` が作成され、API呼び出しが動作する
- [ ] `actions/ai-cocktail.ts` が作成され、Server Actionとして呼び出せる
- [ ] `types/ai.ts` が作成され、型定義が完了している
- [ ] エラーハンドリング（リトライ、各種エラーコード対応）が実装されている
- [ ] コンソールログで動作確認できる（フォーム連携は次タスク）

---

## 守るべき制約

- `docs/04_guidelines/coding_standards.md` に従う
- 環境変数 `GEMINI_API_KEY` は `.env.local` から読み込み（既に設定済み）
- クライアントにAPIキーを露出しない（Server Actionで呼び出し）
- リトライは最大2回

---

## 参照ドキュメント

| ドキュメント | 用途 |
|-------------|------|
| 追加要件 | [additional_ai_recipe_input.md](file:///home/a/03.products/cocktailpedia/docs/02_requirements/additional_ai_recipe_input.md) |
| 全体実装計画 | [implementation_plan_ai_recipe_input.md](file:///home/a/03.products/cocktailpedia/docs/04_design/implementation_plan_ai_recipe_input.md) |
| コーディング規約 | docs/04_guidelines/coding_standards.md |

---

## Git運用

- 開発は `develop` ブランチをベースとする
- 作業ブランチ: `feature/task-01-gemini-api`
- 全ての実装が完了し、施主が確認したらPRを作成
- PRは `develop` へマージ

---

## 判断に迷ったら

- 自分で判断せず、選択肢を提示して施主に確認

---

## 動作確認方法

1. `src/lib/gemini.ts` に簡単なテスト呼び出しを追加
2. `npm run dev` でサーバー起動
3. Server Actionを呼び出すテストページ or コンソールで確認
4. 「ジントニック」「マルガリータ」「存在しないカクテル名」でテスト

---

## 作業完了後チェック

- [x] 全ての変更をコミット
- [x] 施主に完了報告（動作確認結果を添えて）
- [x] 施主確認後、PRを作成

---

## 実装完了報告

### 作成ファイル

| ファイル | 説明 |
|---------|------|
| `src/types/ai.ts` | AI関連の型定義 |
| `src/lib/gemini.ts` | Gemini API連携ユーティリティ |
| `src/actions/ai-cocktail.ts` | Server Action |
| `src/types/index.ts` | 型のエクスポート追加（修正） |

### 実装仕様

| 項目 | 内容 |
|------|------|
| 使用モデル | `gemini-2.5-flash-preview-05-20` |
| リトライ | 最大2回、指数バックオフ（1秒→2秒） |
| バリデーション | 空チェック、100文字制限、DB重複チェック |

---

## Task 2向け: テスト方針・引き継ぎ事項

### 呼び出し方法

```typescript
import { fetchCocktailRecipe } from "@/actions/ai-cocktail"

// Server Actionを呼び出し
const result = await fetchCocktailRecipe("ジントニック")

if (result.success) {
  // result.data に CocktailRecipeResponse が入っている
  console.log(result.data)
} else {
  // result.error と result.message でエラー情報取得
  console.error(result.error, result.message)
}
```

### テストケース

Task 2のフォーム実装時に以下のテストを実施すること。

#### 正常系テスト

| テストケース | 入力 | 期待結果 |
|-------------|------|---------|
| 有名カクテル1 | 「ジントニック」 | レシピ情報が返却される |
| 有名カクテル2 | 「マルガリータ」 | レシピ情報が返却される |
| 有名カクテル3 | 「モヒート」 | レシピ情報が返却される |

**確認ポイント:**
- `base`, `technique`, `glass` 等が許容値内であること
- `ingredients` 配列に材料が含まれていること
- `slug` が英小文字・ハイフン形式であること

#### 異常系テスト

| テストケース | 入力 | 期待結果 |
|-------------|------|---------|
| 空文字 | `""` | `validation_error`: 「カクテル名を入力してください」 |
| 長すぎる名前 | 101文字以上 | `validation_error`: 「100文字以内で入力してください」 |
| 存在しないカクテル | 「あいうえおカクテル」 | `unknown_cocktail`: 「情報は見つかりませんでした」 |
| 登録済みカクテル | DB登録済みの名前 | `validation_error`: 「既に登録されています」 |

### レスポンス型

```typescript
// 成功時
{
  success: true,
  data: {
    name: "ジントニック",
    name_en: "Gin and Tonic",
    slug: "gin-and-tonic",
    base: "gin",
    technique: "build",
    glass: "highball",
    alcohol_percentage: 10,
    temperature: "ice",
    carbonation: "strong",
    color: "clear",
    description: "...",
    cocktail_word: "...",
    ingredients: [
      { name: "ジン", name_en: "Gin", category: "spirits", amount: "45ml" },
      { name: "トニックウォーター", name_en: "Tonic Water", category: "soda", amount: "適量" }
    ]
  }
}

// 失敗時
{
  success: false,
  error: "unknown_cocktail" | "validation_error" | "api_error" | "rate_limit" | "parse_error",
  message: "ユーザー向けエラーメッセージ"
}
```

### 注意事項

1. **APIレート制限**: 無料枠のため、短時間に大量のリクエストを送らないこと
2. **リトライ動作**: 失敗時は自動で最大2回リトライするため、レスポンスに時間がかかる場合がある
3. **材料マッチング**: `ingredients` 配列の材料名は材料マスタと一致しない可能性がある（Task 3で対応）
4. **画像生成**: `generateCocktailImageAction` はTask 4で実装予定（現在はスタブ）
