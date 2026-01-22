"use client"

import { Heart, Menu, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Logo } from "@/components/atoms/Logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { MAIN_BASE_OPTIONS } from "@/types"

interface HeaderProps {
  /** 検索モーダルを開くコールバック（タスク4で実装） */
  onSearchClick?: () => void
  /** 追加のクラス名 */
  className?: string
}

/**
 * ヘッダーコンポーネント
 * ロゴ、ベース別ナビ、お気に入り・検索アイコンを含む
 */
export function Header({ onSearchClick, className }: HeaderProps) {
  // モバイルメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              onClick={onSearchClick}
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
                  "w-[260px] sm:w-[300px]",
                  "bg-background/98 backdrop-blur-xl",
                  "border-l border-gold/10",
                  "p-0"
                )}
              >
                {/* アクセシビリティ用のタイトル（非表示） */}
                <SheetHeader className="sr-only">
                  <SheetTitle>メニュー</SheetTitle>
                </SheetHeader>

                {/* メニューコンテンツ */}
                <div className="flex flex-col h-full px-4 py-6">
                  {/* ベース別ナビゲーション */}
                  <nav className="flex flex-col" aria-label="ベース別ナビゲーション">
                    <p className="px-2 pb-3 text-[10px] font-semibold text-gold/60 uppercase tracking-[0.2em]">
                      Base Spirits
                    </p>
                    <div className="space-y-0.5">
                      {MAIN_BASE_OPTIONS.map((option) => (
                        <Link
                          key={option.value}
                          href={`/filter/${option.value}`}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-2 py-2.5 rounded",
                            "text-sm text-foreground/80",
                            "hover:bg-gold/5 hover:text-gold",
                            "transition-colors duration-150",
                            "focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/50"
                          )}
                        >
                          <span className="w-1 h-1 rounded-full bg-gold/50" />
                          {option.label}
                        </Link>
                      ))}
                    </div>
                  </nav>

                  {/* 区切り */}
                  <div className="flex items-center gap-4 my-5">
                    <div className="flex-1 h-px bg-border/30" />
                    <span className="text-gold/20 text-[10px]">◆</span>
                    <div className="flex-1 h-px bg-border/30" />
                  </div>

                  {/* お気に入りリンク */}
                  <Link
                    href="/favorites"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2.5 rounded",
                      "text-sm text-gold/80",
                      "hover:bg-gold/5 hover:text-gold",
                      "transition-colors duration-150",
                      "focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/50"
                    )}
                  >
                    <Heart className="w-4 h-4" />
                    <span>お気に入り</span>
                  </Link>

                  {/* 下部のスペーサー */}
                  <div className="flex-1" />

                  {/* 下部の装飾 */}
                  <div className="flex justify-center pt-4 pb-2">
                    <svg
                      width="80"
                      height="16"
                      viewBox="0 0 80 16"
                      fill="none"
                      className="text-gold/10"
                    >
                      <path d="M0 8H32" stroke="currentColor" strokeWidth="0.5" />
                      <path d="M40 2L44 8L40 14L36 8L40 2Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
                      <path d="M48 8H80" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
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
