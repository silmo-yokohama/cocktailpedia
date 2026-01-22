/**
 * 検索フィルター型
 * 検索モーダルで使用する検索条件とソートオプション
 */

import type {
  AlcoholStrengthValue,
  BaseValue,
  CarbonationValue,
  ColorValue,
  GlassValue,
  TechniqueValue,
  TemperatureValue,
} from "./constants"

/**
 * 検索フィルター
 * 検索条件を格納する型
 */
export interface SearchFilters {
  /** フリーワード検索（カクテル名、材料名で検索） */
  keyword?: string
  /** ベース（基酒）でフィルター */
  base?: BaseValue
  /** 材料IDでフィルター（いずれかを含む） */
  ingredientIds?: string[]
  /** 技法でフィルター */
  technique?: TechniqueValue
  /** 度数区分でフィルター */
  alcoholStrength?: AlcoholStrengthValue
  /** グラスの種類でフィルター */
  glass?: GlassValue
  /** 冷たさでフィルター */
  temperature?: TemperatureValue
  /** 炭酸でフィルター */
  carbonation?: CarbonationValue
  /** カラーでフィルター */
  color?: ColorValue
}

/**
 * ソートオプション
 * 一覧画面での並び替え方法
 */
export const SORT_OPTIONS = [
  { value: "name_asc", label: "名前順（A→Z）" },
  { value: "name_desc", label: "名前順（Z→A）" },
  { value: "view_count_desc", label: "閲覧数順" },
  { value: "bookmark_count_desc", label: "ブックマーク順" },
] as const

/** ソートオプションの値の型 */
export type SortOptionValue = (typeof SORT_OPTIONS)[number]["value"]

/**
 * ページネーション情報
 */
export interface PaginationInfo {
  /** 現在のページ番号（0始まり） */
  page: number
  /** 1ページあたりの件数 */
  limit: number
  /** 総件数 */
  total: number
  /** 次のページがあるか */
  hasMore: boolean
}

/**
 * 検索結果
 */
export interface SearchResult<T> {
  /** 検索結果のアイテム */
  items: T[]
  /** ページネーション情報 */
  pagination: PaginationInfo
}

/**
 * 検索フィルターが空かどうかを判定
 * @param filters 検索フィルター
 * @returns すべてのフィルターが未設定ならtrue
 */
export function isEmptyFilters(filters: SearchFilters): boolean {
  return (
    !filters.keyword &&
    !filters.base &&
    (!filters.ingredientIds || filters.ingredientIds.length === 0) &&
    !filters.technique &&
    !filters.alcoholStrength &&
    !filters.glass &&
    !filters.temperature &&
    !filters.carbonation &&
    !filters.color
  )
}

/**
 * 検索フィルターをURLクエリパラメータに変換
 * @param filters 検索フィルター
 * @returns URLSearchParams
 */
export function filtersToSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.keyword) params.set("q", filters.keyword)
  if (filters.base) params.set("base", filters.base)
  if (filters.ingredientIds && filters.ingredientIds.length > 0) {
    params.set("ingredients", filters.ingredientIds.join(","))
  }
  if (filters.technique) params.set("technique", filters.technique)
  if (filters.alcoholStrength) params.set("strength", filters.alcoholStrength)
  if (filters.glass) params.set("glass", filters.glass)
  if (filters.temperature) params.set("temp", filters.temperature)
  if (filters.carbonation) params.set("carbonation", filters.carbonation)
  if (filters.color) params.set("color", filters.color)

  return params
}

/**
 * URLクエリパラメータから検索フィルターを復元
 * @param params URLSearchParams
 * @returns 検索フィルター
 */
export function searchParamsToFilters(params: URLSearchParams): SearchFilters {
  const filters: SearchFilters = {}

  const keyword = params.get("q")
  if (keyword) filters.keyword = keyword

  const base = params.get("base")
  if (base) filters.base = base as BaseValue

  const ingredients = params.get("ingredients")
  if (ingredients) filters.ingredientIds = ingredients.split(",")

  const technique = params.get("technique")
  if (technique) filters.technique = technique as TechniqueValue

  const strength = params.get("strength")
  if (strength) filters.alcoholStrength = strength as AlcoholStrengthValue

  const glass = params.get("glass")
  if (glass) filters.glass = glass as GlassValue

  const temp = params.get("temp")
  if (temp) filters.temperature = temp as TemperatureValue

  const carbonation = params.get("carbonation")
  if (carbonation) filters.carbonation = carbonation as CarbonationValue

  const color = params.get("color")
  if (color) filters.color = color as ColorValue

  return filters
}
