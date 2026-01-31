/**
 * AI関連の型定義
 * Gemini APIを使用したカクテル情報自動入力機能で使用
 */

import type {
  BaseValue,
  CarbonationValue,
  ColorValue,
  GlassValue,
  IngredientCategoryValue,
  TechniqueValue,
  TemperatureValue,
} from "./constants"

// ============================================
// AIレスポンスの型定義
// ============================================

/**
 * AIが返す材料情報
 */
export interface AIIngredientInput {
  /** 材料名（日本語、一般名称） */
  name: string
  /** 英語名 */
  name_en: string | null
  /** カテゴリ */
  category: IngredientCategoryValue | null
  /** 分量（「30ml」「適量」等） */
  amount: string | null
}

/**
 * AIが返すカクテルレシピ情報
 */
export interface CocktailRecipeResponse {
  /** カクテル名（日本語） */
  name: string
  /** 英語名 */
  name_en: string | null
  /** 別名 */
  name_alias: string | null
  /** URLスラッグ（英小文字・ハイフン区切り） */
  slug: string
  /** 説明・由来・歴史 */
  description: string | null
  /** カクテル言葉 */
  cocktail_word: string | null
  /** ベース（基酒） */
  base: BaseValue
  /** 技法 */
  technique: TechniqueValue
  /** グラスの種類 */
  glass: GlassValue
  /** 度数（推定、0-100） */
  alcohol_percentage: number
  /** 冷たさ */
  temperature: TemperatureValue
  /** 炭酸 */
  carbonation: CarbonationValue
  /** カラー */
  color: ColorValue | null
  /** バリエーション（派生カクテル名、カンマ区切り） */
  variation_text: string | null
  /** 材料リスト */
  ingredients: AIIngredientInput[]
}

// ============================================
// エラーレスポンスの型定義
// ============================================

/** AIエラーの種類 */
export type AIErrorType = "unknown_cocktail" | "parse_error" | "api_error" | "rate_limit" | "validation_error"

/**
 * AIエラーレスポンス
 */
export interface AIErrorResponse {
  /** エラーコード */
  error: AIErrorType
  /** エラーメッセージ */
  message?: string
}

// ============================================
// Server Action の結果型
// ============================================

/**
 * Server Actionの成功結果
 */
export interface ActionSuccess<T> {
  success: true
  data: T
}

/**
 * Server Actionの失敗結果
 */
export interface ActionError {
  success: false
  error: AIErrorType
  message: string
}

/**
 * Server Actionの結果型
 */
export type ActionResult<T> = ActionSuccess<T> | ActionError

// ============================================
// 内部処理用の型定義
// ============================================

/**
 * Gemini APIのレスポンス候補
 */
export interface GeminiCandidate {
  content: {
    parts: { text: string }[]
    role: string
  }
  finishReason: string
}

/**
 * Gemini APIのレスポンス
 */
export interface GeminiResponse {
  candidates: GeminiCandidate[]
}
