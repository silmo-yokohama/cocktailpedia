"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import { CocktailList } from "@/components/organisms/CocktailList"
import { SortSelect } from "@/components/molecules/SortSelect"
import { useSearchModal } from "@/contexts/SearchModalContext"
import { useFavorites } from "@/hooks"
import type { BaseValue, Cocktail, SortOptionValue } from "@/types"

interface BaseFilterClientProps {
  /** ベースの値 */
  base: BaseValue
  /** ベースの表示名 */
  baseLabel: string
  /** 初期表示のカクテル一覧 */
  initialCocktails: Cocktail[]
  /** 初期状態で次ページがあるか */
  initialHasMore: boolean
  /** 初期ソート */
  initialSort: SortOptionValue
}

/**
 * ベース別一覧のクライアントコンポーネント
 */
export function BaseFilterClient({
  base,
  baseLabel,
  initialCocktails,
  initialHasMore,
  initialSort,
}: BaseFilterClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { open: openSearchModal } = useSearchModal()

  // お気に入り管理
  const { favorites, toggleFavorite, isLoaded: isFavoritesLoaded } = useFavorites()

  /**
   * ソート変更時のハンドラー
   */
  const handleSortChange = useCallback(
    (newSort: SortOptionValue) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("sort", newSort)
      router.push(`/filter/${base}?${params.toString()}`)
    },
    [router, searchParams, base]
  )

  /**
   * 検索モーダルを開く（現在のベースを選択状態で）
   */
  const handleSearchClick = useCallback(() => {
    openSearchModal(base)
  }, [openSearchModal, base])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ナビゲーション */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-gold transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>トップに戻る</span>
      </Link>

      {/* ヘッダー */}
      <header className="mb-12 text-center">
        <h1
          className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          <span className="text-gradient-gold">{baseLabel}</span>
          <span className="text-foreground/80">ベースのカクテル</span>
        </h1>

        {/* 追加フィルターボタン */}
        <button
          onClick={handleSearchClick}
          className="mt-4 text-sm text-gold/70 hover:text-gold transition-colors underline underline-offset-4"
        >
          さらに条件を絞り込む
        </button>

        {/* 装飾 */}
        <div className="flex items-center justify-center mt-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="mx-4">
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
      </header>

      {/* カクテル一覧セクション */}
      <section>
        {/* ソートセレクト */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-foreground/60 text-sm">
            {initialCocktails.length > 0
              ? `${initialCocktails.length}件以上のカクテル`
              : "該当するカクテルはありません"}
          </p>
          <SortSelect value={initialSort} onChange={handleSortChange} />
        </div>

        {/* カクテルリスト */}
        <CocktailList
          initialCocktails={initialCocktails}
          initialHasMore={initialHasMore}
          sort={initialSort}
          filters={{ base }}
          favoriteIds={isFavoritesLoaded ? favorites : new Set()}
          onFavoriteToggle={toggleFavorite}
        />
      </section>
    </div>
  )
}
