"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import type { Cocktail, Ingredient, RecipeItem } from "@/types"

/** 1ページあたりの表示件数 */
const ITEMS_PER_PAGE = 20

/** 画像アップロード設定 */
const IMAGE_BUCKET = "cocktail-images"
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

// ============================================
// カクテル管理用Server Actions
// ============================================

/**
 * 管理画面用カクテル一覧の型
 */
export interface AdminCocktailListItem {
  id: string
  name: string
  slug: string
  base: string
  image_url: string | null
  updated_at: string
}

/**
 * 管理画面用カクテル一覧を取得
 * @param page ページ番号（1から始まる）
 * @param search 検索キーワード（名前で部分一致）
 * @returns カクテル一覧とページネーション情報
 */
export async function getAdminCocktails(
  page: number = 1,
  search: string = ""
): Promise<{
  items: AdminCocktailListItem[]
  totalCount: number
  totalPages: number
  currentPage: number
}> {
  const supabase = createServerClient()
  const offset = (page - 1) * ITEMS_PER_PAGE

  // クエリ構築
  let query = supabase
    .from("cocktails")
    .select("id, name, slug, base, image_url, updated_at", { count: "exact" })

  // 検索条件
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,name_en.ilike.%${search}%,name_alias.ilike.%${search}%`
    )
  }

  // ソートとページネーション
  const { data, count, error } = await query
    .order("updated_at", { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1)

  if (error) {
    console.error("カクテル一覧の取得に失敗しました:", error)
    return { items: [], totalCount: 0, totalPages: 0, currentPage: page }
  }

  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return {
    items: (data as AdminCocktailListItem[]) || [],
    totalCount,
    totalPages,
    currentPage: page,
  }
}

/**
 * カクテルをIDで取得（編集用）
 * @param id カクテルID
 * @returns カクテル情報（レシピ付き）
 */
export async function getAdminCocktailById(id: string): Promise<{
  cocktail: Cocktail | null
  recipeItems: (RecipeItem & { ingredient: Ingredient })[]
}> {
  const supabase = createServerClient()

  // カクテル本体を取得
  const { data: cocktail, error: cocktailError } = await supabase
    .from("cocktails")
    .select("*")
    .eq("id", id)
    .single()

  if (cocktailError || !cocktail) {
    console.error("カクテルの取得に失敗しました:", cocktailError)
    return { cocktail: null, recipeItems: [] }
  }

  // レシピ項目を取得
  const { data: recipeItems, error: recipeError } = await supabase
    .from("recipe_items")
    .select(`*, ingredient:ingredients(*)`)
    .eq("cocktail_id", id)
    .order("sort_order", { ascending: true })

  if (recipeError) {
    console.error("レシピの取得に失敗しました:", recipeError)
  }

  return {
    cocktail: cocktail as Cocktail,
    recipeItems: (recipeItems as (RecipeItem & { ingredient: Ingredient })[]) || [],
  }
}

/**
 * カクテル登録/更新用の入力データ型
 */
export interface CocktailFormData {
  name: string
  name_en?: string
  name_alias?: string
  slug: string
  description?: string
  cocktail_word?: string
  base: string
  technique: string
  glass: string
  alcohol_percentage: number
  temperature: string
  carbonation: string
  color?: string
  variation_text?: string
  image_url?: string
  /** レシピ項目 */
  recipeItems: {
    ingredient_id: string
    amount: string
    sort_order: number
  }[]
}

/**
 * カクテルを新規登録
 * @param data フォームデータ
 * @returns 作成されたカクテルID、またはエラー
 */
export async function createCocktail(
  data: CocktailFormData
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  const supabase = createServerClient()

  // スラッグの重複チェック
  const { data: existing } = await supabase
    .from("cocktails")
    .select("id")
    .eq("slug", data.slug)
    .single()

  if (existing) {
    return { success: false, error: "このスラッグは既に使用されています" }
  }

  // カクテル情報を挿入
  const { data: cocktail, error: cocktailError } = await supabase
    .from("cocktails")
    .insert({
      name: data.name,
      name_en: data.name_en || null,
      name_alias: data.name_alias || null,
      slug: data.slug,
      description: data.description || null,
      cocktail_word: data.cocktail_word || null,
      base: data.base,
      technique: data.technique,
      glass: data.glass,
      alcohol_percentage: data.alcohol_percentage,
      temperature: data.temperature,
      carbonation: data.carbonation,
      color: data.color || null,
      variation_text: data.variation_text || null,
      image_url: data.image_url || null,
    })
    .select("id")
    .single()

  if (cocktailError || !cocktail) {
    console.error("カクテルの登録に失敗しました:", cocktailError)
    return { success: false, error: "カクテルの登録に失敗しました" }
  }

  // レシピ項目を挿入
  if (data.recipeItems.length > 0) {
    const recipeInserts = data.recipeItems.map((item) => ({
      cocktail_id: cocktail.id,
      ingredient_id: item.ingredient_id,
      amount: item.amount || null,
      sort_order: item.sort_order,
    }))

    const { error: recipeError } = await supabase
      .from("recipe_items")
      .insert(recipeInserts)

    if (recipeError) {
      console.error("レシピの登録に失敗しました:", recipeError)
      // カクテルは作成されたので、エラーでも成功として返す
    }
  }

  // キャッシュを再検証
  revalidatePath("/admin/cocktails")
  revalidatePath("/")
  revalidatePath(`/cocktails/${data.slug}`)

  return { success: true, id: cocktail.id }
}

/**
 * カクテルを更新
 * @param id カクテルID
 * @param data フォームデータ
 * @returns 成功/失敗
 */
export async function updateCocktail(
  id: string,
  data: CocktailFormData
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = createServerClient()

  // 現在のカクテル情報を取得（スラッグ変更のため）
  const { data: currentCocktail } = await supabase
    .from("cocktails")
    .select("slug")
    .eq("id", id)
    .single()

  // スラッグの重複チェック（自分以外）
  const { data: existing } = await supabase
    .from("cocktails")
    .select("id")
    .eq("slug", data.slug)
    .neq("id", id)
    .single()

  if (existing) {
    return { success: false, error: "このスラッグは既に使用されています" }
  }

  // カクテル情報を更新
  const { error: cocktailError } = await supabase
    .from("cocktails")
    .update({
      name: data.name,
      name_en: data.name_en || null,
      name_alias: data.name_alias || null,
      slug: data.slug,
      description: data.description || null,
      cocktail_word: data.cocktail_word || null,
      base: data.base,
      technique: data.technique,
      glass: data.glass,
      alcohol_percentage: data.alcohol_percentage,
      temperature: data.temperature,
      carbonation: data.carbonation,
      color: data.color || null,
      variation_text: data.variation_text || null,
      image_url: data.image_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (cocktailError) {
    console.error("カクテルの更新に失敗しました:", cocktailError)
    return { success: false, error: "カクテルの更新に失敗しました" }
  }

  // 既存のレシピを削除して再登録
  const { error: deleteError } = await supabase
    .from("recipe_items")
    .delete()
    .eq("cocktail_id", id)

  if (deleteError) {
    console.error("レシピの削除に失敗しました:", deleteError)
  }

  // 新しいレシピを挿入
  if (data.recipeItems.length > 0) {
    const recipeInserts = data.recipeItems.map((item) => ({
      cocktail_id: id,
      ingredient_id: item.ingredient_id,
      amount: item.amount || null,
      sort_order: item.sort_order,
    }))

    const { error: recipeError } = await supabase
      .from("recipe_items")
      .insert(recipeInserts)

    if (recipeError) {
      console.error("レシピの登録に失敗しました:", recipeError)
    }
  }

  // キャッシュを再検証
  revalidatePath("/admin/cocktails")
  revalidatePath("/")
  if (currentCocktail?.slug) {
    revalidatePath(`/cocktails/${currentCocktail.slug}`)
  }
  revalidatePath(`/cocktails/${data.slug}`)

  return { success: true }
}

/**
 * カクテルを削除
 * @param id カクテルID
 * @returns 成功/失敗
 */
export async function deleteCocktail(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = createServerClient()

  // カクテル情報を取得（画像削除のため）
  const { data: cocktail } = await supabase
    .from("cocktails")
    .select("slug, image_url")
    .eq("id", id)
    .single()

  // カクテルを削除（レシピはカスケード削除）
  const { error } = await supabase.from("cocktails").delete().eq("id", id)

  if (error) {
    console.error("カクテルの削除に失敗しました:", error)
    return { success: false, error: "カクテルの削除に失敗しました" }
  }

  // 画像も削除（オプション - エラーでも続行）
  if (cocktail?.image_url) {
    try {
      const fileName = cocktail.image_url.split("/").pop()
      if (fileName) {
        await supabase.storage.from(IMAGE_BUCKET).remove([fileName])
      }
    } catch (e) {
      console.error("画像の削除に失敗しました:", e)
    }
  }

  // キャッシュを再検証
  revalidatePath("/admin/cocktails")
  revalidatePath("/")
  if (cocktail?.slug) {
    revalidatePath(`/cocktails/${cocktail.slug}`)
  }

  return { success: true }
}

// ============================================
// 画像アップロード用Server Actions
// ============================================

/**
 * 画像をSupabase Storageにアップロード
 * @param formData アップロードするファイルを含むFormData
 * @returns アップロードされた画像のURL、またはエラー
 */
export async function uploadCocktailImage(
  formData: FormData
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  const supabase = createServerClient()

  const file = formData.get("file") as File
  if (!file) {
    return { success: false, error: "ファイルが選択されていません" }
  }

  // ファイル形式チェック
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "対応していない形式です（JPEG, PNG, WebPのみ）",
    }
  }

  // ファイルサイズチェック
  if (file.size > MAX_IMAGE_SIZE) {
    return { success: false, error: "ファイルサイズが大きすぎます（5MB以下）" }
  }

  // ユニークなファイル名を生成
  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

  // Storageにアップロード
  const { error: uploadError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (uploadError) {
    console.error("画像のアップロードに失敗しました:", uploadError)
    return { success: false, error: "画像のアップロードに失敗しました" }
  }

  // 公開URLを取得
  const { data: urlData } = supabase.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(fileName)

  return { success: true, url: urlData.publicUrl }
}

// ============================================
// 材料取得用Server Actions
// ============================================

/**
 * 全ての材料を取得（材料選択用）
 * @returns 材料一覧
 */
export async function getAllIngredients(): Promise<Ingredient[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("材料一覧の取得に失敗しました:", error)
    return []
  }

  return (data as Ingredient[]) || []
}
