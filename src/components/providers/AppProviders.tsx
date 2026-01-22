"use client"

import type { ReactNode } from "react"

import { SearchModal } from "@/components/organisms/SearchModal"
import { SearchModalProvider } from "@/contexts/SearchModalContext"

interface AppProvidersProps {
  children: ReactNode
}

/**
 * アプリケーション全体で必要なプロバイダーをまとめる
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SearchModalProvider>
      {children}
      {/* グローバルな検索モーダル */}
      <SearchModal />
    </SearchModalProvider>
  )
}
