/**
 * 材料マッチングロジック
 * AIが返した材料と材料マスタを突き合わせる処理
 */

import type { AIIngredientInput, Ingredient } from "@/types"

// ============================================
// 型定義
// ============================================

/**
 * マッチング結果の材料情報
 */
export interface MatchedIngredient {
  /** AIが返した材料情報 */
  aiIngredient: AIIngredientInput
  /** 材料マスタの情報 */
  masterIngredient: Ingredient
}

/**
 * マッチング結果
 */
export interface MatchResult {
  /** マッチした材料（材料マスタに存在） */
  matched: MatchedIngredient[]
  /** 未マッチの材料（材料マスタに存在しない） */
  unmatched: AIIngredientInput[]
}

// ============================================
// マッチング関数
// ============================================

/**
 * AIが返した材料と材料マスタをマッチングする
 *
 * 完全一致のみで検索を行う。部分一致・曖昧検索は行わない。
 * マスタに存在しない材料は未登録材料（unmatched）として返す。
 *
 * @param aiIngredients AIが返した材料リスト
 * @param masterIngredients 材料マスタ（全件）
 * @returns マッチング結果
 *
 * @example
 * const result = matchIngredients(
 *   [{ name: "ジン", amount: "45ml", ... }, { name: "トニックウォーター", amount: "適量", ... }],
 *   masterIngredients
 * )
 * // result.matched: マッチした材料
 * // result.unmatched: 未登録材料
 */
export function matchIngredients(
  aiIngredients: AIIngredientInput[],
  masterIngredients: Ingredient[]
): MatchResult {
  const matched: MatchedIngredient[] = []
  const unmatched: AIIngredientInput[] = []

  // 材料マスタを名前でインデックス化（高速検索用）
  const masterMap = new Map<string, Ingredient>()
  for (const master of masterIngredients) {
    // 日本語名で検索
    masterMap.set(master.name, master)

    // 英語名がある場合はそちらでも検索可能にする
    if (master.name_en) {
      masterMap.set(master.name_en.toLowerCase(), master)
    }
  }

  // 各AI材料をマッチング
  for (const aiIngredient of aiIngredients) {
    // まず日本語名で完全一致検索
    let master = masterMap.get(aiIngredient.name)

    // 見つからない場合、英語名で検索（小文字で比較）
    if (!master && aiIngredient.name_en) {
      master = masterMap.get(aiIngredient.name_en.toLowerCase())
    }

    if (master) {
      matched.push({
        aiIngredient,
        masterIngredient: master,
      })
    } else {
      unmatched.push(aiIngredient)
    }
  }

  return { matched, unmatched }
}

/**
 * マッチング結果からレシピ項目用のデータを生成する
 *
 * @param matchResult マッチング結果
 * @returns レシピ項目用のデータ配列
 */
export function createRecipeItemsFromMatchResult(
  matchResult: MatchResult
): { ingredient_id: string; amount: string; sort_order: number }[] {
  return matchResult.matched.map((item, index) => ({
    ingredient_id: item.masterIngredient.id,
    amount: item.aiIngredient.amount || "",
    sort_order: index,
  }))
}
