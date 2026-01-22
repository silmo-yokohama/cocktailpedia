/**
 * 選択肢定義
 * 基本設計書 docs/05_design/basic_design.md の「1.5 選択肢定義」に準拠
 */

/** 選択肢の共通型 */
export interface Option {
  /** データベースに保存する値 */
  value: string
  /** 表示名（日本語） */
  label: string
}

/**
 * ベース（基酒）の選択肢
 */
export const BASE_OPTIONS = [
  { value: "gin", label: "ジン" },
  { value: "vodka", label: "ウォッカ" },
  { value: "rum", label: "ラム" },
  { value: "tequila", label: "テキーラ" },
  { value: "whiskey", label: "ウイスキー" },
  { value: "brandy", label: "ブランデー" },
  { value: "liqueur", label: "リキュール" },
  { value: "wine", label: "ワイン" },
  { value: "beer", label: "ビール" },
  { value: "non_alcoholic", label: "ノンアルコール" },
  { value: "other", label: "その他" },
] as const satisfies readonly Option[]

/** ベースの値の型 */
export type BaseValue = (typeof BASE_OPTIONS)[number]["value"]

/**
 * 技法の選択肢
 */
export const TECHNIQUE_OPTIONS = [
  { value: "shake", label: "シェイク" },
  { value: "stir", label: "ステア" },
  { value: "build", label: "ビルド" },
  { value: "blend", label: "ブレンド" },
] as const satisfies readonly Option[]

/** 技法の値の型 */
export type TechniqueValue = (typeof TECHNIQUE_OPTIONS)[number]["value"]

/**
 * グラスの種類の選択肢
 */
export const GLASS_OPTIONS = [
  { value: "cocktail", label: "カクテルグラス" },
  { value: "rocks", label: "ロックグラス" },
  { value: "highball", label: "ハイボールグラス" },
  { value: "collins", label: "コリンズグラス" },
  { value: "champagne_flute", label: "シャンパンフルート" },
  { value: "champagne_saucer", label: "シャンパンソーサー" },
  { value: "wine", label: "ワイングラス" },
  { value: "shot", label: "ショットグラス" },
  { value: "copper_mug", label: "銅マグ" },
  { value: "goblet", label: "ゴブレット" },
  { value: "other", label: "その他" },
] as const satisfies readonly Option[]

/** グラスの値の型 */
export type GlassValue = (typeof GLASS_OPTIONS)[number]["value"]

/**
 * 冷たさの選択肢
 */
export const TEMPERATURE_OPTIONS = [
  { value: "ice", label: "アイス" },
  { value: "hot", label: "ホット" },
  { value: "crushed_ice", label: "クラッシュアイス" },
  { value: "frozen", label: "フローズン" },
] as const satisfies readonly Option[]

/** 冷たさの値の型 */
export type TemperatureValue = (typeof TEMPERATURE_OPTIONS)[number]["value"]

/**
 * 炭酸の選択肢
 */
export const CARBONATION_OPTIONS = [
  { value: "strong", label: "強" },
  { value: "weak", label: "弱" },
  { value: "none", label: "無" },
] as const satisfies readonly Option[]

/** 炭酸の値の型 */
export type CarbonationValue = (typeof CARBONATION_OPTIONS)[number]["value"]

/**
 * カラーの選択肢
 */
export const COLOR_OPTIONS = [
  { value: "red", label: "赤" },
  { value: "orange", label: "オレンジ" },
  { value: "yellow", label: "黄" },
  { value: "green", label: "緑" },
  { value: "blue", label: "青" },
  { value: "purple", label: "紫" },
  { value: "pink", label: "ピンク" },
  { value: "brown", label: "茶" },
  { value: "amber", label: "琥珀" },
  { value: "white", label: "白" },
  { value: "clear", label: "透明" },
  { value: "layered", label: "レイヤー（多層）" },
] as const satisfies readonly Option[]

/** カラーの値の型 */
export type ColorValue = (typeof COLOR_OPTIONS)[number]["value"]

/**
 * 材料カテゴリの選択肢
 */
export const INGREDIENT_CATEGORY_OPTIONS = [
  { value: "spirits", label: "スピリッツ" },
  { value: "liqueur", label: "リキュール" },
  { value: "wine", label: "ワイン・シャンパン" },
  { value: "juice", label: "ジュース" },
  { value: "soda", label: "ソーダ・炭酸" },
  { value: "syrup", label: "シロップ" },
  { value: "dairy", label: "乳製品" },
  { value: "fruit", label: "フルーツ" },
  { value: "herb", label: "ハーブ・スパイス" },
  { value: "other", label: "その他" },
] as const satisfies readonly Option[]

/** 材料カテゴリの値の型 */
export type IngredientCategoryValue = (typeof INGREDIENT_CATEGORY_OPTIONS)[number]["value"]

/**
 * 度数区分（検索用）の選択肢
 * テーブルには保存せず、クエリ時に alcohol_percentage から計算する
 */
export const ALCOHOL_STRENGTH_OPTIONS = [
  { value: "none", label: "無", min: 0, max: 0 },
  { value: "low", label: "弱", min: 1, max: 10 },
  { value: "medium", label: "中", min: 11, max: 20 },
  { value: "high", label: "高", min: 21, max: 100 },
] as const

/** 度数区分の値の型 */
export type AlcoholStrengthValue = (typeof ALCOHOL_STRENGTH_OPTIONS)[number]["value"]

/**
 * 選択肢の値からラベルを取得するヘルパー関数
 * @param options 選択肢の配列
 * @param value 検索する値
 * @returns 対応するラベル、見つからない場合は値をそのまま返す
 */
export function getLabel<T extends readonly Option[]>(options: T, value: string): string {
  const option = options.find((opt) => opt.value === value)
  return option?.label ?? value
}

/**
 * ヘッダーナビゲーションに表示する主要ベース
 * 「その他」はnon_alcoholic, liqueur, wine, beer, other, brandyを含む
 */
export const MAIN_BASE_OPTIONS = [
  { value: "gin", label: "ジン" },
  { value: "vodka", label: "ウォッカ" },
  { value: "rum", label: "ラム" },
  { value: "tequila", label: "テキーラ" },
  { value: "whiskey", label: "ウイスキー" },
  { value: "other", label: "その他" },
] as const
