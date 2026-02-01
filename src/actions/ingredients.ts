"use server"

/**
 * 材料関連のServer Actions
 */

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import type { Ingredient, ActionResult } from "@/types"

// ============================================
// 材料の新規作成
// ============================================

/**
 * 材料作成時の入力データ型
 */
export interface CreateIngredientInput {
  /** 材料名（日本語） */
  name: string
  /** 英語名 */
  name_en?: string | null
  /** カテゴリ */
  category?: string | null
}

/**
 * 材料を新規作成する
 *
 * 未登録材料ダイアログから呼び出され、材料マスタに新しい材料を追加する。
 * 同名の材料が既に存在する場合はエラーを返す。
 *
 * @param data 材料作成データ
 * @returns 作成された材料情報、またはエラー
 *
 * @example
 * const result = await createIngredient({
 *   name: "ドライジン",
 *   name_en: "Dry Gin",
 *   category: "spirits"
 * })
 */
export async function createIngredient(
  data: CreateIngredientInput
): Promise<ActionResult<Ingredient>> {
  const supabase = createServerClient()

  // バリデーション
  if (!data.name || data.name.trim().length === 0) {
    return {
      success: false,
      error: "validation_error",
      message: "材料名を入力してください",
    }
  }

  const trimmedName = data.name.trim()

  // 同名チェック
  const { data: existing } = await supabase
    .from("ingredients")
    .select("id")
    .eq("name", trimmedName)
    .single()

  if (existing) {
    return {
      success: false,
      error: "validation_error",
      message: `「${trimmedName}」は既に登録されています`,
    }
  }

  // 材料を作成
  const { data: ingredient, error } = await supabase
    .from("ingredients")
    .insert({
      name: trimmedName,
      name_en: data.name_en?.trim() || null,
      category: data.category || null,
      is_searchable: false, // 新規登録材料はデフォルトで検索対象外
    })
    .select("*")
    .single()

  if (error || !ingredient) {
    console.error("材料の作成に失敗しました:", error)
    return {
      success: false,
      error: "api_error",
      message: "材料の作成に失敗しました",
    }
  }

  // キャッシュを再検証
  revalidatePath("/admin/ingredients")

  return {
    success: true,
    data: ingredient as Ingredient,
  }
}

// ============================================
// 複数材料の一括作成
// ============================================

/**
 * 複数材料を一括作成する
 *
 * 未登録材料ダイアログで複数の新規材料を同時に登録する際に使用。
 * 各材料の作成結果を個別に返す。
 *
 * @param ingredients 作成する材料リスト
 * @returns 各材料の作成結果
 */
export async function createIngredients(
  ingredients: CreateIngredientInput[]
): Promise<ActionResult<Ingredient>[]> {
  // 各材料を順次作成
  const results: ActionResult<Ingredient>[] = []

  for (const data of ingredients) {
    const result = await createIngredient(data)
    results.push(result)
  }

  return results
}
