import { cn } from "@/lib/utils"

interface BadgeProps {
  /** アイコン */
  icon?: React.ReactNode
  /** ラベル */
  label: string
  /** 値 */
  value: string
  /** バリエーション */
  variant?: "default" | "outline" | "filled"
  /** 追加のクラス名 */
  className?: string
}

/**
 * バッジ Atom
 * アイコン・ラベル・値を表示する小さな情報表示コンポーネント
 */
export function Badge({
  icon,
  label,
  value,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        // バリエーション別スタイル
        variant === "default" && "bg-card border border-border/30",
        variant === "outline" && "bg-transparent border border-gold/30",
        variant === "filled" && "bg-gold/10 border border-gold/20",
        className
      )}
    >
      {icon && <span className="text-gold/60">{icon}</span>}
      <span className="text-xs text-foreground/50">{label}:</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}
