import { cn } from "@/lib/utils"

interface FilterChipProps {
  /** ラベル */
  label: string
  /** 選択状態 */
  isSelected: boolean
  /** クリック時のコールバック */
  onClick: () => void
  /** アイコン */
  icon?: React.ReactNode
  /** 追加のクラス名 */
  className?: string
}

/**
 * フィルターチップ Molecule
 * 選択可能なフィルター条件を表示するチップボタン
 */
export function FilterChip({
  label,
  isSelected,
  onClick,
  icon,
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-all",
        "border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        isSelected
          ? "bg-gold/20 border-gold/40 text-gold"
          : "bg-card border-border/30 text-foreground/70 hover:border-gold/30 hover:text-foreground",
        className
      )}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {label}
    </button>
  )
}
