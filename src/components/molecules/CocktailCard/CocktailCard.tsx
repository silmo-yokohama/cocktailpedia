"use client"

import { Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { FavoriteButton } from "@/components/molecules/FavoriteButton"
import { cn } from "@/lib/utils"
import type { Cocktail } from "@/types"
import { getLabel, BASE_OPTIONS, ALCOHOL_STRENGTH_OPTIONS } from "@/types"

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
 * 度数から強度ラベルを取得
 */
function getAlcoholStrength(percentage: number): { label: string; level: number } {
  for (const option of ALCOHOL_STRENGTH_OPTIONS) {
    if (percentage >= option.min && percentage <= option.max) {
      // level: none=0, low=1, medium=2, high=3
      const level = option.value === "none" ? 0 : option.value === "low" ? 1 : option.value === "medium" ? 2 : 3
      return { label: option.label, level }
    }
  }
  return { label: "中", level: 2 }
}

/**
 * 閲覧回数をフォーマット（1000以上は1.2kなど）
 */
function formatViewCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 1000).toFixed(0)}k`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

/**
 * 度数インジケーター（炎アイコン）
 */
function AlcoholIndicator({ level }: { level: number }) {
  // level 0: ノンアルコール表示
  if (level === 0) {
    return (
      <div className="flex items-center gap-0.5" title="ノンアルコール">
        <svg
          viewBox="0 0 16 16"
          className="w-3.5 h-3.5 text-blue-400"
          fill="currentColor"
        >
          <path d="M8 1a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 5.293V1.5A.5.5 0 0 1 8 1zM4 8a4 4 0 1 1 8 0c0 2.5-2 4.5-4 6.5C6 12.5 4 10.5 4 8z" />
        </svg>
      </div>
    )
  }

  // level 1-3: 炎アイコン
  return (
    <div className="flex items-center gap-0" title={`度数: ${{1: "弱", 2: "中", 3: "高"}[level]}`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          className={cn(
            "w-3 h-3 transition-colors",
            i < level ? "text-amber-500" : "text-foreground/20"
          )}
          fill="currentColor"
        >
          <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15z" />
        </svg>
      ))}
    </div>
  )
}

/**
 * カクテルカードコンポーネント
 * カクテル一覧で使用するカード形式の表示
 * Art Deco風のエレガントなデザイン
 */
export function CocktailCard({
  cocktail,
  isFavorite = false,
  onFavoriteToggle,
  className,
  animationDelay = 0,
}: CocktailCardProps) {
  const { id, name, name_en, slug, base, image_url, view_count, alcohol_percentage } = cocktail

  // ベースのラベルを取得
  const baseLabel = getLabel(BASE_OPTIONS, base)
  // 度数の強度を取得
  const alcoholStrength = getAlcoholStrength(alcohol_percentage)

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
              "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
              "opacity-70 group-hover:opacity-50 transition-opacity duration-300"
            )}
          />

          {/* 度数インジケーター（左上） */}
          <div className="absolute top-2 left-2 px-1.5 py-1 rounded bg-black/50 backdrop-blur-sm">
            <AlcoholIndicator level={alcoholStrength.level} />
          </div>

          {/* ベースバッジ（左下） */}
          <div className="absolute bottom-2 left-2">
            <span className="badge-base">{baseLabel}</span>
          </div>

          {/* 閲覧回数（右下） */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-sm text-white/80 text-xs">
            <Eye className="w-3 h-3" />
            <span>{formatViewCount(view_count)}</span>
          </div>

          {/* Art Deco風の装飾コーナー（ホバー時） */}
          <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path
                d="M0 0L32 0L32 4L4 4L4 32L0 32L0 0Z"
                fill="oklch(0.75 0.14 75)"
                opacity="0.6"
              />
              <path
                d="M0 0L16 0L16 2L2 2L2 16L0 16L0 0Z"
                fill="oklch(0.85 0.12 75)"
                opacity="0.4"
              />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 -scale-x-100">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path
                d="M0 0L32 0L32 4L4 4L4 32L0 32L0 0Z"
                fill="oklch(0.75 0.14 75)"
                opacity="0.6"
              />
              <path
                d="M0 0L16 0L16 2L2 2L2 16L0 16L0 0Z"
                fill="oklch(0.85 0.12 75)"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>

        {/* テキストエリア - 情報を整理して表示 */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 min-h-[4.5rem] sm:min-h-[5rem]">
          {/* カクテル名（日本語） */}
          <h3
            className={cn(
              "text-sm sm:text-base font-semibold leading-tight",
              "text-card-foreground",
              "line-clamp-1",
              "group-hover:text-gold transition-colors duration-200"
            )}
          >
            {name}
          </h3>

          {/* 英語名（あれば表示） */}
          {name_en && (
            <p
              className={cn(
                "text-xs text-foreground/50 mt-0.5",
                "line-clamp-1 italic",
                "tracking-wide"
              )}
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {name_en}
            </p>
          )}

          {/* スペーサー */}
          <div className="flex-1" />

          {/* Art Deco風の区切り線 */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/20">
            <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
            <svg width="12" height="6" viewBox="0 0 12 6" className="text-gold/40">
              <path d="M6 0L9 3L6 6L3 3L6 0Z" fill="currentColor" />
            </svg>
            <div className="flex-1 h-px bg-gradient-to-l from-gold/30 to-transparent" />
          </div>
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
