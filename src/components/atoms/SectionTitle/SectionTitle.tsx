import { cn } from "@/lib/utils"

interface SectionTitleProps {
  /** タイトルテキスト */
  children: React.ReactNode
  /** 追加のクラス名 */
  className?: string
  /** 見出しレベル（デフォルト: h2） */
  as?: "h1" | "h2" | "h3" | "h4"
}

/**
 * セクションタイトル Atom
 * 装飾ラインを伴うセクション見出しを表示する最小単位のコンポーネント
 */
export function SectionTitle({
  children,
  className,
  as: Component = "h2",
}: SectionTitleProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-4", className)}>
      <Component className="text-lg font-medium text-foreground">
        {children}
      </Component>
      <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
    </div>
  )
}
