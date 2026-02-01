/**
 * Gemini API連携ユーティリティ
 * カクテル情報自動入力機能でGemini APIを呼び出す
 */

import type { CocktailRecipeResponse, GeminiResponse, GeminiImageResponse } from "@/types"

// ============================================
// 定数
// ============================================

/** Gemini API エンドポイント */
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models"

/** テキスト生成に使用するモデル */
const TEXT_MODEL = "gemini-3-flash-preview"

/** 画像生成に使用するモデル */
const IMAGE_MODEL = "gemini-3-pro-image-preview"

/** 最大リトライ回数 */
const MAX_RETRIES = 2

/** リトライ時の初期待機時間（ミリ秒） */
const INITIAL_BACKOFF_MS = 1000

// ============================================
// プロンプトテンプレート
// ============================================

/**
 * カクテルレシピ取得用のJSON Schema
 */
const RECIPE_JSON_SCHEMA = `{
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
}`

/**
 * カクテルレシピ取得用のプロンプトを生成
 * @param cocktailName カクテル名
 * @param existingIngredients 既存の材料名リスト（表記揺れ対策用）
 * @returns プロンプト文字列
 */
function buildRecipePrompt(cocktailName: string, existingIngredients?: string[]): string {
  // 既存材料リストのセクション（存在する場合のみ追加）
  const ingredientListSection = existingIngredients && existingIngredients.length > 0
    ? `
【既存材料リスト】
以下の材料名がすでに登録されています。可能な限りこのリストから選択してください。
リストにない材料のみ新しい名前を使用してください。

${existingIngredients.join(", ")}
`
    : ""

  return `あなたはカクテルのプロです。
以下のカクテル名について、レシピ情報をJSON形式で返してください。

【重要なルール】
- 確実にわかる情報のみ記載し、推測や創作は絶対にしないでください
- わからない項目は null を設定してください
- 各フィールドの許容値は指定されたもののみ使用してください
- 材料名は一般名称を使用してください（商品名は使わない）
- 情報を持っていないカクテルの場合は {"error": "unknown_cocktail"} を返してください
${ingredientListSection}
【カクテル名】
${cocktailName}

【レスポンス形式】
以下のJSON Schemaに従ってください:
${RECIPE_JSON_SCHEMA}

JSONのみを返してください。説明文は不要です。`
}

/**
 * 画像生成用のプロンプトを生成
 * @param name カクテル名
 * @param glass グラスの種類
 * @param color カクテルの色
 * @returns プロンプト文字列
 */
function buildImagePrompt(name: string, glass: string, color: string): string {
  return `A photorealistic product photography of "${name}" cocktail.

Glass type: ${glass} glass
Cocktail color: ${color}
Style: Professional studio photography with soft lighting
Background: Clean, minimalist bar counter with subtle bokeh
Angle: Slightly elevated 45-degree angle
Details: Condensation on glass, appropriate garnish if applicable
Quality: High resolution, sharp focus on the cocktail

Do not include any text or labels in the image.`
}

// ============================================
// ユーティリティ関数
// ============================================

/**
 * 指定時間待機する
 * @param ms 待機時間（ミリ秒）
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * リトライ付きで関数を実行する
 * @param fn 実行する関数
 * @param maxRetries 最大リトライ回数
 * @returns 関数の実行結果
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.error(`Gemini API呼び出し失敗 (試行 ${attempt + 1}/${maxRetries + 1}):`, lastError.message)

      if (attempt < maxRetries) {
        // 指数バックオフで待機（1秒 → 2秒）
        const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt)
        console.log(`${backoffMs}ms後にリトライします...`)
        await sleep(backoffMs)
      }
    }
  }

  throw lastError
}

// ============================================
// API呼び出し関数
// ============================================

/**
 * Gemini APIを呼び出してテキストを生成する
 * @param prompt プロンプト
 * @param model 使用するモデル
 * @returns 生成されたテキスト
 */
async function callGeminiAPI(prompt: string, model: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY が設定されていません")
  }

  const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.1, // 創造性を抑えて正確性を優先
        topP: 0.8,
        topK: 40,
      },
    }),
  })

  // HTTPエラーのハンドリング
  if (!response.ok) {
    const errorBody = await response.text()
    console.error("Gemini API エラーレスポンス:", errorBody)

    if (response.status === 429) {
      throw new Error("RATE_LIMIT: レート制限に達しました")
    }
    if (response.status === 400) {
      throw new Error("BAD_REQUEST: リクエストが不正です")
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("UNAUTHORIZED: APIキーが無効または権限がありません")
    }
    if (response.status >= 500) {
      throw new Error("SERVER_ERROR: APIサーバーで問題が発生しました")
    }

    throw new Error(`API_ERROR: HTTPステータス ${response.status}`)
  }

  const data = (await response.json()) as GeminiResponse

  // レスポンスの検証
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("EMPTY_RESPONSE: レスポンスが空です")
  }

  const candidate = data.candidates[0]
  if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
    throw new Error("EMPTY_CONTENT: レスポンスのコンテンツが空です")
  }

  return candidate.content.parts[0].text
}

/**
 * Gemini APIを呼び出して画像を生成する
 * @param prompt 画像生成プロンプト
 * @returns Base64エンコードされた画像データ
 */
async function callGeminiImageAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY が設定されていません")
  }

  const url = `${GEMINI_API_URL}/${IMAGE_MODEL}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        // 画像生成用の設定（IMAGE のみを指定）
        responseModalities: ["IMAGE"],
      },
    }),
  })

  // HTTPエラーのハンドリング
  if (!response.ok) {
    const errorBody = await response.text()
    console.error("Gemini Image API エラーレスポンス:", errorBody)

    if (response.status === 429) {
      throw new Error("RATE_LIMIT: レート制限に達しました")
    }
    if (response.status === 400) {
      throw new Error("BAD_REQUEST: リクエストが不正です")
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("UNAUTHORIZED: APIキーが無効または権限がありません")
    }
    if (response.status >= 500) {
      throw new Error("SERVER_ERROR: APIサーバーで問題が発生しました")
    }

    throw new Error(`API_ERROR: HTTPステータス ${response.status}`)
  }

  const data = (await response.json()) as GeminiImageResponse

  // レスポンスの検証
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("EMPTY_RESPONSE: レスポンスが空です")
  }

  const candidate = data.candidates[0]
  if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
    throw new Error("EMPTY_CONTENT: レスポンスのコンテンツが空です")
  }

  const inlineData = candidate.content.parts[0].inlineData
  if (!inlineData || !inlineData.data) {
    throw new Error("NO_IMAGE_DATA: 画像データが含まれていません")
  }

  return inlineData.data
}

/**
 * JSONテキストを抽出・パースする
 * Geminiのレスポンスにはマークダウンのコードブロックが含まれる場合がある
 * @param text レスポンステキスト
 * @returns パースされたオブジェクト
 */
function extractAndParseJSON<T>(text: string): T {
  // コードブロックを除去
  let jsonStr = text.trim()

  // ```json ... ``` の形式を除去
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7)
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3)
  }

  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3)
  }

  jsonStr = jsonStr.trim()

  try {
    return JSON.parse(jsonStr) as T
  } catch {
    throw new Error(`PARSE_ERROR: JSONのパースに失敗しました: ${jsonStr.substring(0, 100)}...`)
  }
}

// ============================================
// 公開API
// ============================================

/**
 * カクテルのレシピ情報をAIから取得する
 * @param cocktailName カクテル名
 * @param existingIngredients 既存の材料名リスト（表記揺れ対策用）
 * @returns カクテルレシピ情報、またはエラー
 */
export async function generateCocktailRecipe(
  cocktailName: string,
  existingIngredients?: string[]
): Promise<CocktailRecipeResponse | { error: "unknown_cocktail" }> {
  const prompt = buildRecipePrompt(cocktailName, existingIngredients)

  // リトライ付きでAPI呼び出し
  const responseText = await retryWithBackoff(() => callGeminiAPI(prompt, TEXT_MODEL))

  // JSONをパース
  const parsed = extractAndParseJSON<CocktailRecipeResponse | { error: "unknown_cocktail" }>(responseText)

  // unknown_cocktail エラーのチェック
  if ("error" in parsed && parsed.error === "unknown_cocktail") {
    return { error: "unknown_cocktail" }
  }

  return parsed as CocktailRecipeResponse
}

/**
 * カクテルの画像をAIで生成する
 * @param name カクテル名
 * @param glass グラスの種類
 * @param color カクテルの色
 * @returns Base64エンコードされた画像データ
 */
export async function generateCocktailImage(
  name: string,
  glass: string,
  color: string
): Promise<string> {
  const prompt = buildImagePrompt(name, glass, color)
  console.log("画像生成プロンプト:", prompt)

  // リトライ付きでAPI呼び出し
  const imageBase64 = await retryWithBackoff(() => callGeminiImageAPI(prompt))

  return imageBase64
}
