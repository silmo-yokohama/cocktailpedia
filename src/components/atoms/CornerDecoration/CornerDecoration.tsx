import { cn } from "@/lib/utils"

interface CornerDecorationProps {
  /** サイズ */
  size?: "sm" | "md" | "lg"
  /** 追加のクラス名 */
  className?: string
  /** グラデーションを使用するか */
  gradient?: boolean
}

/**
 * Art Deco風コーナー装飾 Atom
 * 画像やカードのコーナーに配置する装飾SVG
 */
export function CornerDecoration({
  size = "md",
  className,
  gradient = false,
}: CornerDecorationProps) {
  // サイズマッピング
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 40,
  }
  const dimensions = sizeMap[size]

  // グラデーション版（CocktailCard用）
  if (gradient) {
    return (
      <svg
        width={dimensions}
        height={dimensions}
        viewBox="0 0 24 24"
        fill="none"
        className={cn("text-gold", className)}
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
    )
  }

  // 通常版（CocktailDetailClient用）
  return (
    <svg
      width={dimensions}
      height={dimensions}
      viewBox="0 0 32 32"
      fill="none"
      className={cn("text-gold/30", className)}
    >
      <path d="M0 0L32 0L32 4L4 4L4 32L0 32L0 0Z" fill="currentColor" />
      <path
        d="M8 8L24 8L24 10L10 10L10 24L8 24L8 8Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  )
}
