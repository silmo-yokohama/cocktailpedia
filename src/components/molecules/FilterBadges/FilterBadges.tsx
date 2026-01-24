import { cn } from "@/lib/utils"
import type { SearchFilters } from "@/types"

interface FilterBadgesProps {
  /** 検索フィルター */
  filters: SearchFilters
  /** 追加のクラス名 */
  className?: string
}

/**
 * フィルターバッジ Molecule
 * 現在の検索条件をバッジとして表示するコンポーネント
 */
export function FilterBadges({ filters, className }: FilterBadgesProps) {
  // 各フィルターをバッジとして表示
  const badges: { label: string; value: string }[] = []

  if (filters.keyword) {
    badges.push({ label: "キーワード", value: filters.keyword })
  }
  if (filters.base) {
    badges.push({ label: "ベース", value: filters.base })
  }
  if (filters.technique) {
    badges.push({ label: "技法", value: filters.technique })
  }
  if (filters.glass) {
    badges.push({ label: "グラス", value: filters.glass })
  }
  if (filters.temperature) {
    badges.push({ label: "冷たさ", value: filters.temperature })
  }
  if (filters.carbonation) {
    badges.push({ label: "炭酸", value: filters.carbonation })
  }
  if (filters.color) {
    badges.push({ label: "カラー", value: filters.color })
  }
  if (filters.alcoholStrength) {
    badges.push({ label: "度数", value: filters.alcoholStrength })
  }

  if (badges.length === 0) return null

  return (
    <div className={cn("", className)}>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span
            key={badge.label}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-gold/10 text-gold/80 border border-gold/20"
          >
            <span className="text-gold/50">{badge.label}:</span>
            <span>{badge.value}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
