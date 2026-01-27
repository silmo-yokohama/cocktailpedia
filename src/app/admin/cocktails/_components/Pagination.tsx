"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/atoms/icons/HeroIcons"

/**
 * ページネーションコンポーネント
 */
export function Pagination({
  currentPage,
  totalPages,
  search,
}: {
  currentPage: number
  totalPages: number
  search: string
}) {
  /**
   * ページURLを生成
   */
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (page > 1) {
      params.set("page", page.toString())
    }
    if (search) {
      params.set("search", search)
    }
    const query = params.toString()
    return `/admin/cocktails${query ? `?${query}` : ""}`
  }

  /**
   * 表示するページ番号の配列を生成
   */
  const getPageNumbers = () => {
    const pages: (number | "...")[] = []
    const showPages = 5 // 表示するページ数

    if (totalPages <= showPages) {
      // 全ページ表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 先頭
      pages.push(1)

      // 現在のページ周辺
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      if (start > 2) {
        pages.push("...")
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages - 1) {
        pages.push("...")
      }

      // 末尾
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-between">
      {/* ページ情報 */}
      <p className="text-sm text-muted-foreground">
        {currentPage} / {totalPages} ページ
      </p>

      {/* ページネーションボタン */}
      <div className="flex items-center gap-1">
        {/* 前へ */}
        <Button
          variant="outline"
          size="sm"
          asChild={currentPage > 1}
          disabled={currentPage <= 1}
        >
          {currentPage > 1 ? (
            <Link href={getPageUrl(currentPage - 1)}>
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </Link>
          ) : (
            <span>
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </span>
          )}
        </Button>

        {/* ページ番号 */}
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              asChild={page !== currentPage}
              className="min-w-9"
            >
              {page !== currentPage ? (
                <Link href={getPageUrl(page)}>{page}</Link>
              ) : (
                <span>{page}</span>
              )}
            </Button>
          )
        )}

        {/* 次へ */}
        <Button
          variant="outline"
          size="sm"
          asChild={currentPage < totalPages}
          disabled={currentPage >= totalPages}
        >
          {currentPage < totalPages ? (
            <Link href={getPageUrl(currentPage + 1)}>
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
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          ) : (
            <span>
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
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
