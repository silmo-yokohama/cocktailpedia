import { cn } from "@/lib/utils"

/**
 * アイコンコンポーネント共通のProps
 */
interface IconProps {
  /** サイズ（px） */
  size?: number
  /** 追加のクラス名 */
  className?: string
}

/**
 * 水滴アイコン（ノンアルコール表示用）
 */
export function WaterDropIcon({ size = 14, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      className={cn("shrink-0", className)}
    >
      <path d="M8 1a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 5.293V1.5A.5.5 0 0 1 8 1zM4 8a4 4 0 1 1 8 0c0 2.5-2 4.5-4 6.5C6 12.5 4 10.5 4 8z" />
    </svg>
  )
}

/**
 * 炎アイコン（度数表示用）
 */
export function FireIcon({ size = 12, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      className={cn("shrink-0", className)}
    >
      <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15z" />
    </svg>
  )
}

/**
 * 小さなダイヤモンドアイコン（区切り線装飾用）
 */
export function SmallDiamondIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="6" viewBox="0 0 12 6" className={cn("shrink-0", className)}>
      <path d="M6 0L9 3L6 6L3 3L6 0Z" fill="currentColor" />
    </svg>
  )
}

/**
 * ダイヤモンドと円の装飾アイコン（Art Deco風）
 */
export function DiamondWithCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="20"
      viewBox="0 0 40 20"
      fill="none"
      className={cn("shrink-0", className)}
    >
      <path
        d="M20 0L27 10L20 20L13 10L20 0Z"
        fill="none"
        stroke="oklch(0.75 0.14 75)"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle
        cx="20"
        cy="10"
        r="3"
        fill="oklch(0.75 0.14 75)"
        opacity="0.3"
      />
    </svg>
  )
}

/**
 * シンプルなカクテルグラスアイコン（空状態表示用）
 */
export function SimpleGlassIcon({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={cn("shrink-0", className)}
    >
      <path d="M8 21h8M12 17v4M6 3h12l-1 10a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4L6 3z" />
      <path d="M8 3v2M16 3v2" />
    </svg>
  )
}

/**
 * カードコーナー装飾（ホバー時に表示）
 */
export function CardCornerDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn("w-full h-full shrink-0", className)}>
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
  )
}

/**
 * 空のグラスイラスト（お気に入り空状態用）
 */
export function EmptyGlassIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-24 h-32", className)}>
      <svg viewBox="0 0 100 140" fill="none" className="w-full h-full">
        {/* グラス本体 */}
        <path
          d="M15 10L50 80L85 10"
          stroke="oklch(0.75 0.14 75 / 0.3)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* グラスの縁 */}
        <ellipse
          cx="50"
          cy="10"
          rx="35"
          ry="5"
          stroke="oklch(0.75 0.14 75 / 0.3)"
          strokeWidth="2"
          fill="none"
        />
        {/* ステム */}
        <line
          x1="50"
          y1="80"
          x2="50"
          y2="115"
          stroke="oklch(0.75 0.14 75 / 0.3)"
          strokeWidth="2"
        />
        {/* ベース */}
        <ellipse
          cx="50"
          cy="120"
          rx="20"
          ry="4"
          stroke="oklch(0.75 0.14 75 / 0.3)"
          strokeWidth="2"
          fill="none"
        />
        {/* ハートのアイコン（破線） */}
        <path
          d="M50 35 C40 25, 25 30, 30 45 C35 55, 50 65, 50 65 C50 65, 65 55, 70 45 C75 30, 60 25, 50 35"
          stroke="oklch(0.75 0.14 75 / 0.2)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          fill="none"
        />
      </svg>
    </div>
  )
}
