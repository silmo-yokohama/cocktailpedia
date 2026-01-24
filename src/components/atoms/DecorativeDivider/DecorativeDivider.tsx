import { cn } from "@/lib/utils"

interface DecorativeDividerProps {
  /** 追加のクラス名 */
  className?: string
  /** バリエーション */
  variant?: "default" | "centered" | "simple"
}

/**
 * 装飾的な区切り線 Atom
 * Art Deco風のダイヤモンド装飾を含む区切り線
 */
export function DecorativeDivider({
  className,
  variant = "default",
}: DecorativeDividerProps) {
  // シンプルなグラデーションライン
  if (variant === "simple") {
    return (
      <div
        className={cn(
          "flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent",
          className
        )}
      />
    )
  }

  // 中央揃えのダイヤモンド装飾付き
  if (variant === "centered") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
        <DiamondDecoration />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
      </div>
    )
  }

  // デフォルト：左揃えのダイヤモンド装飾付き
  return (
    <div className={cn("flex items-center", className)}>
      <DiamondDecoration />
      <div className="flex-1 h-px bg-gradient-to-r from-gold/40 to-transparent" />
    </div>
  )
}

/**
 * ダイヤモンド装飾 SVG
 */
function DiamondDecoration() {
  return (
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
  )
}
