import { cn } from "@/lib/utils"

interface ArtDecoLineProps {
  /** 幅 */
  width?: number
  /** 高さ */
  height?: number
  /** バリエーション */
  variant?: "simple" | "with-circles" | "corner"
  /** 追加のクラス名 */
  className?: string
}

/**
 * Art Deco風装飾ライン Atom
 * フッターなどで使用する装飾的なライン
 */
export function ArtDecoLine({
  width = 120,
  height = 20,
  variant = "with-circles",
  className,
}: ArtDecoLineProps) {
  // シンプルなダイヤモンド+ラインのみ
  if (variant === "simple") {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className={cn("text-gold", className)}
      >
        <path
          d={`M0 ${height / 2}H${width * 0.35}`}
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <path
          d={`M${width / 2} ${height * 0.2}L${width * 0.583} ${height / 2}L${width / 2} ${height * 0.8}L${width * 0.417} ${height / 2}L${width / 2} ${height * 0.2}Z`}
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <circle cx={width / 2} cy={height / 2} r={height * 0.1} fill="currentColor" />
        <path
          d={`M${width * 0.65} ${height / 2}H${width}`}
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </svg>
    )
  }

  // コーナー装飾
  if (variant === "corner") {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        className={cn("text-gold", className)}
        style={{ width, height: width }}
      >
        <path
          d="M0 100 L0 60 L20 60 L20 80 L40 80 L40 100"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M0 100 L0 40 L10 40 L10 90 L60 90 L60 100"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
        />
      </svg>
    )
  }

  // with-circles（デフォルト）- ダイヤモンド+ライン+円
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={cn("text-gold", className)}
    >
      {/* 中央のダイヤモンド */}
      <path
        d={`M${width / 2} 0L${width / 2 + 7} ${height / 2}L${width / 2} ${height}L${width / 2 - 7} ${height / 2}L${width / 2} 0Z`}
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      {/* 左側の装飾 */}
      <path
        d={`M0 ${height / 2}H${width / 2 - 10}`}
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle
        cx={width * 0.21}
        cy={height / 2}
        r="2"
        fill="currentColor"
      />
      {/* 右側の装飾 */}
      <path
        d={`M${width / 2 + 10} ${height / 2}H${width}`}
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle
        cx={width * 0.79}
        cy={height / 2}
        r="2"
        fill="currentColor"
      />
    </svg>
  )
}
