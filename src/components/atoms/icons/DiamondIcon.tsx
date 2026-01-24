import { cn } from "@/lib/utils"

interface DiamondIconProps {
  /** サイズ（幅・高さ） */
  size?: number
  /** 追加のクラス名 */
  className?: string
  /** 塗りつぶしスタイル */
  variant?: "outline" | "filled" | "center-dot"
}

/**
 * ダイヤモンドアイコン Atom
 * Art Deco風のダイヤモンド装飾
 */
export function DiamondIcon({
  size = 40,
  className,
  variant = "center-dot",
}: DiamondIconProps) {
  const height = size / 2

  return (
    <svg
      width={size}
      height={height}
      viewBox={`0 0 ${size} ${height}`}
      fill="none"
      className={cn("text-gold", className)}
    >
      {/* ダイヤモンド形状 */}
      <path
        d={`M${size / 2} 0L${size * 0.675} ${height / 2}L${size / 2} ${height}L${size * 0.325} ${height / 2}L${size / 2} 0Z`}
        fill={variant === "filled" ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      {/* 中央のドット（center-dotバリアントの場合） */}
      {variant === "center-dot" && (
        <circle
          cx={size / 2}
          cy={height / 2}
          r={size * 0.075}
          fill="currentColor"
          opacity="0.3"
        />
      )}
    </svg>
  )
}
