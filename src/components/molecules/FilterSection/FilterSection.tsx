import { cn } from "@/lib/utils"

interface FilterSectionProps {
  /** セクションタイトル */
  title: string
  /** サブタイトル（オプション） */
  subtitle?: string
  /** 子要素 */
  children: React.ReactNode
  /** 追加のクラス名 */
  className?: string
}

/**
 * フィルターセクション Molecule
 * 検索モーダル等でフィルター項目をグルーピングするセクション
 */
export function FilterSection({
  title,
  subtitle,
  children,
  className,
}: FilterSectionProps) {
  return (
    <div className={cn("", className)}>
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
        {subtitle && (
          <span className="text-xs text-foreground/50">{subtitle}</span>
        )}
      </div>
      {children}
    </div>
  )
}
