"use client"

import Image from "next/image"
import Link from "next/link"

import { FavoriteButton } from "@/components/molecules/FavoriteButton"
import { cn } from "@/lib/utils"
import type { Cocktail } from "@/types"
import { getLabel, BASE_OPTIONS } from "@/types"

interface CocktailCardProps {
  /** カクテル情報 */
  cocktail: Cocktail
  /** お気に入り登録済みかどうか */
  isFavorite?: boolean
  /** お気に入りトグル時のコールバック */
  onFavoriteToggle?: (id: string) => void
  /** 追加のクラス名 */
  className?: string
  /** アニメーションの遅延（stagger用） */
  animationDelay?: number
}

/** デフォルトのプレースホルダー画像 */
const PLACEHOLDER_IMAGE = "/images/cocktail-placeholder.svg"

/**
 * カクテルカードコンポーネント
 * カクテル一覧で使用するカード形式の表示
 */
export function CocktailCard({
  cocktail,
  isFavorite = false,
  onFavoriteToggle,
  className,
  animationDelay = 0,
}: CocktailCardProps) {
  const { id, name, slug, base, image_url } = cocktail

  // ベースのラベルを取得
  const baseLabel = getLabel(BASE_OPTIONS, base)

  /**
   * お気に入りボタンのクリックハンドラー
   */
  const handleFavoriteToggle = () => {
    onFavoriteToggle?.(id)
  }

  return (
    <article
      className={cn(
        // ベーススタイル
        "group relative flex flex-col overflow-hidden rounded-lg",
        // 背景とボーダー
        "bg-card border border-border/30",
        // ホバーエフェクト
        "card-hover",
        // アニメーション
        "opacity-0 fade-in-up",
        className
      )}
      style={{
        animationDelay: `${animationDelay}ms`,
        animationFillMode: "forwards",
      }}
    >
      {/* カード全体をリンクに */}
      <Link
        href={`/cocktails/${slug}`}
        className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-inset rounded-lg"
        aria-label={`${name}の詳細を見る`}
      >
        {/* 画像エリア */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* カクテル画像 */}
          <Image
            src={image_url || PLACEHOLDER_IMAGE}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover",
              "transition-transform duration-500 ease-out",
              "group-hover:scale-105"
            )}
          />

          {/* オーバーレイグラデーション（下部） */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none",
              "bg-gradient-to-t from-black/60 via-transparent to-transparent",
              "opacity-60 group-hover:opacity-40 transition-opacity duration-300"
            )}
          />

          {/* ベースバッジ */}
          <div className="absolute bottom-2 left-2">
            <span className="badge-base">{baseLabel}</span>
          </div>

          {/* Art Deco風の装飾コーナー */}
          <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full"
            >
              <path
                d="M0 0L24 0L24 4L4 4L4 24L0 24L0 0Z"
                fill="url(#corner-gradient)"
                opacity="0.5"
              />
              <defs>
                <linearGradient id="corner-gradient" x1="0" y1="0" x2="24" y2="24">
                  <stop stopColor="oklch(0.75 0.14 75)" />
                  <stop offset="1" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 -scale-x-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full"
            >
              <path
                d="M0 0L24 0L24 4L4 4L4 24L0 24L0 0Z"
                fill="url(#corner-gradient-r)"
                opacity="0.5"
              />
              <defs>
                <linearGradient id="corner-gradient-r" x1="0" y1="0" x2="24" y2="24">
                  <stop stopColor="oklch(0.75 0.14 75)" />
                  <stop offset="1" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* テキストエリア */}
        <div className="flex-1 p-3 sm:p-4">
          <h3
            className={cn(
              "text-sm sm:text-base font-medium leading-tight",
              "text-card-foreground",
              "line-clamp-2",
              "group-hover:text-gold transition-colors duration-200"
            )}
          >
            {name}
          </h3>
        </div>
      </Link>

      {/* お気に入りボタン（リンクの外に配置） */}
      {onFavoriteToggle && (
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={handleFavoriteToggle}
            size="sm"
            ariaLabel={isFavorite ? `${name}をお気に入りから削除` : `${name}をお気に入りに追加`}
          />
        </div>
      )}
    </article>
  )
}
