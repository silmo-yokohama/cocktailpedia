import { notFound } from "next/navigation"
import Link from "next/link"
import { getAdminCocktailById, getAllIngredients } from "@/actions/admin"
import { CocktailForm } from "../../_components/CocktailForm"

/**
 * カクテル編集画面のプロパティ
 */
interface EditCocktailPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * カクテル編集画面（S-103）
 */
export default async function EditCocktailPage({ params }: EditCocktailPageProps) {
  const { id } = await params

  // カクテル情報と材料一覧を並行取得
  const [{ cocktail, recipeItems }, ingredients] = await Promise.all([
    getAdminCocktailById(id),
    getAllIngredients(),
  ])

  // カクテルが見つからない場合は404
  if (!cocktail) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* パンくずリスト */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-foreground">
          ダッシュボード
        </Link>
        <span>/</span>
        <Link href="/admin/cocktails" className="hover:text-foreground">
          カクテル管理
        </Link>
        <span>/</span>
        <span className="text-foreground">{cocktail.name}</span>
      </nav>

      {/* ページタイトル */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">カクテル編集</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            「{cocktail.name}」の情報を編集します
          </p>
        </div>
        <Link
          href={`/cocktails/${cocktail.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
          公開ページを見る
        </Link>
      </div>

      {/* フォーム */}
      <div className="rounded-lg border border-border/50 bg-card p-6">
        <CocktailForm
          cocktail={cocktail}
          recipeItems={recipeItems}
          ingredients={ingredients}
        />
      </div>
    </div>
  )
}
