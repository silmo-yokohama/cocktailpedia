"use client"

import { Heart, Menu, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { ArtDecoLine, StarIcon } from "@/components/atoms/icons"
import { Logo } from "@/components/atoms/Logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useSearchModal } from "@/contexts/SearchModalContext"
import { cn } from "@/lib/utils"
import { MAIN_BASE_OPTIONS } from "@/types"

interface HeaderProps {
  /** 追加のクラス名 */
  className?: string
}

/**
 * ヘッダーコンポーネント
 * ロゴ、ベース別ナビ、お気に入り・検索アイコンを含む
 */
export function Header({ className }: HeaderProps) {
  const pathname = usePathname()
  // 検索モーダルの状態を取得
  const { open: openSearchModal } = useSearchModal()
  // モバイルメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 管理画面では公開ヘッダーを表示しない
  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <header
      className={cn(
        // ポジション
        "sticky top-0 z-50",
        // 背景とブラー
        "bg-background/80 backdrop-blur-lg",
        // ボーダー
        "border-b border-border/30",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Logo size="md" />

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center gap-1" aria-label="ベース別ナビゲーション">
            {MAIN_BASE_OPTIONS.map((option) => (
              <Link
                key={option.value}
                href={`/filter/${option.value}`}
                className={cn(
                  // ベーススタイル
                  "px-3 py-2 text-sm font-medium rounded-md",
                  // カラー
                  "text-foreground/70 hover:text-gold",
                  // 背景
                  "hover:bg-gold/5",
                  // トランジション
                  "transition-all duration-200",
                  // フォーカス
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                )}
              >
                {option.label}
              </Link>
            ))}
          </nav>

          {/* 右側のアクション */}
          <div className="flex items-center gap-2">
            {/* お気に入りアイコン */}
            <Link
              href="/favorites"
              className={cn(
                // ベーススタイル
                "flex items-center justify-center w-10 h-10 rounded-full",
                // カラー
                "text-foreground/70 hover:text-gold",
                // 背景
                "hover:bg-gold/5",
                // トランジション
                "transition-all duration-200",
                // フォーカス
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              )}
              aria-label="お気に入り一覧"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* 検索アイコン */}
            <button
              type="button"
              onClick={() => openSearchModal()}
              className={cn(
                // ベーススタイル
                "flex items-center justify-center w-10 h-10 rounded-full",
                // カラー
                "text-foreground/70 hover:text-gold",
                // 背景
                "hover:bg-gold/5",
                // トランジション
                "transition-all duration-200",
                // フォーカス
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              )}
              aria-label="検索"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* モバイルメニューボタン */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "md:hidden",
                    "text-foreground/70 hover:text-gold hover:bg-gold/5"
                  )}
                  aria-label="メニューを開く"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className={cn(
                  "w-[280px] sm:w-[320px]",
                  "bg-[#1a1612] border-l-0",
                  "p-0 overflow-hidden"
                )}
              >
                {/* アクセシビリティ用のタイトル（非表示） */}
                <SheetHeader className="sr-only">
                  <SheetTitle>メニュー</SheetTitle>
                </SheetHeader>

                {/* Art Deco風の左ボーダー装飾 */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold/0 via-gold/40 to-gold/0" />

                {/* メニューコンテンツ */}
                <div className="flex flex-col h-full pt-16 pb-8 px-6">
                  {/* ヘッダー装飾 */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/30" />
                    <StarIcon size={12} points={4} className="text-gold/50" />
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/30" />
                  </div>

                  {/* ベース別ナビゲーション */}
                  <nav className="flex flex-col" aria-label="ベース別ナビゲーション">
                    <p
                      className="mb-4 text-[11px] font-medium tracking-[0.25em] text-gold/60"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      BASE SPIRITS
                    </p>
                    <div className="space-y-1">
                      {MAIN_BASE_OPTIONS.map((option) => (
                        <Link
                          key={option.value}
                          href={`/filter/${option.value}`}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "group flex items-center gap-4 py-3 px-4 -mx-4",
                            "text-[15px] text-foreground/70",
                            "hover:text-gold hover:bg-gold/[0.03]",
                            "transition-all duration-200",
                            "focus:outline-none focus-visible:text-gold"
                          )}
                        >
                          <span className="w-1.5 h-1.5 rotate-45 border border-gold/30 group-hover:border-gold/60 group-hover:bg-gold/20 transition-all duration-200" />
                          <span className="tracking-wide">{option.label}</span>
                        </Link>
                      ))}
                    </div>
                  </nav>

                  {/* 区切りライン */}
                  <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                  </div>

                  {/* お気に入りリンク */}
                  <Link
                    href="/favorites"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "group flex items-center gap-4 py-3 px-4 -mx-4",
                      "text-[15px] text-foreground/70",
                      "hover:text-gold hover:bg-gold/[0.03]",
                      "transition-all duration-200",
                      "focus:outline-none focus-visible:text-gold"
                    )}
                  >
                    <Heart className="w-4 h-4 text-gold/50 group-hover:text-gold transition-colors duration-200" />
                    <span className="tracking-wide">お気に入り</span>
                  </Link>

                  {/* 下部のスペーサー */}
                  <div className="flex-1" />

                  {/* フッター装飾 */}
                  <div className="flex flex-col items-center gap-4 pt-6">
                    <ArtDecoLine width={60} height={24} variant="simple" className="text-gold/15" />
                    <p
                      className="text-[9px] tracking-[0.3em] text-gold/20"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      COCKTAILPEDIA
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* ヘッダー下部の装飾ライン */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-px",
          "bg-gradient-to-r from-transparent via-gold/20 to-transparent"
        )}
      />
    </header>
  )
}
