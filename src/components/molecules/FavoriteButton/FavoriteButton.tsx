"use client"

import { Heart } from "lucide-react"
import { useCallback, useState } from "react"

import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  /** お気に入り登録済みかどうか */
  isFavorite: boolean
  /** クリック時のコールバック */
  onToggle: () => void
  /** ボタンのサイズ */
  size?: "sm" | "md" | "lg"
  /** 追加のクラス名 */
  className?: string
  /** アクセシビリティ用のラベル */
  ariaLabel?: string
}

/**
 * お気に入りボタンコンポーネント
 * ハートアイコンでお気に入りの登録/解除を行う
 */
export function FavoriteButton({
  isFavorite,
  onToggle,
  size = "md",
  className,
  ariaLabel,
}: FavoriteButtonProps) {
  // アニメーション用の状態
  const [isAnimating, setIsAnimating] = useState(false)

  // サイズに応じたスタイル
  const sizeStyles = {
    sm: {
      button: "w-8 h-8",
      icon: "w-4 h-4",
    },
    md: {
      button: "w-10 h-10",
      icon: "w-5 h-5",
    },
    lg: {
      button: "w-12 h-12",
      icon: "w-6 h-6",
    },
  }

  const styles = sizeStyles[size]

  /**
   * クリックハンドラー
   * アニメーションをトリガーしてからコールバックを実行
   */
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // イベントの伝播を止める（カード全体のクリックと干渉しないように）
      e.preventDefault()
      e.stopPropagation()

      // アニメーションを開始
      setIsAnimating(true)

      // コールバックを実行
      onToggle()

      // アニメーションを終了
      setTimeout(() => setIsAnimating(false), 600)
    },
    [onToggle]
  )

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        // ベーススタイル
        "relative flex items-center justify-center rounded-full",
        "transition-all duration-300 ease-out",
        // 背景とボーダー
        "bg-background/80 backdrop-blur-sm",
        "border border-border/50 hover:border-gold/30",
        // フォーカススタイル
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        // ホバーエフェクト
        "hover:bg-background hover:scale-105",
        // アクティブエフェクト
        "active:scale-95",
        // サイズ
        styles.button,
        // パルスアニメーション
        isAnimating && isFavorite && "favorite-pulse",
        className
      )}
      aria-label={ariaLabel || (isFavorite ? "お気に入りから削除" : "お気に入りに追加")}
      aria-pressed={isFavorite}
    >
      {/* ハートアイコン */}
      <Heart
        className={cn(
          styles.icon,
          "transition-all duration-300",
          isFavorite
            ? // お気に入り登録済み: 塗りつぶし
              "fill-gold text-gold drop-shadow-[0_0_8px_oklch(0.75_0.14_75/0.5)]"
            : // 未登録: アウトライン
              "fill-transparent text-muted-foreground hover:text-gold/70"
        )}
      />

      {/* ホバー時のグロー効果 */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-opacity duration-300",
          "bg-gold/5 opacity-0 hover:opacity-100"
        )}
      />

      {/* クリック時のリップルエフェクト */}
      {isAnimating && (
        <span
          className={cn(
            "absolute inset-0 rounded-full",
            "animate-ping bg-gold/20"
          )}
          style={{ animationDuration: "0.6s" }}
        />
      )}
    </button>
  )
}
