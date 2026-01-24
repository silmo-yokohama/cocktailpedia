import Link from "next/link"
import { getAllIngredients } from "@/actions/admin"
import { CocktailForm } from "../_components/CocktailForm"

/**
 * カクテル新規登録画面（S-103）
 */
export default async function NewCocktailPage() {
  // 材料一覧を取得
  const ingredients = await getAllIngredients()

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
        <span className="text-foreground">新規登録</span>
      </nav>

      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">カクテル新規登録</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          新しいカクテルを登録します
        </p>
      </div>

      {/* フォーム */}
      <div className="rounded-lg border border-border/50 bg-card p-6">
        <CocktailForm ingredients={ingredients} />
      </div>
    </div>
  )
}
