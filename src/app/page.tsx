"use client"

import { useState } from "react"

import { CocktailCard } from "@/components/molecules/CocktailCard"
import { SortSelect } from "@/components/molecules/SortSelect"
import type { Cocktail, SortOptionValue } from "@/types"

/**
 * ダミーのカクテルデータ
 * 動作確認用のモックデータ
 */
const DUMMY_COCKTAILS: Cocktail[] = [
  {
    id: "1",
    name: "ジントニック",
    name_en: "Gin and Tonic",
    name_alias: null,
    slug: "gin-tonic",
    description: "ジンをトニックウォーターで割ったシンプルなカクテル。",
    cocktail_word: "いつも溢れる愛を伝えたい",
    base: "gin",
    technique: "build",
    glass: "highball",
    alcohol_percentage: 10,
    temperature: "ice",
    carbonation: "strong",
    color: "clear",
    variation_text: null,
    image_url: null,
    view_count: 1500,
    bookmark_count: 320,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "マティーニ",
    name_en: "Martini",
    name_alias: "カクテルの王様",
    slug: "martini",
    description: "ジンとドライベルモットで作る、カクテルの王様と呼ばれる一杯。",
    cocktail_word: "とげのある美しさ",
    base: "gin",
    technique: "stir",
    glass: "cocktail",
    alcohol_percentage: 35,
    temperature: "ice",
    carbonation: "none",
    color: "clear",
    variation_text: "ギブソン, ダーティマティーニ",
    image_url: null,
    view_count: 2300,
    bookmark_count: 580,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "モスコミュール",
    name_en: "Moscow Mule",
    name_alias: null,
    slug: "moscow-mule",
    description: "ウォッカをジンジャービアで割った爽やかなカクテル。",
    cocktail_word: "その気にさせる",
    base: "vodka",
    technique: "build",
    glass: "copper_mug",
    alcohol_percentage: 12,
    temperature: "ice",
    carbonation: "strong",
    color: "clear",
    variation_text: null,
    image_url: null,
    view_count: 890,
    bookmark_count: 210,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "モヒート",
    name_en: "Mojito",
    name_alias: null,
    slug: "mojito",
    description: "ラムにミントとライムを合わせた爽快なキューバ生まれのカクテル。",
    cocktail_word: "心の憂さを晴らしたい",
    base: "rum",
    technique: "build",
    glass: "highball",
    alcohol_percentage: 10,
    temperature: "crushed_ice",
    carbonation: "weak",
    color: "green",
    variation_text: null,
    image_url: null,
    view_count: 1200,
    bookmark_count: 450,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "マルガリータ",
    name_en: "Margarita",
    name_alias: null,
    slug: "margarita",
    description: "テキーラベースの代表的なカクテル。塩を縁に付けたスノースタイルが特徴。",
    cocktail_word: "無言の愛",
    base: "tequila",
    technique: "shake",
    glass: "cocktail",
    alcohol_percentage: 25,
    temperature: "ice",
    carbonation: "none",
    color: "clear",
    variation_text: "フローズンマルガリータ",
    image_url: null,
    view_count: 980,
    bookmark_count: 290,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "6",
    name: "オールドファッションド",
    name_en: "Old Fashioned",
    name_alias: null,
    slug: "old-fashioned",
    description: "ウイスキーをベースにした最古のカクテルのひとつ。",
    cocktail_word: "穏やかな気分で乾杯",
    base: "whiskey",
    technique: "build",
    glass: "rocks",
    alcohol_percentage: 30,
    temperature: "ice",
    carbonation: "none",
    color: "amber",
    variation_text: null,
    image_url: null,
    view_count: 750,
    bookmark_count: 180,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
]

/**
 * トップページ
 * 共通基盤（タスク2）の動作確認用ページ
 */
export default function Home() {
  // お気に入り状態の管理（ダミー）
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["2", "4"]))

  // ソート状態の管理
  const [sortValue, setSortValue] = useState<SortOptionValue>("name_asc")

  /**
   * お気に入りのトグル
   */
  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <section className="text-center py-12 md:py-16">
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient-gold"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Cocktailpedia
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          多彩な条件でお気に入りのカクテルを探せる、カクテル検索サービス
        </p>

        {/* Art Deco風の装飾 */}
        <div className="flex items-center justify-center mt-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <svg
            width="40"
            height="20"
            viewBox="0 0 40 20"
            fill="none"
            className="mx-4"
          >
            <path
              d="M20 0L27 10L20 20L13 10L20 0Z"
              fill="none"
              stroke="oklch(0.75 0.14 75)"
              strokeWidth="1"
              opacity="0.5"
            />
            <circle cx="20" cy="10" r="3" fill="oklch(0.75 0.14 75)" opacity="0.3" />
          </svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
      </section>

      {/* コンポーネントデモセクション */}
      <section className="py-8">
        {/* ソートセレクト */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">カクテル一覧</h2>
          <SortSelect value={sortValue} onChange={setSortValue} />
        </div>

        {/* カクテルカードグリッド */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {DUMMY_COCKTAILS.map((cocktail, index) => (
            <CocktailCard
              key={cocktail.id}
              cocktail={cocktail}
              isFavorite={favorites.has(cocktail.id)}
              onFavoriteToggle={handleFavoriteToggle}
              animationDelay={index * 100}
            />
          ))}
        </div>
      </section>

      {/* 確認メッセージ */}
      <section className="py-12 text-center">
        <div className="inline-block px-6 py-4 rounded-lg bg-card border border-border/30">
          <p className="text-sm text-muted-foreground">
            ✅ タスク2: 共通基盤の実装が完了しました
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Header, Footer, CocktailCard, SortSelect, FavoriteButton が動作しています
          </p>
        </div>
      </section>
    </div>
  )
}
