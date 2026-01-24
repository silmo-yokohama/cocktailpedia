"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

/**
 * ランキングデータの型
 */
type RankingData = {
  name: string
  value: number
}

/**
 * RankingChart Props
 */
type RankingChartProps = {
  /** グラフタイトル */
  title: string
  /** ランキングデータ */
  data: RankingData[]
  /** アイコン */
  icon: string
  /** バーの色（グラデーション開始色） */
  colorStart?: string
  /** バーの色（グラデーション終了色） */
  colorEnd?: string
}

/**
 * ランキング棒グラフコンポーネント
 * Art Deco風のデザインで、TOP10のデータを横棒グラフで表示
 */
export function RankingChart({
  title,
  data,
  icon,
  colorStart = "oklch(0.82 0.12 75)",
  colorEnd = "oklch(0.55 0.15 70)",
}: RankingChartProps) {
  // データがない場合の表示
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
          データがありません
        </div>
      </div>
    )
  }

  // カスタムツールチップ
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload: RankingData }>
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="rounded-lg border border-gold/30 bg-surface-elevated/95 px-4 py-3 shadow-xl backdrop-blur-sm">
          <p className="mb-1 font-medium text-foreground">{item.name}</p>
          <p className="text-gold">{item.value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  // グラデーションカラーを計算（ランキング順位に応じて）
  const getBarColor = (index: number) => {
    const ratio = index / (data.length - 1 || 1)
    // 上位ほど明るいゴールド、下位ほど落ち着いた色に
    const lightness = 0.82 - ratio * 0.27
    const chroma = 0.12 + ratio * 0.03
    return `oklch(${lightness} ${chroma} 75)`
  }

  return (
    <div className="group rounded-lg border border-border/50 bg-card p-6 transition-all duration-300 hover:border-gold/30">
      {/* ヘッダー */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>

      {/* Art Deco風の装飾ライン */}
      <div className="relative mb-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-1.5 w-1.5 rotate-45 bg-gold/60" />
        </div>
      </div>

      {/* チャート */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            barCategoryGap="15%"
          >
            {/* グラデーション定義 */}
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={colorEnd} stopOpacity={0.8} />
                <stop offset="100%" stopColor={colorStart} stopOpacity={1} />
              </linearGradient>
            </defs>

            {/* X軸（値） */}
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.65 0.02 60)", fontSize: 11 }}
              tickFormatter={(value) => value.toLocaleString()}
            />

            {/* Y軸（カクテル名） */}
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={100}
              tick={({ x, y, payload }) => (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={-5}
                    y={0}
                    dy={4}
                    textAnchor="end"
                    fill="oklch(0.85 0.02 70)"
                    fontSize={12}
                    fontWeight={500}
                  >
                    {payload.value.length > 10
                      ? `${payload.value.slice(0, 10)}…`
                      : payload.value}
                  </text>
                </g>
              )}
            />

            {/* ツールチップ */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "oklch(0.25 0.02 50 / 0.5)" }} />

            {/* バー */}
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(index)}
                  className="transition-opacity duration-200 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* フッター装飾 */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/30" />
        <span>TOP {data.length}</span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/30" />
      </div>
    </div>
  )
}
