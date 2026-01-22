"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

interface SearchModalContextType {
  /** モーダルの開閉状態 */
  isOpen: boolean
  /** モーダルを開く */
  open: (initialBase?: string) => void
  /** モーダルを閉じる */
  close: () => void
  /** 初期選択されたベース（ベース別一覧から開いた場合） */
  initialBase?: string
}

const SearchModalContext = createContext<SearchModalContextType | null>(null)

interface SearchModalProviderProps {
  children: ReactNode
}

/**
 * 検索モーダルの状態を管理するプロバイダー
 */
export function SearchModalProvider({ children }: SearchModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialBase, setInitialBase] = useState<string | undefined>(undefined)

  const open = useCallback((base?: string) => {
    setInitialBase(base)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setInitialBase(undefined)
  }, [])

  return (
    <SearchModalContext.Provider value={{ isOpen, open, close, initialBase }}>
      {children}
    </SearchModalContext.Provider>
  )
}

/**
 * 検索モーダルのコンテキストを使用するフック
 */
export function useSearchModal() {
  const context = useContext(SearchModalContext)
  if (!context) {
    throw new Error("useSearchModal must be used within a SearchModalProvider")
  }
  return context
}
