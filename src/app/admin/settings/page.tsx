import Link from "next/link"

/**
 * サイト設定画面（S-106）
 * タスク7で実装予定のプレースホルダー
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">サイト設定</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          サイトの設定を管理します
        </p>
      </div>

      {/* プレースホルダー */}
      <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <span className="text-3xl">⚙️</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground">準備中</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          この機能はタスク7で実装予定です。
          <br />
          現在は
          <Link href="/admin/cocktails" className="text-gold hover:underline">
            カクテル管理
          </Link>
          からご利用いただけます。
        </p>
      </div>
    </div>
  )
}
