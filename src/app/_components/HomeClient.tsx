"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import { DecorativeDivider } from "@/components/atoms/DecorativeDivider"
import { FilterBadges } from "@/components/molecules/FilterBadges"
import { SortSelect } from "@/components/molecules/SortSelect"
import { CocktailList } from "@/components/organisms/CocktailList"
import { RecentlyViewedSection } from "@/components/organisms/RecentlyViewedSection"
import { useFavorites } from "@/hooks"
import type { Cocktail, SearchFilters, SortOptionValue } from "@/types"
import { isEmptyFilters } from "@/types"

interface HomeClientProps {
  /** 初期表示のカクテル一覧 */
  initialCocktails: Cocktail[]
  /** 初期状態で次ページがあるか */
  initialHasMore: boolean
  /** 初期ソート */
  initialSort: SortOptionValue
  /** 初期検索フィルター */
  initialFilters: SearchFilters
}

/**
 * トップページのクライアントコンポーネント
 * ソート変更、お気に入り、無限スクロールを管理
 */
export function HomeClient({
  initialCocktails,
  initialHasMore,
  initialSort,
  initialFilters,
}: HomeClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // お気に入り管理
  const { favorites, toggleFavorite, isLoaded: isFavoritesLoaded } = useFavorites()

  // 検索条件が設定されているかを判定
  const hasFilters = !isEmptyFilters(initialFilters)

  /**
   * ソート変更時のハンドラー
   * URLパラメータを更新してページを再読み込み
   */
  const handleSortChange = useCallback(
    (newSort: SortOptionValue) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("sort", newSort)
      router.push(`/?${params.toString()}`)
    },
    [router, searchParams]
  )

  /**
   * 検索条件をクリア
   */
  const handleClearFilters = useCallback(() => {
    router.push("/")
  }, [router])

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
        <DecorativeDivider variant="centered" className="mt-8" />
      </section>

      {/* 最近見たカクテル */}
      {!hasFilters && (
        <RecentlyViewedSection
          favoriteIds={isFavoritesLoaded ? favorites : new Set()}
          onFavoriteToggle={toggleFavorite}
          className="mb-12"
        />
      )}

      {/* カクテル一覧セクション */}
      <section className="py-8">
        {/* ヘッダー：タイトルとソート */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {hasFilters ? "検索結果" : "カクテル一覧"}
            </h2>
            {/* 検索条件クリアボタン */}
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gold/70 hover:text-gold transition-colors"
              >
                条件をクリア
              </button>
            )}
          </div>
          <SortSelect value={initialSort} onChange={handleSortChange} />
        </div>

        {/* 検索条件バッジ（フィルターがある場合） */}
        {hasFilters && (
          <FilterBadges filters={initialFilters} className="mb-6" />
        )}

        {/* カクテルリスト */}
        <CocktailList
          initialCocktails={initialCocktails}
          initialHasMore={initialHasMore}
          sort={initialSort}
          filters={initialFilters}
          favoriteIds={isFavoritesLoaded ? favorites : new Set()}
          onFavoriteToggle={toggleFavorite}
        />
      </section>
    </div>
  )
}
