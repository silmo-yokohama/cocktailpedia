"use client"

import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useRef, useState } from "react"

import { getSearchableIngredients } from "@/actions/cocktails"
import { GlassIcon } from "@/components/atoms/icons"
import { FilterChip } from "@/components/molecules/FilterChip"
import { FilterSection } from "@/components/molecules/FilterSection"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSearchModal } from "@/contexts/SearchModalContext"
import { cn } from "@/lib/utils"
import {
  ALCOHOL_STRENGTH_OPTIONS,
  BASE_OPTIONS,
  CARBONATION_OPTIONS,
  COLOR_OPTIONS,
  filtersToSearchParams,
  GLASS_OPTIONS,
  type SearchFilters,
  TECHNIQUE_OPTIONS,
  TEMPERATURE_OPTIONS,
} from "@/types"

/**
 * 検索モーダルコンポーネント
 * ヘッダーの検索アイコンから開く
 */
export function SearchModal() {
  const router = useRouter()
  const { isOpen, close, initialBase } = useSearchModal()

  // 検索条件の状態
  const [filters, setFilters] = useState<SearchFilters>({})
  // 材料選択肢
  const [ingredients, setIngredients] = useState<{ id: string; name: string; category: string | null }[]>([])
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false)
  // 材料読み込み済みフラグ
  const ingredientsLoadedRef = useRef(false)

  // 初期ベースをフィルターに適用
  const activeFilters = useMemo((): SearchFilters => {
    if (initialBase && !filters.base) {
      return { ...filters, base: initialBase as SearchFilters["base"] }
    }
    return filters
  }, [filters, initialBase])

  /**
   * 材料一覧を取得
   */
  const loadIngredients = useCallback(async () => {
    if (ingredientsLoadedRef.current || isLoadingIngredients) return

    setIsLoadingIngredients(true)
    try {
      const data = await getSearchableIngredients()
      setIngredients(data)
      ingredientsLoadedRef.current = true
    } catch (error) {
      console.error("材料の取得に失敗しました:", error)
    } finally {
      setIsLoadingIngredients(false)
    }
  }, [isLoadingIngredients])

  /**
   * モーダルの開閉ハンドラー
   */
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        // 開くときに材料を読み込む
        loadIngredients()
      } else {
        // 閉じるときにフィルターをリセット
        setFilters({})
        close()
      }
    },
    [close, loadIngredients]
  )

  /**
   * フィルターを更新
   */
  const updateFilter = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  /**
   * 単一選択のトグル
   */
  const toggleSingleSelect = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: prev[key] === value ? undefined : value,
      }))
    },
    []
  )

  /**
   * 材料の選択を切り替え
   */
  const toggleIngredient = useCallback((ingredientId: string) => {
    setFilters((prev) => {
      const currentIds = prev.ingredientIds || []
      const newIds = currentIds.includes(ingredientId)
        ? currentIds.filter((id) => id !== ingredientId)
        : [...currentIds, ingredientId]
      return { ...prev, ingredientIds: newIds.length > 0 ? newIds : undefined }
    })
  }, [])

  /**
   * フィルターをクリア
   */
  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  /**
   * 検索を実行
   */
  const handleSearch = useCallback(() => {
    const params = filtersToSearchParams(activeFilters)
    router.push(`/?${params.toString()}`)
    setFilters({})
    close()
  }, [activeFilters, router, close])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl max-h-[90vh] overflow-y-auto",
          "bg-background border-border/30"
        )}
      >
        <DialogHeader>
          <DialogTitle
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            カクテルを検索
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* フリーワード検索 */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              フリーワード
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                type="text"
                placeholder="カクテル名で検索..."
                value={activeFilters.keyword || ""}
                onChange={(e) => updateFilter("keyword", e.target.value || undefined)}
                className="pl-10 bg-card border-border/30 focus:border-gold/50 focus:ring-gold/20"
              />
            </div>
          </div>

          {/* ベース */}
          <FilterSection title="ベース">
            <div className="flex flex-wrap gap-2">
              {BASE_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  isSelected={activeFilters.base === option.value}
                  onClick={() => toggleSingleSelect("base", option.value as SearchFilters["base"])}
                />
              ))}
            </div>
          </FilterSection>

          {/* 技法 */}
          <FilterSection title="技法">
            <div className="flex flex-wrap gap-2">
              {TECHNIQUE_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  isSelected={activeFilters.technique === option.value}
                  onClick={() => toggleSingleSelect("technique", option.value as SearchFilters["technique"])}
                />
              ))}
            </div>
          </FilterSection>

          {/* 度数 */}
          <FilterSection title="度数">
            <div className="flex flex-wrap gap-2">
              {ALCOHOL_STRENGTH_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  isSelected={activeFilters.alcoholStrength === option.value}
                  onClick={() =>
                    toggleSingleSelect("alcoholStrength", option.value as SearchFilters["alcoholStrength"])
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* グラス */}
          <FilterSection title="グラス">
            <div className="flex flex-wrap gap-2">
              {GLASS_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  isSelected={activeFilters.glass === option.value}
                  onClick={() => toggleSingleSelect("glass", option.value as SearchFilters["glass"])}
                  icon={<GlassIcon glass={option.value} size={16} />}
                />
              ))}
            </div>
          </FilterSection>

          {/* 冷たさ */}
          <FilterSection title="冷たさ">
            <div className="flex flex-wrap gap-2">
              {TEMPERATURE_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  isSelected={activeFilters.temperature === option.value}
                  onClick={() => toggleSingleSelect("temperature", option.value as SearchFilters["temperature"])}
                />
              ))}
            </div>
          </FilterSection>

          {/* 炭酸 */}
          <FilterSection title="炭酸">
            <div className="flex flex-wrap gap-2">
              {CARBONATION_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  isSelected={activeFilters.carbonation === option.value}
                  onClick={() => toggleSingleSelect("carbonation", option.value as SearchFilters["carbonation"])}
                />
              ))}
            </div>
          </FilterSection>

          {/* カラー */}
          <FilterSection title="カラー">
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  isSelected={activeFilters.color === option.value}
                  onClick={() => toggleSingleSelect("color", option.value as SearchFilters["color"])}
                />
              ))}
            </div>
          </FilterSection>

          {/* 材料（複数選択可） */}
          <FilterSection title="材料" subtitle="複数選択可（AND条件）">
            {isLoadingIngredients ? (
              <div className="text-sm text-foreground/50">読み込み中...</div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {ingredients.map((ingredient) => (
                  <FilterChip
                    key={ingredient.id}
                    label={ingredient.name}
                    isSelected={activeFilters.ingredientIds?.includes(ingredient.id) || false}
                    onClick={() => toggleIngredient(ingredient.id)}
                  />
                ))}
              </div>
            )}
          </FilterSection>
        </div>

        {/* フッター：アクションボタン */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-foreground/60 hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            条件をクリア
          </Button>
          <Button
            onClick={handleSearch}
            className="bg-gold hover:bg-gold/90 text-background font-medium"
          >
            <Search className="w-4 h-4 mr-2" />
            検索する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
