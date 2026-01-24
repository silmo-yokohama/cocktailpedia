import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCocktails } from "@/actions/cocktails"
import { BASE_OPTIONS, getLabel, type BaseValue, type SortOptionValue } from "@/types"

import { BaseFilterClient } from "./_components/BaseFilterClient"

/** 有効なベース値の配列 */
const VALID_BASES: readonly string[] = BASE_OPTIONS.map((opt) => opt.value)

interface BaseFilterPageProps {
  params: Promise<{ base: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * 静的パスを生成（SSG）
 * 全てのベースの一覧ページを事前生成
 */
export function generateStaticParams() {
  return VALID_BASES.map((base) => ({ base }))
}

/**
 * ベース別一覧ページのメタデータを動的に生成
 */
export async function generateMetadata({ params }: BaseFilterPageProps): Promise<Metadata> {
  const { base } = await params

  // 無効なベースの場合
  if (!VALID_BASES.includes(base)) {
    return {
      title: "ベースが見つかりません",
    }
  }

  const baseLabel = getLabel(BASE_OPTIONS, base)

  return {
    title: `${baseLabel}ベースのカクテル一覧`,
    description: `${baseLabel}をベースにしたカクテルの一覧です。多彩な条件でお気に入りのカクテルを検索できます。`,
    openGraph: {
      title: `${baseLabel}ベースのカクテル一覧 | Cocktailpedia`,
      description: `${baseLabel}をベースにしたカクテルの一覧です。`,
    },
  }
}

/**
 * ベース別一覧ページ（Server Component）
 */
export default async function BaseFilterPage({ params, searchParams }: BaseFilterPageProps) {
  const { base } = await params
  const resolvedSearchParams = await searchParams

  // 無効なベースの場合は404
  if (!VALID_BASES.includes(base)) {
    notFound()
  }

  // ソートパラメータを取得
  const sortParam = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "name_asc"
  const sort = sortParam as SortOptionValue

  // ベースでフィルターして初回データを取得
  const { items: initialCocktails, hasMore: initialHasMore } = await getCocktails({
    offset: 0,
    limit: 60,
    sort,
    filters: {
      base: base as BaseValue,
    },
  })

  const baseLabel = getLabel(BASE_OPTIONS, base)

  return (
    <BaseFilterClient
      base={base as BaseValue}
      baseLabel={baseLabel}
      initialCocktails={initialCocktails}
      initialHasMore={initialHasMore}
      initialSort={sort}
    />
  )
}
