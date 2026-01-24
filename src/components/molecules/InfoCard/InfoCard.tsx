import { cn } from "@/lib/utils"

interface InfoCardProps {
  /** アイコン */
  icon?: React.ReactNode
  /** ラベル */
  label: string
  /** 値 */
  value: string
  /** 追加のクラス名 */
  className?: string
}

/**
 * 情報カード Molecule
 * アイコン・ラベル・値を縦に並べた情報表示カード
 */
export function InfoCard({ icon, label, value, className }: InfoCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 rounded-lg",
        "bg-card border border-border/30 text-center",
        className
      )}
    >
      {icon && <span className="text-gold/50 mb-2">{icon}</span>}
      <span className="text-xs text-foreground/50 mb-1">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}
