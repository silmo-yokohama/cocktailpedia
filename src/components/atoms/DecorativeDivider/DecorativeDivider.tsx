import { DiamondIcon } from "@/components/atoms/icons"
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
        <DiamondIcon size={40} className="mx-4 opacity-50" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
      </div>
    )
  }

  // デフォルト：左揃えのダイヤモンド装飾付き
  return (
    <div className={cn("flex items-center", className)}>
      <DiamondIcon size={40} className="mx-4 opacity-50" />
      <div className="flex-1 h-px bg-gradient-to-r from-gold/40 to-transparent" />
    </div>
  )
}
