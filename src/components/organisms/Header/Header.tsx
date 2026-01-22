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
                  "w-[280px] sm:w-[320px]",
                  "bg-background/95 backdrop-blur-xl",
                  "border-l border-border/30"
                )}
              >
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Logo size="sm" linkToHome={false} />
                  </SheetTitle>
                </SheetHeader>

                {/* モバイルナビゲーション */}
                <nav className="flex flex-col gap-1 mt-8" aria-label="メインナビゲーション">
                  <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ベースで探す
                  </p>
                  {MAIN_BASE_OPTIONS.map((option, index) => (
                    <Link
                      key={option.value}
                      href={`/filter/${option.value}`}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        // ベーススタイル
                        "px-3 py-3 text-base font-medium rounded-md",
                        // カラー
                        "text-foreground/80 hover:text-gold",
                        // 背景
                        "hover:bg-gold/5",
                        // トランジション
                        "transition-all duration-200",
                        // アニメーション
                        "opacity-0 animate-in fade-in-0 slide-in-from-right-4",
                        // フォーカス
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                      )}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      {option.label}
                    </Link>
                  ))}

                  {/* 区切り線 */}
                  <div className="my-4 border-t border-border/30" />

                  {/* お気に入りリンク */}
                  <Link
                    href="/favorites"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      // ベーススタイル
                      "flex items-center gap-3 px-3 py-3 text-base font-medium rounded-md",
                      // カラー
                      "text-foreground/80 hover:text-gold",
                      // 背景
                      "hover:bg-gold/5",
                      // トランジション
                      "transition-all duration-200",
                      // アニメーション
                      "opacity-0 animate-in fade-in-0 slide-in-from-right-4"
                    )}
                    style={{
                      animationDelay: `${MAIN_BASE_OPTIONS.length * 50 + 50}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <Heart className="w-5 h-5" />
                    お気に入り
                  </Link>
                </nav>

                {/* Art Deco風の装飾 */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  <svg
                    width="60"
                    height="30"
                    viewBox="0 0 60 30"
                    fill="none"
                    className="opacity-20"
                  >
                    <path
                      d="M30 0L45 15L30 30L15 15L30 0Z"
                      stroke="oklch(0.75 0.14 75)"
                      strokeWidth="1"
                    />
                    <path
                      d="M0 15H15M45 15H60"
                      stroke="oklch(0.75 0.14 75)"
                      strokeWidth="1"
                    />
                  </svg>
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
