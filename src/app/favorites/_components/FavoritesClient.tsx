"use client"

import { Search, Heart } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

import { DecorativeDivider } from "@/components/atoms/DecorativeDivider"
import { CocktailCard } from "@/components/molecules/CocktailCard"
import { EmptyState, EmptyGlassIcon } from "@/components/molecules/EmptyState"
import { SortSelect } from "@/components/molecules/SortSelect"
import { Input } from "@/components/ui/input"
import { useFavorites } from "@/hooks"
import { createBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import type { Cocktail, SortOptionValue } from "@/types"

/**
 * お気に入り一覧ページのクライアントコンポーネント
 * localStorageからお気に入りIDを取得し、Supabaseからデータを取得して表示
 */
export function FavoritesClient() {
  // お気に入り管理
  const { favorites, toggleFavorite, isLoaded, getFavoriteIds } = useFavorites()

  // カクテルデータ
  const [cocktails, setCocktails] = useState<Cocktail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 検索・ソート
  const [searchKeyword, setSearchKeyword] = useState("")
  const [sort, setSort] = useState<SortOptionValue>("name_asc")

  /**
   * お気に入りのカクテルデータを取得
   */
  useEffect(() => {
    // お気に入り読み込み完了まで待機
    if (!isLoaded) return

    const fetchFavorites = async () => {
      const ids = getFavoriteIds()

      // お気に入りが0件の場合
      if (ids.length === 0) {
        setCocktails([])
        setIsLoading(false)
        return
      }

      try {
        const supabase = createBrowserClient()
        const { data, error } = await supabase
          .from("cocktails")
          .select("*")
          .in("id", ids)

        if (error) throw error

        setCocktails(data || [])
      } catch (err) {
        console.error("お気に入りの取得に失敗しました:", err)
        setError("お気に入りの取得に失敗しました")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [isLoaded, getFavoriteIds])

  /**
   * 検索・ソートを適用したカクテル一覧
   */
  const filteredCocktails = useMemo(() => {
    let result = [...cocktails]

    // 現在のお気に入りでフィルタリング（解除されたものを除外）
    result = result.filter((c) => favorites.has(c.id))

    // キーワード検索
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(keyword) ||
          c.name_en?.toLowerCase().includes(keyword) ||
          c.name_alias?.toLowerCase().includes(keyword)
      )
    }

    // ソート
    switch (sort) {
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "ja"))
        break
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name, "ja"))
        break
      case "view_count_desc":
        result.sort((a, b) => b.view_count - a.view_count)
        break
      case "bookmark_count_desc":
        result.sort((a, b) => b.bookmark_count - a.bookmark_count)
        break
    }

    return result
  }, [cocktails, favorites, searchKeyword, sort])

  /**
   * 検索キーワード変更ハンドラー
   */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKeyword(e.target.value)
    },
    []
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダーセクション */}
      <section className="text-center py-12 md:py-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-8 h-8 text-gold fill-gold/30" />
          <h1
            className="text-3xl md:text-4xl font-bold text-gradient-gold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            お気に入り
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          あなたがお気に入りに登録したカクテル
        </p>

        {/* Art Deco風の装飾 */}
        <DecorativeDivider variant="centered" className="mt-8" />
      </section>

      {/* ローディング状態 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      )}

      {/* エラー状態 */}
      {error && (
        <div className="text-center py-20">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-gold hover:text-gold-light transition-colors"
          >
            再読み込み
          </button>
        </div>
      )}

      {/* お気に入りが0件の場合（空状態） */}
      {!isLoading && !error && favorites.size === 0 && (
        <EmptyState
          title="お気に入りがまだありません"
          description="気になるカクテルを見つけたら、ハートボタンを押してお気に入りに追加しましょう。"
          actionLabel="カクテルを探す"
          actionHref="/"
          icon={<EmptyGlassIcon />}
        />
      )}

      {/* お気に入りがある場合 */}
      {!isLoading && !error && favorites.size > 0 && (
        <section className="py-8">
          {/* 検索・ソート */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            {/* 検索ボックス */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="お気に入りから検索..."
                value={searchKeyword}
                onChange={handleSearchChange}
                className={cn(
                  "pl-10 h-10",
                  "bg-card/50 border-border/50",
                  "hover:bg-card hover:border-gold/30",
                  "focus:ring-1 focus:ring-gold/50 focus:border-gold/30",
                  "transition-all duration-200"
                )}
              />
            </div>

            {/* ソート */}
            <SortSelect value={sort} onChange={setSort} />
          </div>

          {/* 件数表示 */}
          <p className="text-sm text-muted-foreground mb-6">
            {filteredCocktails.length}件のカクテル
          </p>

          {/* 検索結果が0件の場合 */}
          {filteredCocktails.length === 0 && searchKeyword.trim() && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                「{searchKeyword}」に一致するカクテルがありません
              </p>
            </div>
          )}

          {/* カクテルカード一覧 */}
          {filteredCocktails.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredCocktails.map((cocktail, index) => (
                <CocktailCard
                  key={cocktail.id}
                  cocktail={cocktail}
                  isFavorite={favorites.has(cocktail.id)}
                  onFavoriteToggle={toggleFavorite}
                  animationDelay={index * 50}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
