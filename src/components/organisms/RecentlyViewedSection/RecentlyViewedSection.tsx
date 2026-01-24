"use client"

import { useEffect, useState } from "react"

import { getCocktailsByIds } from "@/actions/cocktails"
import { CocktailCard } from "@/components/molecules/CocktailCard"
import { useRecentlyViewed } from "@/hooks"
import { cn } from "@/lib/utils"
import type { Cocktail } from "@/types"

interface RecentlyViewedSectionProps {
  /** お気に入りIDのセット */
  favoriteIds?: Set<string>
  /** お気に入りトグル時のコールバック */
  onFavoriteToggle?: (id: string) => void
  /** 追加のクラス名 */
  className?: string
}

/**
 * 最近見たカクテルセクション
 * localStorageの閲覧履歴からカクテルを表示
 */
export function RecentlyViewedSection({ favoriteIds = new Set(), onFavoriteToggle, className }: RecentlyViewedSectionProps) {
  // 閲覧履歴フック
  const { recentlyViewed, isLoaded: isHistoryLoaded } = useRecentlyViewed()

  // カクテルデータ
  const [cocktails, setCocktails] = useState<Cocktail[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 閲覧履歴からカクテルデータを取得
  useEffect(() => {
    if (!isHistoryLoaded) return

    const fetchCocktails = async () => {
      if (recentlyViewed.length === 0) {
        setCocktails([])
        setIsLoading(false)
        return
      }

      try {
        const data = await getCocktailsByIds(recentlyViewed)
        setCocktails(data)
      } catch (error) {
        console.error("最近見たカクテルの取得に失敗しました:", error)
        setCocktails([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCocktails()
  }, [recentlyViewed, isHistoryLoaded])

  // 履歴がない場合は非表示
  if (!isHistoryLoaded || isLoading) {
    return null
  }

  if (cocktails.length === 0) {
    return null
  }

  return (
    <section className={cn("", className)}>
      {/* セクションヘッダー */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-lg font-medium text-foreground">最近見たカクテル</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent" />
      </div>

      {/* カクテル一覧（横スクロール） */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
        {cocktails.map((cocktail, index) => (
          <div
            key={cocktail.id}
            className="flex-shrink-0 w-36 sm:w-44"
          >
            <CocktailCard
              cocktail={cocktail}
              isFavorite={favoriteIds.has(cocktail.id)}
              onFavoriteToggle={onFavoriteToggle}
              animationDelay={index * 50}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
