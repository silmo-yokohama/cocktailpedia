"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

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
      {/* ヒーローセクション - Art Deco Dynamic */}
      <section className="relative overflow-hidden py-16 md:py-24 -mx-4 px-4">
        {/* 背景のArt Deco放射状パターン */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px]">
            {/* 放射状の光線 */}
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 w-full h-full animate-[spin_120s_linear_infinite]"
              style={{ opacity: 0.15 }}
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="200"
                  y1="200"
                  x2="200"
                  y2="0"
                  stroke="oklch(0.75 0.14 75)"
                  strokeWidth="1"
                  transform={`rotate(${i * 15} 200 200)`}
                />
              ))}
            </svg>

            {/* 同心円の装飾 */}
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 w-full h-full"
              style={{ opacity: 0.1 }}
            >
              <circle cx="200" cy="200" r="180" fill="none" stroke="oklch(0.75 0.14 75)" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="140" fill="none" stroke="oklch(0.75 0.14 75)" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="100" fill="none" stroke="oklch(0.75 0.14 75)" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        {/* 浮遊するバーツールのシルエット */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 左上 - カクテルグラス（マティーニ） */}
          <svg
            viewBox="0 0 48 56"
            className="absolute w-10 h-12 md:w-14 md:h-16 left-[10%] top-[15%] animate-[float_6s_ease-in-out_infinite]"
            style={{ opacity: 0.2, animationDelay: "0s", transform: "rotate(-16deg)" }}
          >
            <path d="M8 8L24 28L40 8H8Z" fill="oklch(0.75 0.14 75)" />
            <path d="M22 28H26V44H22V28Z" fill="oklch(0.75 0.14 75)" />
            <path d="M12 44H36V48H12V44Z" fill="oklch(0.75 0.14 75)" />
          </svg>

          {/* 右上 - ボトル */}
          <svg
            viewBox="0 0 32 56"
            className="absolute w-8 h-12 md:w-10 md:h-14 right-[15%] top-[18%] animate-[float_7s_ease-in-out_infinite]"
            style={{ opacity: 0.15, animationDelay: "-2s", transform: "rotate(12deg)" }}
          >
            <rect x="12" y="2" width="8" height="6" rx="1" fill="oklch(0.75 0.14 75)" />
            <path d="M13 8H19V16H13V8Z" fill="oklch(0.75 0.14 75)" />
            <path d="M10 16H22V52H10V16Z" rx="2" fill="oklch(0.75 0.14 75)" />
            <rect x="12" y="22" width="8" height="16" fill="oklch(0.65 0.12 75)" opacity="0.3" />
          </svg>

          {/* 左下 - レモンスライス断面 */}
          <svg
            viewBox="0 0 48 48"
            className="absolute w-10 h-10 md:w-14 md:h-14 left-[6%] bottom-[20%] animate-[float_8s_ease-in-out_infinite]"
            style={{ opacity: 0.22, animationDelay: "-4s", transform: "rotate(-20deg)" }}
          >
            {/* 外皮（濃いゴールド） */}
            <circle cx="24" cy="24" r="20" fill="oklch(0.75 0.14 75)" />
            {/* 果肉の背景（くり抜き） */}
            <circle cx="24" cy="24" r="16" fill="oklch(0.15 0.02 75)" />
            {/* 扇形のセグメント（8房） */}
            <path d="M24 24L24 9A15 15 0 0 1 34.6 13.4Z" fill="oklch(0.65 0.12 75)" />
            <path d="M24 24L34.6 13.4A15 15 0 0 1 39 24Z" fill="oklch(0.70 0.13 75)" />
            <path d="M24 24L39 24A15 15 0 0 1 34.6 34.6Z" fill="oklch(0.65 0.12 75)" />
            <path d="M24 24L34.6 34.6A15 15 0 0 1 24 39Z" fill="oklch(0.70 0.13 75)" />
            <path d="M24 24L24 39A15 15 0 0 1 13.4 34.6Z" fill="oklch(0.65 0.12 75)" />
            <path d="M24 24L13.4 34.6A15 15 0 0 1 9 24Z" fill="oklch(0.70 0.13 75)" />
            <path d="M24 24L9 24A15 15 0 0 1 13.4 13.4Z" fill="oklch(0.65 0.12 75)" />
            <path d="M24 24L13.4 13.4A15 15 0 0 1 24 9Z" fill="oklch(0.70 0.13 75)" />
            {/* 中心 */}
            <circle cx="24" cy="24" r="4" fill="oklch(0.75 0.14 75)" />
          </svg>

          {/* 右下 - ロックグラス氷入り */}
          <svg
            viewBox="0 0 40 44"
            className="absolute w-10 h-11 md:w-12 md:h-13 right-[8%] bottom-[24%] animate-[float_5s_ease-in-out_infinite]"
            style={{ opacity: 0.22, animationDelay: "-1s", transform: "rotate(-10deg)" }}
          >
            {/* グラス本体（薄め） */}
            <path d="M4 4H36L32 40H8L4 4Z" fill="oklch(0.55 0.10 75)" />
            {/* 氷キューブ（明るいゴールド） */}
            <rect x="9" y="10" width="10" height="10" rx="2" fill="oklch(0.80 0.14 75)" />
            <rect x="21" y="8" width="9" height="9" rx="2" fill="oklch(0.75 0.12 75)" />
            <rect x="12" y="22" width="11" height="10" rx="2" fill="oklch(0.70 0.11 75)" />
            {/* グラスの縁（ハイライト） */}
            <path d="M4 4H36" stroke="oklch(0.80 0.14 75)" strokeWidth="2" />
          </svg>
        </div>

        {/* メインコンテンツ */}
        <div className="relative z-10 text-center">
          {/* Art Deco上部装飾 */}
          <div className="flex items-center justify-center mb-6 animate-[fadeIn_0.8s_ease-out]">
            <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold/60" />
            <svg width="60" height="30" viewBox="0 0 60 30" className="mx-3">
              <path
                d="M30 0L38 15L30 30L22 15L30 0Z"
                fill="none"
                stroke="oklch(0.75 0.14 75)"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <path
                d="M30 8L34 15L30 22L26 15L30 8Z"
                fill="oklch(0.75 0.14 75)"
                opacity="0.4"
              />
              <line x1="10" y1="15" x2="22" y2="15" stroke="oklch(0.75 0.14 75)" strokeWidth="1" opacity="0.5" />
              <line x1="38" y1="15" x2="50" y2="15" stroke="oklch(0.75 0.14 75)" strokeWidth="1" opacity="0.5" />
            </svg>
            <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          {/* タイトル */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-gradient-gold animate-[fadeInUp_0.6s_ease-out]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Cocktailpedia
          </h1>

          {/* サブタイトル */}
          <p
            className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-8 animate-[fadeInUp_0.6s_ease-out_0.2s_both]"
          >
            多彩な条件でお気に入りのカクテルを探せる、カクテル検索サービス
          </p>

          {/* 検索への誘導 */}
          <div className="animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
            <p className="text-gold/60 text-xs mb-3 tracking-wider uppercase">
              Find Your Perfect Cocktail
            </p>
            <div className="flex items-center justify-center gap-2 text-gold/40">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="animate-[bounce_2s_ease-in-out_infinite]"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Art Deco下部装飾 */}
          <div className="flex items-center justify-center mt-8 animate-[fadeIn_0.8s_ease-out_0.6s_both]">
            <svg width="200" height="20" viewBox="0 0 200 20" className="opacity-40">
              <line x1="0" y1="10" x2="70" y2="10" stroke="oklch(0.75 0.14 75)" strokeWidth="1" />
              <polygon points="80,10 85,5 90,10 85,15" fill="oklch(0.75 0.14 75)" />
              <circle cx="100" cy="10" r="4" fill="none" stroke="oklch(0.75 0.14 75)" strokeWidth="1" />
              <polygon points="110,10 115,5 120,10 115,15" fill="oklch(0.75 0.14 75)" />
              <line x1="130" y1="10" x2="200" y2="10" stroke="oklch(0.75 0.14 75)" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* CSSアニメーション定義 */}
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-15px) rotate(3deg);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
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
