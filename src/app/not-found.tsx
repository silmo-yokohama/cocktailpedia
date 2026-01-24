import Link from "next/link"
import { Home, Search } from "lucide-react"

import { ArtDecoLine, DiamondIcon, SpilledGlassIllustration } from "@/components/atoms/icons"
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
          <SpilledGlassIllustration size={160} />
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
          <DiamondIcon size={30} className="mx-3 opacity-50" />
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
        <ArtDecoLine variant="corner" width={128} className="w-full h-full" />
      </div>

      <div className="fixed bottom-0 right-0 w-32 h-32 pointer-events-none opacity-20 -scale-x-100">
        <ArtDecoLine variant="corner" width={128} className="w-full h-full" />
      </div>
    </div>
  )
}
