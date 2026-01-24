import { cn } from "@/lib/utils"

interface SpilledGlassIllustrationProps {
  /** サイズ（幅・高さ） */
  size?: number
  /** 追加のクラス名 */
  className?: string
}

/**
 * こぼれたカクテルグラス イラスト Atom
 * 404ページなどで使用する装飾的なイラスト
 */
export function SpilledGlassIllustration({
  size = 160,
  className,
}: SpilledGlassIllustrationProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      width={size}
      height={size}
      className={cn("", className)}
    >
      {/* 背景の円（ムーディーな雰囲気） */}
      <circle cx="80" cy="80" r="70" fill="oklch(0.75 0.14 75 / 0.05)" />
      <circle
        cx="80"
        cy="80"
        r="60"
        stroke="oklch(0.75 0.14 75 / 0.1)"
        strokeWidth="1"
        strokeDasharray="4 4"
        fill="none"
      />

      {/* 傾いたカクテルグラス */}
      <g transform="translate(80, 80) rotate(-20) translate(-35, -45)">
        {/* グラス本体 */}
        <path
          d="M5 0L35 55L65 0"
          stroke="oklch(0.75 0.14 75 / 0.6)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* グラスの縁 */}
        <ellipse
          cx="35"
          cy="0"
          rx="30"
          ry="5"
          stroke="oklch(0.75 0.14 75 / 0.6)"
          strokeWidth="2.5"
          fill="none"
        />
        {/* ステム */}
        <line
          x1="35"
          y1="55"
          x2="35"
          y2="85"
          stroke="oklch(0.75 0.14 75 / 0.6)"
          strokeWidth="2.5"
        />
        {/* ベース */}
        <ellipse
          cx="35"
          cy="88"
          rx="18"
          ry="4"
          stroke="oklch(0.75 0.14 75 / 0.6)"
          strokeWidth="2.5"
          fill="none"
        />
      </g>

      {/* こぼれた液体（アニメーション付き） */}
      <g className="animate-pulse">
        <ellipse
          cx="105"
          cy="120"
          rx="25"
          ry="8"
          fill="oklch(0.75 0.14 75 / 0.2)"
        />
        {/* 滴 */}
        <circle cx="85" cy="105" r="3" fill="oklch(0.75 0.14 75 / 0.3)" />
        <circle cx="95" cy="110" r="2" fill="oklch(0.75 0.14 75 / 0.25)" />
        <circle cx="75" cy="115" r="2.5" fill="oklch(0.75 0.14 75 / 0.2)" />
      </g>

      {/* 「?」マーク */}
      <text
        x="130"
        y="45"
        fontSize="24"
        fill="oklch(0.75 0.14 75 / 0.4)"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="bold"
      >
        ?
      </text>
    </svg>
  )
}
