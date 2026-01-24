"use client"

import { useCallback, useEffect, useState } from "react"

/** LocalStorageのキー */
const RECENTLY_VIEWED_KEY = "cocktailpedia_recently_viewed"

/** 最大保存件数 */
const MAX_ITEMS = 10

/**
 * 閲覧履歴管理用のカスタムフック
 * localStorageを使用して閲覧履歴を永続化
 */
export function useRecentlyViewed() {
  // 閲覧履歴（カクテルIDの配列、新しい順）
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  // 初期化完了フラグ
  const [isLoaded, setIsLoaded] = useState(false)

  // localStorageから閲覧履歴を読み込む
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
      if (stored) {
        const ids = JSON.parse(stored) as string[]
        setRecentlyViewed(ids)
      }
    } catch (error) {
      console.error("閲覧履歴の読み込みに失敗しました:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // 閲覧履歴が変更されたらlocalStorageに保存
  useEffect(() => {
    if (!isLoaded) return

    try {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed))
    } catch (error) {
      console.error("閲覧履歴の保存に失敗しました:", error)
    }
  }, [recentlyViewed, isLoaded])

  /**
   * 閲覧履歴に追加
   * 既存のIDは先頭に移動、最大件数を超えた分は削除
   */
  const addToHistory = useCallback((id: string) => {
    setRecentlyViewed((prev) => {
      // 既存のIDを除去
      const filtered = prev.filter((existingId) => existingId !== id)
      // 先頭に追加して最大件数に制限
      return [id, ...filtered].slice(0, MAX_ITEMS)
    })
  }, [])

  /**
   * 閲覧履歴をクリア
   */
  const clearHistory = useCallback(() => {
    setRecentlyViewed([])
  }, [])

  /**
   * 閲覧履歴のIDを取得
   */
  const getRecentlyViewedIds = useCallback(() => recentlyViewed, [recentlyViewed])

  /**
   * 指定したIDが閲覧履歴に含まれているかチェック
   * @param id チェックするカクテルID
   * @returns 履歴に含まれている場合はtrue
   */
  const isInHistory = useCallback(
    (id: string) => recentlyViewed.includes(id),
    [recentlyViewed]
  )

  return {
    recentlyViewed,
    addToHistory,
    clearHistory,
    getRecentlyViewedIds,
    isInHistory,
    isLoaded,
  }
}
