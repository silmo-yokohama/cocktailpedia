import { Suspense } from "react"
import Link from "next/link"
import { getAdminCocktails } from "@/actions/admin"
import { CocktailsTable } from "./_components/CocktailsTable"
import { SearchInput } from "./_components/SearchInput"
import { Pagination } from "./_components/Pagination"
import { Button } from "@/components/ui/button"

/**
 * カクテル一覧画面のプロパティ
 */
interface CocktailsPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

/**
 * カクテル一覧画面（S-102）
 * カクテルの一覧表示、検索、編集/削除操作
 */
export default async function CocktailsPage({ searchParams }: CocktailsPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">カクテル管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            カクテルの登録・編集・削除を行います
          </p>
        </div>
        <Link href="/admin/cocktails/new">
          <Button className="w-full sm:w-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            新規登録
          </Button>
        </Link>
      </div>

      {/* 検索フォーム */}
      <SearchInput defaultValue={search} />

      {/* カクテル一覧 */}
      <Suspense fallback={<TableSkeleton />}>
        <CocktailsTableWrapper page={page} search={search} />
      </Suspense>
    </div>
  )
}

/**
 * カクテル一覧テーブルのラッパー（データ取得）
 */
async function CocktailsTableWrapper({
  page,
  search,
}: {
  page: number
  search: string
}) {
  const { items, totalCount, totalPages, currentPage } = await getAdminCocktails(
    page,
    search
  )

  return (
    <div className="space-y-4">
      {/* 件数表示 */}
      <p className="text-sm text-muted-foreground">
        全 {totalCount} 件
        {search && ` （「${search}」で検索）`}
      </p>

      {/* テーブル */}
      {items.length > 0 ? (
        <>
          <CocktailsTable items={items} />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              search={search}
            />
          )}
        </>
      ) : (
        <EmptyState search={search} />
      )}
    </div>
  )
}

/**
 * 空状態の表示
 */
function EmptyState({ search }: { search: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 text-muted-foreground"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">
        {search ? "検索結果がありません" : "カクテルがありません"}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {search
          ? "別のキーワードで検索してください"
          : "「新規登録」ボタンからカクテルを追加してください"}
      </p>
      {!search && (
        <Link href="/admin/cocktails/new" className="mt-4 inline-block">
          <Button>新規登録</Button>
        </Link>
      )}
    </div>
  )
}

/**
 * テーブルのスケルトンローダー
 */
function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-24 animate-pulse rounded bg-muted" />
      <div className="rounded-lg border border-border/50 bg-card">
        <div className="border-b border-border/50 p-4">
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-5 flex-1 animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b border-border/50 p-4 last:border-0">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 animate-pulse rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
