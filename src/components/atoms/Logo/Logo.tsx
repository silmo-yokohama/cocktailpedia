"use client"

import Link from "next/link"

interface LogoProps {
  /** ロゴのサイズ */
  size?: "sm" | "md" | "lg"
  /** クリックでトップへ遷移するか */
  linkToHome?: boolean
  /** テキストを表示するか */
  showText?: boolean
  /** 追加のクラス名 */
  className?: string
}

/**
 * Cocktailpediaのロゴコンポーネント
 * Art Deco風のカクテルグラスアイコンとタイポグラフィ
 */
export function Logo({ size = "md", linkToHome = true, showText = true, className = "" }: LogoProps) {
  // サイズに応じたスタイル
  const sizeStyles = {
    sm: {
      icon: "w-6 h-6",
      text: "text-lg",
      gap: "gap-1.5",
    },
    md: {
      icon: "w-8 h-8",
      text: "text-xl",
      gap: "gap-2",
    },
    lg: {
      icon: "w-10 h-10",
      text: "text-2xl",
      gap: "gap-2.5",
    },
  }

  const styles = sizeStyles[size]

  const LogoContent = (
    <div
      className={`inline-flex items-center ${styles.gap} group transition-all duration-300 ${className}`}
    >
      {/* カクテルグラスアイコン - Art Deco風 */}
      <div className={`${styles.icon} relative`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        >
          {/* グラデーション定義 */}
          <defs>
            <linearGradient id="logo-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.85 0.12 75)" />
              <stop offset="50%" stopColor="oklch(0.75 0.14 75)" />
              <stop offset="100%" stopColor="oklch(0.62 0.15 70)" />
            </linearGradient>
            <linearGradient id="logo-gold-stem" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.75 0.14 75)" />
              <stop offset="100%" stopColor="oklch(0.65 0.15 70)" />
            </linearGradient>
          </defs>

          {/* Art Deco風 外枠の八角形 */}
          <path
            d="M20 2L32 8V18L26 26H14L8 18V8L20 2Z"
            stroke="url(#logo-gold-gradient)"
            strokeWidth="0.75"
            opacity="0.25"
            fill="none"
            className="transition-opacity duration-300 group-hover:opacity-40"
          />

          {/* カクテルグラスのボウル部分 - 面で描画 */}
          <path
            d="M8 7H32L20 23L8 7Z"
            fill="url(#logo-gold-gradient)"
          />

          {/* グラスの液面ハイライト */}
          <path
            d="M11 9H29L20 20L11 9Z"
            fill="oklch(0.2 0.02 45)"
            opacity="0.15"
          />

          {/* グラスの縁のハイライト */}
          <path
            d="M9 7.5H31"
            stroke="oklch(0.9 0.08 75)"
            strokeWidth="0.5"
            opacity="0.6"
          />

          {/* グラスの脚 - 台形で面として描画 */}
          <path
            d="M17.5 23H22.5L21.5 31H18.5L17.5 23Z"
            fill="url(#logo-gold-stem)"
          />

          {/* 脚の中央ハイライト */}
          <path
            d="M19.5 24V30"
            stroke="oklch(0.9 0.08 75)"
            strokeWidth="0.5"
            opacity="0.4"
          />

          {/* グラスのベース - 楕円形で面として描画 */}
          <ellipse
            cx="20"
            cy="33"
            rx="8"
            ry="2.5"
            fill="url(#logo-gold-gradient)"
          />

          {/* ベースの上面ハイライト */}
          <ellipse
            cx="20"
            cy="32"
            rx="6"
            ry="1.5"
            fill="oklch(0.85 0.10 75)"
            opacity="0.5"
          />

          {/* Art Deco装飾 - グラス内の幾何学模様 */}
          <path
            d="M20 11L23 15L20 19L17 15L20 11Z"
            fill="oklch(0.9 0.08 75)"
            opacity="0.3"
            className="transition-opacity duration-300 group-hover:opacity-50"
          />
        </svg>

        {/* ホバー時のグロー効果 */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md bg-gold/20" />
      </div>

      {/* ロゴテキスト */}
      {showText && (
        <span
          className={`${styles.text} font-bold tracking-wide transition-all duration-300`}
          style={{
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          }}
        >
          <span className="text-gradient-gold">Cocktail</span>
          <span className="text-foreground/90">pedia</span>
        </span>
      )}
    </div>
  )

  // linkToHomeがtrueの場合はLinkでラップ
  if (linkToHome) {
    return (
      <Link
        href="/"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-lg"
        aria-label="Cocktailpedia トップページへ"
      >
        {LogoContent}
      </Link>
    )
  }

  return LogoContent
}
