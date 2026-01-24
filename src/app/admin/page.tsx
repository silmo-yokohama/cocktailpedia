import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { RankingChart } from "./_components/RankingChart"

/**
 * ダッシュボードの統計情報を取得
 */
async function getDashboardStats() {
  const supabase = createServerClient()

  // カクテル数
  const { count: cocktailCount } = await supabase
    .from("cocktails")
    .select("*", { count: "exact", head: true })

  // 材料数
  const { count: ingredientCount } = await supabase
    .from("ingredients")
    .select("*", { count: "exact", head: true })

  // 総閲覧回数
  const { data: viewData } = await supabase
    .from("cocktails")
    .select("view_count")

  const totalViews = viewData?.reduce((sum, item) => sum + (item.view_count || 0), 0) || 0

  // 総ブックマーク数
  const { data: bookmarkData } = await supabase
    .from("cocktails")
    .select("bookmark_count")

  const totalBookmarks = bookmarkData?.reduce((sum, item) => sum + (item.bookmark_count || 0), 0) || 0

  return {
    cocktailCount: cocktailCount || 0,
    ingredientCount: ingredientCount || 0,
    totalViews,
    totalBookmarks,
  }
}

/**
 * 閲覧数TOP10のカクテルを取得
 */
async function getViewRanking() {
  const supabase = createServerClient()

  const { data } = await supabase
    .from("cocktails")
    .select("name, view_count")
    .order("view_count", { ascending: false })
    .limit(10)

  return (
    data?.map((item) => ({
      name: item.name,
      value: item.view_count || 0,
    })) || []
  )
}

/**
 * ブックマーク数TOP10のカクテルを取得
 */
async function getBookmarkRanking() {
  const supabase = createServerClient()

  const { data } = await supabase
    .from("cocktails")
    .select("name, bookmark_count")
    .order("bookmark_count", { ascending: false })
    .limit(10)

  return (
    data?.map((item) => ({
      name: item.name,
      value: item.bookmark_count || 0,
    })) || []
  )
}

/**
 * 管理ダッシュボード（S-101）
 * 統計情報と各管理画面へのリンクを表示
 */
export default async function AdminDashboard() {
  // 並行してデータを取得
  const [stats, viewRanking, bookmarkRanking] = await Promise.all([
    getDashboardStats(),
    getViewRanking(),
    getBookmarkRanking(),
  ])

  return (
    <div className="space-y-8">
      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">ダッシュボード</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cocktailpediaの管理画面です
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="登録カクテル数"
          value={stats.cocktailCount}
          icon="🍸"
          href="/admin/cocktails"
        />
        <StatCard
          title="登録材料数"
          value={stats.ingredientCount}
          icon="🍋"
          href="/admin/ingredients"
        />
        <StatCard
          title="総閲覧回数"
          value={stats.totalViews}
          icon="👁️"
        />
        <StatCard
          title="総ブックマーク数"
          value={stats.totalBookmarks}
          icon="⭐"
        />
      </div>

      {/* ランキンググラフ */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          人気ランキング
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <RankingChart
            title="閲覧数 TOP 10"
            data={viewRanking}
            icon="👁️"
            colorStart="oklch(0.82 0.12 75)"
            colorEnd="oklch(0.55 0.15 70)"
          />
          <RankingChart
            title="ブックマーク TOP 10"
            data={bookmarkRanking}
            icon="⭐"
            colorStart="oklch(0.80 0.14 60)"
            colorEnd="oklch(0.50 0.12 45)"
          />
        </div>
      </div>

      {/* クイックアクション */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          クイックアクション
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="カクテルを登録"
            description="新しいカクテルを追加します"
            href="/admin/cocktails/new"
            icon="➕"
          />
          <QuickActionCard
            title="カクテル一覧"
            description="登録済みカクテルの管理"
            href="/admin/cocktails"
            icon="📋"
          />
          <QuickActionCard
            title="材料管理"
            description="材料の追加・編集"
            href="/admin/ingredients"
            icon="🧪"
          />
        </div>
      </div>
    </div>
  )
}

/**
 * 統計カードコンポーネント
 */
function StatCard({
  title,
  value,
  icon,
  href,
}: {
  title: string
  value: number
  icon: string
  href?: string
}) {
  const content = (
    <div className="rounded-lg border border-border/50 bg-card p-6 transition-colors hover:bg-accent/50">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        {href && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4 text-muted-foreground"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-foreground">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{title}</p>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

/**
 * クイックアクションカードコンポーネント
 */
function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-gold/30 hover:bg-accent/50"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-medium text-foreground group-hover:text-gold">
          {title}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}
