import type { Metadata } from "next"

import { FavoritesClient } from "./_components/FavoritesClient"

/**
 * お気に入り一覧ページのメタデータ
 */
export const metadata: Metadata = {
  title: "お気に入り",
  description: "お気に入りに登録したカクテルの一覧です。",
  robots: {
    // お気に入りページはユーザー固有のため、インデックス不要
    index: false,
    follow: true,
  },
}

/**
 * お気に入り一覧ページ
 * localStorageベースのため、Client Componentで処理
 */
export default function FavoritesPage() {
  return <FavoritesClient />
}
