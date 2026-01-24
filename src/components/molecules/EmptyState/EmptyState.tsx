import { Search } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  /** タイトル */
  title?: string
  /** 説明文 */
  description?: string
  /** アクションボタンのテキスト */
  actionLabel?: string
  /** アクションボタンのリンク先 */
  actionHref?: string
  /** アイコン */
  icon?: React.ReactNode
  /** 追加のクラス名 */
  className?: string
}

/**
 * 空状態 Molecule
 * データが存在しない場合の表示コンポーネント
 */
export function EmptyState({
  title = "データがありません",
  description,
  actionLabel,
  actionHref,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center",
        className
      )}
    >
      {/* アイコン */}
      {icon && <div className="mb-8">{icon}</div>}

      {/* タイトル */}
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>

      {/* 説明文 */}
      {description && (
        <p className="text-muted-foreground mb-8 max-w-md">{description}</p>
      )}

      {/* アクションボタン */}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
            "bg-gold/10 text-gold border border-gold/30",
            "hover:bg-gold/20 hover:border-gold/50",
            "transition-all duration-200",
            "font-medium"
          )}
        >
          <Search className="w-4 h-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

/**
 * お気に入り空状態用のグラスアイコン
 */
export function EmptyGlassIcon() {
  return (
    <div className="relative w-24 h-32">
      <svg viewBox="0 0 100 140" fill="none" className="w-full h-full">
        {/* グラス本体 */}
        <path
          d="M15 10L50 80L85 10"
          stroke="oklch(0.75 0.14 75 / 0.3)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* グラスの縁 */}
        <ellipse
          cx="50"
          cy="10"
          rx="35"
          ry="5"
          stroke="oklch(0.75 0.14 75 / 0.3)"
          strokeWidth="2"
          fill="none"
        />
        {/* ステム */}
        <line
          x1="50"
          y1="80"
          x2="50"
          y2="115"
          stroke="oklch(0.75 0.14 75 / 0.3)"
          strokeWidth="2"
        />
        {/* ベース */}
        <ellipse
          cx="50"
          cy="120"
          rx="20"
          ry="4"
          stroke="oklch(0.75 0.14 75 / 0.3)"
          strokeWidth="2"
          fill="none"
        />
        {/* ハートのアイコン（破線） */}
        <path
          d="M50 35 C40 25, 25 30, 30 45 C35 55, 50 65, 50 65 C50 65, 65 55, 70 45 C75 30, 60 25, 50 35"
          stroke="oklch(0.75 0.14 75 / 0.2)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          fill="none"
        />
      </svg>
    </div>
  )
}
