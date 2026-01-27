"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, XIcon } from "@/components/atoms/icons/HeroIcons"

/**
 * 検索入力コンポーネント
 * URLのsearchパラメータを使用して検索状態を管理
 */
export function SearchInput({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(defaultValue)

  /**
   * 検索を実行
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set("search", value)
      } else {
        params.delete("search")
      }
      // 検索時はページを1に戻す
      params.delete("page")
      router.push(`/admin/cocktails?${params.toString()}`)
    })
  }

  /**
   * 検索をクリア
   */
  const handleClear = () => {
    setValue("")
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.delete("search")
      params.delete("page")
      router.push(`/admin/cocktails?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1 max-w-sm">
        <SearchIcon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="カクテル名で検索..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-9 pr-10"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XIcon size={16} />
            <span className="sr-only">クリア</span>
          </button>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "検索中..." : "検索"}
      </Button>
    </form>
  )
}
