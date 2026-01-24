import { cn } from "@/lib/utils"

interface GlassIconProps {
  /** グラスの種類 */
  glass: string
  /** サイズ */
  size?: number
  /** 追加のクラス名 */
  className?: string
}

/**
 * グラスアイコン Atom
 * カクテルグラスの種類別SVGアイコン
 */
export function GlassIcon({ glass, size = 24, className }: GlassIconProps) {
  const icon = glassIconMap[glass]
  if (!icon) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={cn("text-current", className)}
    >
      {icon}
    </svg>
  )
}

/**
 * グラス種別とSVGパスのマッピング
 */
const glassIconMap: Record<string, React.ReactNode> = {
  // カクテルグラス（逆三角形）
  cocktail: <path d="M8 2L12 12V22M12 22H8M12 22H16M4 2H20L12 12L4 2Z" />,

  // ロックグラス（四角形）
  rocks: (
    <>
      <path d="M5 5H19V19H5V5Z" />
      <path d="M8 5V2M16 5V2" />
    </>
  ),

  // ハイボールグラス（縦長）
  highball: <path d="M6 2H18V22H6V2Z" />,

  // コリンズグラス（細めの縦長）
  collins: <path d="M7 2H17V22H7V2Z" />,

  // シャンパンフルート（細いグラス）
  champagne_flute: <path d="M10 2H14L13 14V22M11 14V22M9 22H15" />,

  // シャンパンソーサー（平たいグラス）
  champagne_saucer: <path d="M4 6H20L18 10H6L4 6ZM12 10V20M8 20H16" />,

  // ワイングラス
  wine: <path d="M8 2H16L15 10C15 12 13.5 14 12 14C10.5 14 9 12 9 10L8 2ZM12 14V20M8 20H16" />,

  // ショットグラス
  shot: <path d="M8 8H16V20H8V8Z" />,

  // 銅マグ（モスコミュール用）
  copper_mug: <path d="M6 4H16V20H6V4ZM16 8H20V16H16" />,

  // ゴブレット
  goblet: <path d="M7 2H17L16 10C16 12 14 14 12 14C10 14 8 12 8 10L7 2ZM12 14V18M7 18H17V22H7V18Z" />,
}

/**
 * 利用可能なグラス種別の一覧
 */
export const GLASS_TYPES = Object.keys(glassIconMap)
