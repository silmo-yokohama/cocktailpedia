"use server"

/**
 * AI自動入力機能のServer Actions
 * Gemini APIを使用してカクテル情報を取得・画像を生成する
 */

import { createServerClient } from "@/lib/supabase/server"
import { generateCocktailRecipe, generateCocktailImage } from "@/lib/gemini"
import type { ActionResult, CocktailRecipeResponse } from "@/types"

// ============================================
// 定数（画像生成用）
// ============================================

/** 画像保存用バケット名 */
const IMAGE_BUCKET = "cocktail-images"

/** AI生成画像の保存先ディレクトリ */
const AI_IMAGE_DIR = "ai-generated"

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
 * @param name カクテル名
 * @param slug URLスラッグ（ファイル名に使用）
 * @param glass グラスの種類
 * @param color カクテルの色
 * @returns 生成された画像のURL、またはエラー
 */
export async function generateCocktailImageAction(
  name: string,
  slug: string,
  glass: string,
  color: string
): Promise<ActionResult<string>> {
  try {
    // 入力バリデーション
    if (!name || !slug || !glass || !color) {
      return {
        success: false,
        error: "validation_error",
        message: "画像生成に必要な情報が不足しています",
      }
    }

    // 1. Gemini APIで画像を生成（Base64形式）
    console.log(`画像生成開始: ${name} (${slug})`)
    const imageBase64 = await generateCocktailImage(name, glass, color)

    // 2. Base64をBlobに変換
    const binaryString = atob(imageBase64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const imageBlob = new Blob([bytes], { type: "image/png" })

    // 3. Supabase Storageにアップロード
    const supabase = createServerClient()
    const fileName = `${AI_IMAGE_DIR}/${slug}.png`

    // 既存ファイルがあれば削除（上書き用）
    await supabase.storage.from(IMAGE_BUCKET).remove([fileName])

    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(fileName, imageBlob, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadError) {
      console.error("画像のアップロードに失敗しました:", uploadError)
      return {
        success: false,
        error: "api_error",
        message: "画像の保存に失敗しました。画像なしで続行してください",
      }
    }

    // 4. 公開URLを取得
    const { data: urlData } = supabase.storage
      .from(IMAGE_BUCKET)
      .getPublicUrl(fileName)

    console.log(`画像生成完了: ${urlData.publicUrl}`)

    return {
      success: true,
      data: urlData.publicUrl,
    }
  } catch (error) {
    console.error("generateCocktailImageAction エラー:", error)

    const errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage.includes("RATE_LIMIT")) {
      return {
        success: false,
        error: "rate_limit",
        message: "APIの利用制限に達しました。時間を置いて再度お試しください",
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
      message: "画像の生成に失敗しました。画像なしで続行してください",
    }
  }
}
