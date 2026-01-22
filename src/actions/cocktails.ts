"use server"

import { createServerClient } from "@/lib/supabase/server"
import type { Cocktail, CocktailWithRecipe, SearchFilters, SortOptionValue } from "@/types"
import { ALCOHOL_STRENGTH_OPTIONS } from "@/types"

/** 1回の読み込み件数 */
const DEFAULT_LIMIT = 60

/**
 * ソートオプションをSupabaseのクエリパラメータに変換
 * @param sort ソートオプション
 * @returns [column, ascending]
 */
function getSortParams(sort: SortOptionValue): [string, { ascending: boolean }] {
  switch (sort) {
    case "name_asc":
      return ["name", { ascending: true }]
    case "name_desc":
      return ["name", { ascending: false }]
    case "view_count_desc":
      return ["view_count", { ascending: false }]
    case "bookmark_count_desc":
      return ["bookmark_count", { ascending: false }]
    default:
      // デフォルトは登録順（created_at DESC）
      return ["created_at", { ascending: false }]
  }
}

/**
 * カクテル一覧を取得
 * @param params 取得パラメータ
 * @returns カクテル一覧とページネーション情報
 */
export async function getCocktails(params: {
  offset?: number
  limit?: number
  sort?: SortOptionValue
  filters?: SearchFilters
}): Promise<{ items: Cocktail[]; hasMore: boolean }> {
  const { offset = 0, limit = DEFAULT_LIMIT, sort = "name_asc", filters } = params

  const supabase = createServerClient()

  // ベースクエリを構築
  let query = supabase.from("cocktails").select("*", { count: "exact" })

  // フィルター適用
  if (filters) {
    // フリーワード検索（カクテル名に部分一致）
    if (filters.keyword) {
      query = query.or(
        `name.ilike.%${filters.keyword}%,name_en.ilike.%${filters.keyword}%,name_alias.ilike.%${filters.keyword}%`
      )
    }

    // ベースでフィルター
    if (filters.base) {
      query = query.eq("base", filters.base)
    }

    // 技法でフィルター
    if (filters.technique) {
      query = query.eq("technique", filters.technique)
    }

    // グラスでフィルター
    if (filters.glass) {
      query = query.eq("glass", filters.glass)
    }

    // 冷たさでフィルター
    if (filters.temperature) {
      query = query.eq("temperature", filters.temperature)
    }

    // 炭酸でフィルター
    if (filters.carbonation) {
      query = query.eq("carbonation", filters.carbonation)
    }

    // カラーでフィルター
    if (filters.color) {
      query = query.eq("color", filters.color)
    }

    // 度数でフィルター
    if (filters.alcoholStrength) {
      const strengthOption = ALCOHOL_STRENGTH_OPTIONS.find((opt) => opt.value === filters.alcoholStrength)
      if (strengthOption) {
        query = query.gte("alcohol_percentage", strengthOption.min).lte("alcohol_percentage", strengthOption.max)
      }
    }

    // 材料IDでフィルター（サブクエリを使用）
    if (filters.ingredientIds && filters.ingredientIds.length > 0) {
      // 指定されたすべての材料を含むカクテルを検索（AND条件）
      for (const ingredientId of filters.ingredientIds) {
        // 各材料について、recipe_itemsに存在するカクテルIDを取得
        const { data: cocktailIds } = await supabase
          .from("recipe_items")
          .select("cocktail_id")
          .eq("ingredient_id", ingredientId)

        if (cocktailIds && cocktailIds.length > 0) {
          query = query.in(
            "id",
            cocktailIds.map((item) => item.cocktail_id)
          )
        } else {
          // 該当する材料を持つカクテルがない場合、空の結果を返す
          return { items: [], hasMore: false }
        }
      }
    }
  }

  // ソートを適用
  const [sortColumn, sortOptions] = getSortParams(sort)
  query = query.order(sortColumn, sortOptions)

  // ページネーション
  query = query.range(offset, offset + limit)

  const { data, count, error } = await query

  if (error) {
    console.error("カクテル一覧の取得に失敗しました:", error)
    return { items: [], hasMore: false }
  }

  const items = (data as Cocktail[]) || []
  const hasMore = count !== null && offset + items.length < count

  return { items, hasMore }
}

/**
 * カクテル詳細をslugで取得
 * @param slug カクテルのslug
 * @returns カクテル詳細（レシピ付き）
 */
export async function getCocktailBySlug(slug: string): Promise<CocktailWithRecipe | null> {
  const supabase = createServerClient()

  // カクテル本体を取得
  const { data: cocktail, error: cocktailError } = await supabase
    .from("cocktails")
    .select("*")
    .eq("slug", slug)
    .single()

  if (cocktailError || !cocktail) {
    console.error("カクテルの取得に失敗しました:", cocktailError)
    return null
  }

  // レシピ項目を取得（材料情報を結合）
  const { data: recipeItems, error: recipeError } = await supabase
    .from("recipe_items")
    .select(
      `
      *,
      ingredient:ingredients(*)
    `
    )
    .eq("cocktail_id", cocktail.id)
    .order("sort_order", { ascending: true })

  if (recipeError) {
    console.error("レシピの取得に失敗しました:", recipeError)
    // レシピがなくてもカクテル情報は返す
    return { ...cocktail, recipe_items: [] } as CocktailWithRecipe
  }

  return {
    ...cocktail,
    recipe_items: recipeItems || [],
  } as CocktailWithRecipe
}

/**
 * 複数のカクテルをIDで取得
 * @param ids カクテルIDの配列
 * @returns カクテル一覧
 */
export async function getCocktailsByIds(ids: string[]): Promise<Cocktail[]> {
  if (ids.length === 0) return []

  const supabase = createServerClient()

  const { data, error } = await supabase.from("cocktails").select("*").in("id", ids)

  if (error) {
    console.error("カクテルの取得に失敗しました:", error)
    return []
  }

  // 入力されたIDの順序を維持する
  const cocktailMap = new Map((data as Cocktail[]).map((c) => [c.id, c]))
  return ids.map((id) => cocktailMap.get(id)).filter((c): c is Cocktail => c !== undefined)
}

/**
 * 閲覧カウントを更新
 * @param id カクテルID
 */
export async function incrementViewCount(id: string): Promise<void> {
  const supabase = createServerClient()

  // 現在の閲覧数を取得して+1する
  const { data: cocktail, error: fetchError } = await supabase
    .from("cocktails")
    .select("view_count")
    .eq("id", id)
    .single()

  if (fetchError || !cocktail) {
    console.error("カクテルの取得に失敗しました:", fetchError)
    return
  }

  const { error } = await supabase
    .from("cocktails")
    .update({ view_count: cocktail.view_count + 1 })
    .eq("id", id)

  if (error) {
    console.error("閲覧カウントの更新に失敗しました:", error)
  }
}

/**
 * ブックマーク数を更新
 * @param id カクテルID
 * @param increment trueで+1、falseで-1
 */
export async function updateBookmarkCount(id: string, increment: boolean): Promise<void> {
  const supabase = createServerClient()

  // 現在のブックマーク数を取得
  const { data: cocktail, error: fetchError } = await supabase
    .from("cocktails")
    .select("bookmark_count")
    .eq("id", id)
    .single()

  if (fetchError || !cocktail) {
    console.error("カクテルの取得に失敗しました:", fetchError)
    return
  }

  // 0未満にならないように調整
  const newCount = Math.max(0, cocktail.bookmark_count + (increment ? 1 : -1))

  const { error } = await supabase.from("cocktails").update({ bookmark_count: newCount }).eq("id", id)

  if (error) {
    console.error("ブックマーク数の更新に失敗しました:", error)
  }
}

/**
 * 関連カクテルを取得
 * 条件: ①同じベース + 材料2つ以上共通、または ②材料3つ以上共通
 * @param cocktailId カクテルID
 * @returns 関連カクテル（最大5件、ブックマーク数順）
 */
export async function getRelatedCocktails(cocktailId: string): Promise<Cocktail[]> {
  const supabase = createServerClient()

  // 現在のカクテルの情報を取得
  const { data: currentCocktail, error: cocktailError } = await supabase
    .from("cocktails")
    .select("id, base")
    .eq("id", cocktailId)
    .single()

  if (cocktailError || !currentCocktail) {
    return []
  }

  // 現在のカクテルの材料IDを取得
  const { data: currentRecipeItems } = await supabase
    .from("recipe_items")
    .select("ingredient_id")
    .eq("cocktail_id", cocktailId)

  const currentIngredientIds = currentRecipeItems?.map((item) => item.ingredient_id) || []

  if (currentIngredientIds.length === 0) {
    return []
  }

  // 他のカクテルを取得（自分以外）
  const { data: otherCocktails } = await supabase.from("cocktails").select("*").neq("id", cocktailId)

  if (!otherCocktails || otherCocktails.length === 0) {
    return []
  }

  // 各カクテルの材料を取得
  const { data: allRecipeItems } = await supabase
    .from("recipe_items")
    .select("cocktail_id, ingredient_id")
    .in(
      "cocktail_id",
      otherCocktails.map((c) => c.id)
    )

  // カクテルごとの材料IDをマップ化
  const cocktailIngredients = new Map<string, Set<string>>()
  for (const item of allRecipeItems || []) {
    if (!cocktailIngredients.has(item.cocktail_id)) {
      cocktailIngredients.set(item.cocktail_id, new Set())
    }
    cocktailIngredients.get(item.cocktail_id)!.add(item.ingredient_id)
  }

  // 関連カクテルを抽出
  const relatedCocktails: Cocktail[] = []
  for (const cocktail of otherCocktails) {
    const ingredients = cocktailIngredients.get(cocktail.id) || new Set()
    const commonCount = currentIngredientIds.filter((id) => ingredients.has(id)).length

    // 条件チェック
    const isSameBase = cocktail.base === currentCocktail.base
    const isRelated = (isSameBase && commonCount >= 2) || commonCount >= 3

    if (isRelated) {
      relatedCocktails.push(cocktail as Cocktail)
    }
  }

  // ブックマーク数順でソートして上位5件を返す
  return relatedCocktails.sort((a, b) => b.bookmark_count - a.bookmark_count).slice(0, 5)
}

/**
 * 検索可能な材料一覧を取得
 * @returns 材料一覧（検索条件に表示するもののみ）
 */
export async function getSearchableIngredients(): Promise<{ id: string; name: string; category: string | null }[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("ingredients")
    .select("id, name, category")
    .eq("is_searchable", true)
    .order("name", { ascending: true })

  if (error) {
    console.error("材料一覧の取得に失敗しました:", error)
    return []
  }

  return data || []
}
