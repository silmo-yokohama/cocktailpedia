"use server"

/**
 * AI自動入力機能のServer Actions
 * Gemini APIを使用してカクテル情報を取得・画像を生成する
 */

import { createServerClient } from "@/lib/supabase/server"
import { generateCocktailRecipe, generateCocktailImage } from "@/lib/gemini"
import type { ActionResult, CocktailRecipeResponse } from "@/types"

// ============================================
// 定数
// ============================================

/** カクテル名の最大文字数 */
const MAX_COCKTAIL_NAME_LENGTH = 100

// ============================================
// バリデーション関数
// ============================================

/**
 * カクテル名のバリデーションを行う
 * @param cocktailName カクテル名
 * @returns バリデーションエラーメッセージ（正常時はnull）
 */
function validateCocktailName(cocktailName: string): string | null {
  // 空チェック
  if (!cocktailName || cocktailName.trim().length === 0) {
    return "カクテル名を入力してください"
  }

  // 文字数チェック
  if (cocktailName.length > MAX_COCKTAIL_NAME_LENGTH) {
    return `カクテル名は${MAX_COCKTAIL_NAME_LENGTH}文字以内で入力してください`
  }

  return null
}

/**
 * カクテル名がDBに既に登録されているかチェック
 * @param cocktailName カクテル名
 * @returns 既に登録済みの場合はtrue
 */
async function isCocktailNameExists(cocktailName: string): Promise<boolean> {
  const supabase = createServerClient()

  const { data } = await supabase
    .from("cocktails")
    .select("id")
    .eq("name", cocktailName.trim())
    .single()

  return data !== null
}

// ============================================
// Server Actions
// ============================================

/**
 * カクテル情報をAIから取得する
 *
 * フロントエンドから呼び出し可能なServer Action。
 * カクテル名からGemini APIを使用してレシピ情報を取得する。
 *
 * @param cocktailName カクテル名（日本語）
 * @returns カクテルレシピ情報、またはエラー
 */
export async function fetchCocktailRecipe(
  cocktailName: string
): Promise<ActionResult<CocktailRecipeResponse>> {
  try {
    // バリデーション
    const validationError = validateCocktailName(cocktailName)
    if (validationError) {
      return {
        success: false,
        error: "validation_error",
        message: validationError,
      }
    }

    // 重複チェック
    const exists = await isCocktailNameExists(cocktailName)
    if (exists) {
      return {
        success: false,
        error: "validation_error",
        message: "このカクテルは既に登録されています",
      }
    }

    // Gemini APIを呼び出し
    const result = await generateCocktailRecipe(cocktailName.trim())

    // unknown_cocktail エラーのチェック
    if ("error" in result && result.error === "unknown_cocktail") {
      return {
        success: false,
        error: "unknown_cocktail",
        message: "このカクテルの情報は見つかりませんでした",
      }
    }

    return {
      success: true,
      data: result as CocktailRecipeResponse,
    }
  } catch (error) {
    console.error("fetchCocktailRecipe エラー:", error)

    // エラーメッセージからエラータイプを判定
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage.includes("RATE_LIMIT")) {
      return {
        success: false,
        error: "rate_limit",
        message: "APIの利用制限に達しました。時間を置いて再度お試しください",
      }
    }

    if (errorMessage.includes("PARSE_ERROR")) {
      return {
        success: false,
        error: "parse_error",
        message: "レスポンスの解析に失敗しました。再度お試しください",
      }
    }

    if (errorMessage.includes("UNAUTHORIZED")) {
      return {
        success: false,
        error: "api_error",
        message: "API設定を確認してください",
      }
    }

    return {
      success: false,
      error: "api_error",
      message: "カクテル情報の取得に失敗しました。時間を置いて再度お試しください",
    }
  }
}

/**
 * カクテル画像をAIで生成してStorageに保存する
 *
 * Task 4で本実装予定。現時点ではスタブ。
 *
 * @param name カクテル名
 * @param glass グラスの種類
 * @param color カクテルの色
 * @returns 生成された画像のURL、またはエラー
 */
export async function generateCocktailImageAction(
  name: string,
  glass: string,
  color: string
): Promise<ActionResult<string>> {
  try {
    // TODO: Task 4で実装
    // 1. generateCocktailImage でBase64画像を取得
    // 2. Supabase Storageにアップロード
    // 3. 公開URLを返す

    // 現時点ではスタブ
    const imageBase64 = await generateCocktailImage(name, glass, color)

    // スタブなので到達しない
    return {
      success: true,
      data: imageBase64,
    }
  } catch (error) {
    console.error("generateCocktailImageAction エラー:", error)

    const errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage.includes("NOT_IMPLEMENTED")) {
      return {
        success: false,
        error: "api_error",
        message: "画像生成機能は現在準備中です",
      }
    }

    return {
      success: false,
      error: "api_error",
      message: "画像の生成に失敗しました。画像なしで続行してください",
    }
  }
}
