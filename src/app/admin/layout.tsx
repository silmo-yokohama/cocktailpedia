import type { Metadata } from "next"
import Link from "next/link"
import { Toaster } from "@/components/ui/sonner"

/**
 * 管理画面のメタデータ
 */
export const metadata: Metadata = {
  title: "管理画面",
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * 管理画面ナビゲーションのリンク定義
 */
const NAV_LINKS = [
  { href: "/admin", label: "ダッシュボード", icon: "📊" },
  { href: "/admin/cocktails", label: "カクテル管理", icon: "🍸" },
  { href: "/admin/ingredients", label: "材料管理", icon: "🍋" },
  { href: "/admin/settings", label: "設定", icon: "⚙️" },
] as const

/**
 * 管理画面のレイアウト
 * 公開画面とは異なり、シンプルで機能的なデザイン
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* 管理画面ヘッダー */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ロゴ */}
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-semibold text-foreground transition-colors hover:text-gold"
          >
            <span className="text-gold">Cocktailpedia</span>
            <span className="rounded-md bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
              Admin
            </span>
          </Link>

          {/* ナビゲーション */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* 公開サイトへのリンク */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            <span className="hidden sm:inline">公開サイト</span>
          </Link>
        </div>

        {/* モバイル用ナビゲーション */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/30 px-4 py-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* 通知トースト */}
      <Toaster position="top-right" richColors />
    </div>
  )
}
