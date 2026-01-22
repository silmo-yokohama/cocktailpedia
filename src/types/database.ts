/**
 * データベーステーブルの型定義
 * 基本設計書 docs/05_design/basic_design.md の「1.2 テーブル定義」に準拠
 */

/**
 * カクテル情報
 * cocktailsテーブルに対応
 */
export interface Cocktail {
  /** 主キー（UUID） */
  id: string
  /** カクテル名（日本語） */
  name: string
  /** 英語名 */
  name_en: string | null
  /** 別名 */
  name_alias: string | null
  /** URLスラッグ（ユニーク） */
  slug: string
  /** 説明・由来・歴史 */
  description: string | null
  /** カクテル言葉 */
  cocktail_word: string | null
  /** ベース（基酒） */
  base: string
  /** 技法 */
  technique: string
  /** グラスの種類 */
  glass: string
  /** 度数（推定、0-100） */
  alcohol_percentage: number
  /** 冷たさ */
  temperature: string
  /** 炭酸 */
  carbonation: string
  /** カラー */
  color: string | null
  /** バリエーション（派生カクテル名、カンマ区切り） */
  variation_text: string | null
  /** 画像URL（Supabase Storage） */
  image_url: string | null
  /** 閲覧回数 */
  view_count: number
  /** ブックマーク数 */
  bookmark_count: number
  /** 作成日時 */
  created_at: string
  /** 更新日時 */
  updated_at: string
}

/**
 * 材料情報
 * ingredientsテーブルに対応
 */
export interface Ingredient {
  /** 主キー（UUID） */
  id: string
  /** 材料名（日本語、ユニーク） */
  name: string
  /** 英語名 */
  name_en: string | null
  /** カテゴリ */
  category: string | null
  /** 検索条件に表示するか */
  is_searchable: boolean
  /** 作成日時 */
  created_at: string
  /** 更新日時 */
  updated_at: string
}

/**
 * レシピ項目
 * recipe_itemsテーブルに対応（カクテルと材料の中間テーブル）
 */
export interface RecipeItem {
  /** 主キー（UUID） */
  id: string
  /** カクテルID（外部キー） */
  cocktail_id: string
  /** 材料ID（外部キー） */
  ingredient_id: string
  /** 分量（「30ml」「適量」等） */
  amount: string | null
  /** 表示順 */
  sort_order: number
  /** 作成日時 */
  created_at: string
}

/**
 * サイト設定
 * site_settingsテーブルに対応
 */
export interface SiteSetting {
  /** 主キー（UUID） */
  id: string
  /** 設定キー（ユニーク） */
  key: string
  /** 設定値 */
  value: string | null
  /** 更新日時 */
  updated_at: string
}

/**
 * カクテルとレシピ（材料情報含む）の結合型
 * 詳細表示やカード表示で使用
 */
export interface CocktailWithRecipe extends Cocktail {
  /** レシピ項目（材料情報付き） */
  recipe_items: (RecipeItem & {
    ingredient: Ingredient
  })[]
}
