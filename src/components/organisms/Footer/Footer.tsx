import Link from "next/link"

import { Logo } from "@/components/atoms/Logo"
import { cn } from "@/lib/utils"

interface FooterProps {
  /** 追加のクラス名 */
  className?: string
}

/**
 * フッターコンポーネント
 * コピーライトとサイト説明リンクを含む
 */
export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        // 背景とボーダー
        "bg-surface border-t border-border/30",
        // パディング
        "py-8 md:py-12",
        className
      )}
    >
      <div className="container mx-auto px-4">
        {/* フッター上部の装飾ライン */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-gold/30" />
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gold/40"
            >
              <path
                d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
                fill="currentColor"
              />
            </svg>
            <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-gold/30" />
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex flex-col items-center gap-6">
          {/* ロゴ */}
          <Logo size="sm" showText={true} />

          {/* ナビゲーション */}
          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <Link
              href="/about"
              className={cn(
                "text-sm text-muted-foreground hover:text-gold",
                "transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded"
              )}
            >
              サイトについて
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/favorites"
              className={cn(
                "text-sm text-muted-foreground hover:text-gold",
                "transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded"
              )}
            >
              お気に入り
            </Link>
          </nav>

          {/* コピーライト */}
          <p className="text-xs text-muted-foreground/60">
            © {currentYear} Cocktailpedia. All rights reserved.
          </p>
        </div>

        {/* Art Deco風の装飾（下部） */}
        <div className="flex items-center justify-center mt-8">
          <svg
            width="120"
            height="20"
            viewBox="0 0 120 20"
            fill="none"
            className="opacity-20"
          >
            {/* 中央のダイヤモンド */}
            <path
              d="M60 0L67 10L60 20L53 10L60 0Z"
              stroke="oklch(0.75 0.14 75)"
              strokeWidth="1"
              fill="none"
            />
            {/* 左側の装飾 */}
            <path
              d="M0 10H50"
              stroke="oklch(0.75 0.14 75)"
              strokeWidth="1"
            />
            <circle
              cx="25"
              cy="10"
              r="2"
              fill="oklch(0.75 0.14 75)"
            />
            {/* 右側の装飾 */}
            <path
              d="M70 10H120"
              stroke="oklch(0.75 0.14 75)"
              strokeWidth="1"
            />
            <circle
              cx="95"
              cy="10"
              r="2"
              fill="oklch(0.75 0.14 75)"
            />
          </svg>
        </div>
      </div>
    </footer>
  )
}
