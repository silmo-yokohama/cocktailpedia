"use client"

import { ArrowDownAZ, ArrowUpAZ, Bookmark, Eye } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { SORT_OPTIONS, type SortOptionValue } from "@/types"

interface SortSelectProps {
  /** 現在選択されているソートオプション */
  value: SortOptionValue
  /** ソートオプション変更時のコールバック */
  onChange: (value: SortOptionValue) => void
  /** 追加のクラス名 */
  className?: string
}

/**
 * ソートオプションに対応するアイコンを返す
 */
function getSortIcon(value: SortOptionValue) {
  switch (value) {
    case "name_asc":
      return <ArrowDownAZ className="w-4 h-4" />
    case "name_desc":
      return <ArrowUpAZ className="w-4 h-4" />
    case "view_count_desc":
      return <Eye className="w-4 h-4" />
    case "bookmark_count_desc":
      return <Bookmark className="w-4 h-4" />
    default:
      return null
  }
}

/**
 * ソート選択コンポーネント
 * カクテル一覧の並び順を選択するドロップダウン
 */
export function SortSelect({ value, onChange, className }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOptionValue)}>
      <SelectTrigger
        className={cn(
          // ベーススタイル
          "w-[180px] h-10",
          // 背景とボーダー
          "bg-card/50 border-border/50",
          "hover:bg-card hover:border-gold/30",
          // テキスト
          "text-sm text-foreground/90",
          // フォーカス
          "focus:ring-1 focus:ring-gold/50 focus:border-gold/30",
          // トランジション
          "transition-all duration-200",
          className
        )}
        aria-label="並び替え"
      >
        <div className="flex items-center gap-2">
          <span className="text-gold/70">{getSortIcon(value)}</span>
          <SelectValue placeholder="並び替え" />
        </div>
      </SelectTrigger>
      <SelectContent
        className={cn(
          // 背景とボーダー
          "bg-popover border-border/50",
          // シャドウ
          "shadow-xl shadow-black/20",
          // アニメーション
          "animate-in fade-in-0 zoom-in-95"
        )}
      >
        {SORT_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={cn(
              // ベーススタイル
              "cursor-pointer",
              // ホバーとフォーカス
              "focus:bg-gold/10 focus:text-foreground",
              "data-[highlighted]:bg-gold/10",
              // 選択状態
              "data-[state=checked]:bg-gold/15 data-[state=checked]:text-gold",
              // トランジション
              "transition-colors duration-150"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{getSortIcon(option.value)}</span>
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
