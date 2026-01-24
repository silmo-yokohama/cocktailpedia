import Link from "next/link"

import { ArtDecoLine, StarIcon } from "@/components/atoms/icons"
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
            <StarIcon size={24} points={8} className="text-gold/40" />
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
          <ArtDecoLine width={120} height={20} variant="with-circles" className="opacity-20" />
        </div>
      </div>
    </footer>
  )
}
