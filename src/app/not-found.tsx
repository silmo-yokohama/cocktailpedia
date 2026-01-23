import Link from "next/link"
import { Home, Search } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * 404エラーページ（S-006）
 * 存在しないURLにアクセスした場合に表示
 */
export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[70vh] flex flex-col items-center justify-center">
      {/* メインコンテンツ */}
      <div className="text-center max-w-lg mx-auto">
        {/* イラスト：こぼれたカクテルグラス */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <svg
            viewBox="0 0 160 160"
            fill="none"
            className="w-full h-full"
          >
            {/* 背景の円（ムーディーな雰囲気） */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="oklch(0.75 0.14 75 / 0.05)"
            />
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
        </div>

        {/* 404テキスト */}
        <div className="mb-6">
          <span
            className="text-6xl md:text-7xl font-bold text-gradient-gold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            404
          </span>
        </div>

        {/* エラーメッセージ */}
        <h1
          className="text-2xl md:text-3xl font-semibold text-foreground mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          ページが見つかりません
        </h1>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          お探しのページは移動したか、削除された可能性があります。
          <br />
          URLをご確認いただくか、下のボタンからお探しください。
        </p>

        {/* Art Deco風の装飾 */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
          <svg
            width="30"
            height="15"
            viewBox="0 0 30 15"
            fill="none"
            className="mx-3"
          >
            <path
              d="M15 0L20 7.5L15 15L10 7.5L15 0Z"
              fill="none"
              stroke="oklch(0.75 0.14 75)"
              strokeWidth="1"
              opacity="0.5"
            />
            <circle
              cx="15"
              cy="7.5"
              r="2"
              fill="oklch(0.75 0.14 75)"
              opacity="0.3"
            />
          </svg>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* トップへ戻るボタン */}
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
              "bg-gold/10 text-gold border border-gold/30",
              "hover:bg-gold/20 hover:border-gold/50",
              "transition-all duration-200",
              "font-medium"
            )}
          >
            <Home className="w-4 h-4" />
            トップページへ
          </Link>

          {/* カクテルを探すボタン */}
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
              "bg-transparent text-muted-foreground",
              "hover:text-gold hover:bg-gold/5",
              "transition-all duration-200",
              "font-medium"
            )}
          >
            <Search className="w-4 h-4" />
            カクテルを探す
          </Link>
        </div>
      </div>

      {/* 背景装飾（角のArt Deco風パターン） */}
      <div className="fixed bottom-0 left-0 w-32 h-32 pointer-events-none opacity-20">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path
            d="M0 100 L0 60 L20 60 L20 80 L40 80 L40 100"
            stroke="oklch(0.75 0.14 75)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M0 100 L0 40 L10 40 L10 90 L60 90 L60 100"
            stroke="oklch(0.75 0.14 75)"
            strokeWidth="0.5"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="fixed bottom-0 right-0 w-32 h-32 pointer-events-none opacity-20 -scale-x-100">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path
            d="M0 100 L0 60 L20 60 L20 80 L40 80 L40 100"
            stroke="oklch(0.75 0.14 75)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M0 100 L0 40 L10 40 L10 90 L60 90 L60 100"
            stroke="oklch(0.75 0.14 75)"
            strokeWidth="0.5"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  )
}
