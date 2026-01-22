import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCocktailBySlug, getRelatedCocktails } from "@/actions/cocktails"

import { CocktailDetailClient } from "./_components/CocktailDetailClient"
import { RelatedCocktails } from "./_components/RelatedCocktails"

interface CocktailDetailPageProps {
  params: Promise<{ slug: string }>
}

/**
 * カクテル詳細ページのメタデータを動的に生成
 */
export async function generateMetadata({ params }: CocktailDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const cocktail = await getCocktailBySlug(slug)

  if (!cocktail) {
    return {
      title: "カクテルが見つかりません",
    }
  }

  const title = cocktail.name_en ? `${cocktail.name} (${cocktail.name_en})` : cocktail.name

  return {
    title,
    description: cocktail.description || `${cocktail.name}のレシピと詳細情報`,
    openGraph: {
      title: `${cocktail.name} | Cocktailpedia`,
      description: cocktail.description || `${cocktail.name}のレシピと詳細情報`,
      images: cocktail.image_url ? [{ url: cocktail.image_url }] : undefined,
    },
  }
}

/**
 * カクテル詳細ページ（Server Component）
 */
export default async function CocktailDetailPage({ params }: CocktailDetailPageProps) {
  const { slug } = await params

  // カクテルデータを取得
  const cocktail = await getCocktailBySlug(slug)

  if (!cocktail) {
    notFound()
  }

  // 関連カクテルを取得
  const relatedCocktails = await getRelatedCocktails(cocktail.id)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 詳細情報（閲覧カウント、履歴記録を含む） */}
      <CocktailDetailClient cocktail={cocktail} />

      {/* 関連カクテル */}
      {relatedCocktails.length > 0 && (
        <RelatedCocktails cocktails={relatedCocktails} className="mt-16" />
      )}
    </div>
  )
}
