import { cn } from "@/lib/utils"

interface StarIconProps {
  /** サイズ（幅・高さ） */
  size?: number
  /** 追加のクラス名 */
  className?: string
  /** ポイント数 */
  points?: 4 | 8
}

/**
 * 星アイコン Atom
 * Art Deco風の星形装飾
 */
export function StarIcon({
  size = 24,
  className,
  points = 8,
}: StarIconProps) {
  // 8ポイント星のパス
  const path8 =
    "M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"

  // 4ポイント星のパス
  const path4 =
    "M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"

  return (
    <svg
      width={size}
      height={size}
      viewBox={points === 8 ? "0 0 24 24" : "0 0 12 12"}
      fill="none"
      className={cn("text-gold", className)}
    >
      <path d={points === 8 ? path8 : path4} fill="currentColor" />
    </svg>
  )
}
