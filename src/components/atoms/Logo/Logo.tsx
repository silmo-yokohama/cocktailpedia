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
          {/* 背景の装飾円 */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="url(#gold-gradient)"
            strokeWidth="1"
            opacity="0.3"
            className="transition-opacity duration-300 group-hover:opacity-50"
          />

          {/* カクテルグラスのシルエット */}
          <path
            d="M10 8L20 22L30 8H10Z"
            fill="url(#gold-gradient)"
            className="transition-all duration-300"
          />

          {/* グラスの液面ライン */}
          <path
            d="M12 10L20 20L28 10"
            stroke="oklch(0.12 0.015 45)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.3"
          />

          {/* グラスの脚 */}
          <path
            d="M20 22V32"
            stroke="url(#gold-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* グラスのベース */}
          <path
            d="M14 32H26"
            stroke="url(#gold-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* 装飾のダイヤモンド */}
          <path
            d="M20 4L22 6L20 8L18 6L20 4Z"
            fill="url(#gold-gradient)"
            className="transition-transform duration-300 group-hover:scale-110 origin-center"
          />

          {/* グラデーション定義 */}
          <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.82 0.12 75)" />
              <stop offset="50%" stopColor="oklch(0.75 0.14 75)" />
              <stop offset="100%" stopColor="oklch(0.6 0.15 70)" />
            </linearGradient>
          </defs>
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
