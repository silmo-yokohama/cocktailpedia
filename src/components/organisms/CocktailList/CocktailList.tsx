"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { getCocktails } from "@/actions/cocktails"
import { CocktailCard } from "@/components/molecules/CocktailCard"
import { cn } from "@/lib/utils"
import type { Cocktail, SearchFilters, SortOptionValue } from "@/types"

/** 1回の読み込み件数 */
const LIMIT = 60

interface CocktailListProps {
  /** 初期表示データ（SSR） */
  initialCocktails: Cocktail[]
  /** 初期状態で次のページがあるか */
  initialHasMore: boolean
  /** ソートオプション */
  sort?: SortOptionValue
  /** 検索フィルター */
  filters?: SearchFilters
  /** お気に入りIDのセット */
  favoriteIds?: Set<string>
  /** お気に入りトグル時のコールバック */
  onFavoriteToggle?: (id: string) => void
  /** 追加のクラス名 */
  className?: string
}

/**
 * カクテル一覧コンポーネント
 * 無限スクロール、ソート、お気に入り機能を提供
 */
export function CocktailList({
  initialCocktails,
  initialHasMore,
  sort = "name_asc",
  filters,
  favoriteIds = new Set(),
  onFavoriteToggle,
  className,
}: CocktailListProps) {
  // カクテル一覧の状態
  const [cocktails, setCocktails] = useState<Cocktail[]>(initialCocktails)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  // 無限スクロール用のセンチネル要素への参照
  const sentinelRef = useRef<HTMLDivElement>(null)

  // ソートやフィルターが変更された場合、リストをリセット
  useEffect(() => {
    setCocktails(initialCocktails)
    setHasMore(initialHasMore)
  }, [initialCocktails, initialHasMore])

  /**
   * 追加データを読み込む
   */
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const result = await getCocktails({
        offset: cocktails.length,
        limit: LIMIT,
        sort,
        filters,
      })

      setCocktails((prev) => [...prev, ...result.items])
      setHasMore(result.hasMore)
    } catch (error) {
      console.error("カクテルの追加読み込みに失敗しました:", error)
    } finally {
      setIsLoading(false)
    }
  }, [cocktails.length, hasMore, isLoading, sort, filters])

  // Intersection Observerで無限スクロールを実装
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        // センチネルが画面内に入ったら追加読み込み
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      {
        // 少し早めに読み込み開始（rootMargin）
        rootMargin: "200px",
        threshold: 0,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoading, loadMore])

  // データがない場合
  if (cocktails.length === 0 && !isLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
        <div className="text-gold/40 mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M8 21h8M12 17v4M6 3h12l-1 10a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4L6 3z" />
            <path d="M8 3v2M16 3v2" />
          </svg>
        </div>
        <p className="text-foreground/60">カクテルが見つかりませんでした</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* カクテルグリッド */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {cocktails.map((cocktail, index) => (
          <CocktailCard
            key={cocktail.id}
            cocktail={cocktail}
            isFavorite={favoriteIds.has(cocktail.id)}
            onFavoriteToggle={onFavoriteToggle}
            animationDelay={Math.min(index * 50, 500)}
          />
        ))}
      </div>

      {/* ローディングインジケーター */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 text-foreground/60">
            <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <span className="text-sm">読み込み中...</span>
          </div>
        </div>
      )}

      {/* 無限スクロール用のセンチネル */}
      <div ref={sentinelRef} className="h-4" aria-hidden="true" />

      {/* 全件読み込み完了時のメッセージ */}
      {!hasMore && cocktails.length > 0 && (
        <div className="flex items-center justify-center gap-4 py-8 text-foreground/40">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/20" />
          <span className="text-sm">全{cocktails.length}件を表示</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/20" />
        </div>
      )}
    </div>
  )
}
