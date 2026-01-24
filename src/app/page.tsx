import { getCocktails } from "@/actions/cocktails"
import { searchParamsToFilters, type SortOptionValue } from "@/types"

import { HomeClient } from "./_components/HomeClient"

/**
 * トップページ（Server Component）
 * 初回データをサーバーサイドで取得してSEOに対応
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // URLパラメータを取得
  const params = await searchParams
  const sortParam = typeof params.sort === "string" ? params.sort : "name_asc"
  const sort = sortParam as SortOptionValue

  // 検索フィルターを取得
  const urlSearchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      urlSearchParams.set(key, value)
    }
  }
  const filters = searchParamsToFilters(urlSearchParams)

  // 初回データを取得
  const { items: initialCocktails, hasMore: initialHasMore } = await getCocktails({
    offset: 0,
    limit: 60,
    sort,
    filters,
  })

  return (
    <HomeClient
      initialCocktails={initialCocktails}
      initialHasMore={initialHasMore}
      initialSort={sort}
      initialFilters={filters}
    />
  )
}
