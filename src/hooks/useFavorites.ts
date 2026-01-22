"use client"

import { useCallback, useEffect, useState } from "react"

import { updateBookmarkCount } from "@/actions/cocktails"

/** LocalStorageのキー */
const FAVORITES_KEY = "cocktailpedia_favorites"

/**
 * お気に入り管理用のカスタムフック
 * localStorageを使用してお気に入りを永続化
 */
export function useFavorites() {
  // お気に入りIDのセット
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  // 初期化完了フラグ
  const [isLoaded, setIsLoaded] = useState(false)

  // localStorageからお気に入りを読み込む
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        const ids = JSON.parse(stored) as string[]
        setFavorites(new Set(ids))
      }
    } catch (error) {
      console.error("お気に入りの読み込みに失敗しました:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // お気に入りが変更されたらlocalStorageに保存
  useEffect(() => {
    if (!isLoaded) return

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)))
    } catch (error) {
      console.error("お気に入りの保存に失敗しました:", error)
    }
  }, [favorites, isLoaded])

  /**
   * お気に入りかどうかを判定
   */
  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites])

  /**
   * お気に入りをトグル
   */
  const toggleFavorite = useCallback(
    async (id: string) => {
      const isCurrentlyFavorite = favorites.has(id)

      // 楽観的更新：UIを先に更新
      setFavorites((prev) => {
        const newFavorites = new Set(prev)
        if (isCurrentlyFavorite) {
          newFavorites.delete(id)
        } else {
          newFavorites.add(id)
        }
        return newFavorites
      })

      // サーバーにブックマーク数を更新（エラーでもローカルの変更は維持）
      try {
        await updateBookmarkCount(id, !isCurrentlyFavorite)
      } catch (error) {
        console.error("ブックマーク数の更新に失敗しました:", error)
        // エラー時もローカルの状態は維持する（要件通り）
      }
    },
    [favorites]
  )

  /**
   * お気に入りIDの配列を取得
   */
  const getFavoriteIds = useCallback(() => Array.from(favorites), [favorites])

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    getFavoriteIds,
    isLoaded,
  }
}
