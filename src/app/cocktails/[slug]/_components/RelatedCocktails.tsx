"use client"

import { CocktailCard } from "@/components/molecules/CocktailCard"
import { useFavorites } from "@/hooks"
import { cn } from "@/lib/utils"
import type { Cocktail } from "@/types"

interface RelatedCocktailsProps {
  /** 関連カクテル一覧 */
  cocktails: Cocktail[]
  /** 追加のクラス名 */
  className?: string
}

/**
 * 関連カクテルセクション
 * 同じベースや共通材料を持つカクテルを表示
 */
export function RelatedCocktails({ cocktails, className }: RelatedCocktailsProps) {
  const { favorites, toggleFavorite, isLoaded: isFavoritesLoaded } = useFavorites()

  if (cocktails.length === 0) {
    return null
  }

  return (
    <section className={cn("", className)}>
      {/* セクションヘッダー */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-xl font-medium text-foreground">関連カクテル</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
      </div>

      {/* カクテルグリッド */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {cocktails.map((cocktail, index) => (
          <CocktailCard
            key={cocktail.id}
            cocktail={cocktail}
            isFavorite={isFavoritesLoaded ? favorites.has(cocktail.id) : false}
            onFavoriteToggle={toggleFavorite}
            animationDelay={index * 50}
          />
        ))}
      </div>
    </section>
  )
}
