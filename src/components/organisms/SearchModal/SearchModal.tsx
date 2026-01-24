"use client"

import { Check, ChevronDown, Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { getSearchableIngredients } from "@/actions/cocktails"
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
  searchParamsToFilters,
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
  const urlSearchParams = useSearchParams()
  const { isOpen, close, initialBase } = useSearchModal()

  // 検索条件の状態
  const [filters, setFilters] = useState<SearchFilters>({})
  // 材料選択肢
  const [ingredients, setIngredients] = useState<{ id: string; name: string; category: string | null }[]>([])
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false)
  // 材料読み込み済みフラグ
  const ingredientsLoadedRef = useRef(false)
  // 初期化済みフラグ（モーダルを開いた時に一度だけURLから復元）
  const initializedRef = useRef(false)

  // モーダルが開いた時にURLパラメータから検索条件を復元し、材料を読み込む
  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      const restoredFilters = searchParamsToFilters(urlSearchParams)
      setFilters(restoredFilters)
      initializedRef.current = true

      // 材料をまだ読み込んでいない場合は読み込む
      if (!ingredientsLoadedRef.current) {
        const loadIngredients = async () => {
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
        }
        loadIngredients()
      }
    }
    if (!isOpen) {
      // モーダルが閉じたら初期化フラグをリセット
      initializedRef.current = false
    }
  }, [isOpen, urlSearchParams])

  // 初期ベースをフィルターに適用
  const activeFilters = useMemo((): SearchFilters => {
    if (initialBase && !filters.base) {
      return { ...filters, base: initialBase as SearchFilters["base"] }
    }
    return filters
  }, [filters, initialBase])

  /**
   * モーダルの開閉ハンドラー
   */
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        // 閉じるときはフィルターを保持（リセットしない）
        close()
      }
    },
    [close]
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
    // フィルターは保持したまま閉じる（次回開いた時にURLから復元される）
    close()
  }, [activeFilters, router, close])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl max-h-[90vh] flex flex-col",
          "bg-background border-border/30"
        )}
      >
        {/* ヘッダー（固定） */}
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-border/30">
          <DialogTitle
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            カクテルを検索
          </DialogTitle>
        </DialogHeader>

        {/* スクロール可能なコンテンツエリア */}
        <div className="flex-1 overflow-y-auto min-h-0 py-4 -mx-6 px-6">
          <div className="space-y-6">
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
                    icon={<GlassIcon glass={option.value} />}
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

            {/* 材料（複数選択可） - プルダウン形式 */}
            <FilterSection title="材料" subtitle="複数選択可（AND条件）">
              {isLoadingIngredients ? (
                <div className="text-sm text-foreground/50">読み込み中...</div>
              ) : (
                <IngredientMultiSelect
                  ingredients={ingredients}
                  selectedIds={activeFilters.ingredientIds || []}
                  onToggle={toggleIngredient}
                />
              )}
            </FilterSection>
          </div>
        </div>

        {/* フッター（固定）：アクションボタン */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-border/30">
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

/**
 * フィルターセクション
 */
function FilterSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
        {subtitle && <span className="text-xs text-foreground/50">{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}

/**
 * フィルターチップ
 */
function FilterChip({
  label,
  isSelected,
  onClick,
  icon,
}: {
  label: string
  isSelected: boolean
  onClick: () => void
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-all",
        "border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        isSelected
          ? "bg-gold/20 border-gold/40 text-gold"
          : "bg-card border-border/30 text-foreground/70 hover:border-gold/30 hover:text-foreground"
      )}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {label}
    </button>
  )
}

/**
 * グラスアイコン
 */
function GlassIcon({ glass }: { glass: string }) {
  // シンプルなSVGアイコンで各グラスを表現
  const iconMap: Record<string, React.ReactNode> = {
    cocktail: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2L12 12V22M12 22H8M12 22H16M4 2H20L12 12L4 2Z" />
      </svg>
    ),
    rocks: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 5H19V19H5V5Z" />
        <path d="M8 5V2M16 5V2" />
      </svg>
    ),
    highball: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2H18V22H6V2Z" />
      </svg>
    ),
    collins: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 2H17V22H7V2Z" />
      </svg>
    ),
    champagne_flute: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 2H14L13 14V22M11 14V22M9 22H15" />
      </svg>
    ),
    champagne_saucer: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6H20L18 10H6L4 6ZM12 10V20M8 20H16" />
      </svg>
    ),
    wine: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2H16L15 10C15 12 13.5 14 12 14C10.5 14 9 12 9 10L8 2ZM12 14V20M8 20H16" />
      </svg>
    ),
    shot: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 8H16V20H8V8Z" />
      </svg>
    ),
    copper_mug: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 4H16V20H6V4ZM16 8H20V16H16" />
      </svg>
    ),
    goblet: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 2H17L16 10C16 12 14 14 12 14C10 14 8 12 8 10L7 2ZM12 14V18M7 18H17V22H7V18Z" />
      </svg>
    ),
  }

  return iconMap[glass] || null
}

/**
 * 材料の複数選択プルダウン
 */
function IngredientMultiSelect({
  ingredients,
  selectedIds,
  onToggle,
}: {
  ingredients: { id: string; name: string; category: string | null }[]
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // 検索でフィルタリング
  const filteredIngredients = useMemo(() => {
    if (!searchTerm) return ingredients
    const term = searchTerm.toLowerCase()
    return ingredients.filter((ing) => ing.name.toLowerCase().includes(term))
  }, [ingredients, searchTerm])

  // 選択中の材料名を取得
  const selectedNames = useMemo(() => {
    return selectedIds
      .map((id) => ingredients.find((ing) => ing.id === id)?.name)
      .filter(Boolean)
  }, [selectedIds, ingredients])

  return (
    <div ref={dropdownRef} className="relative">
      {/* トリガーボタン */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all",
          "border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
          "bg-card border-border/30 hover:border-gold/30",
          isOpen && "border-gold/50"
        )}
      >
        <span className={cn("truncate", selectedIds.length === 0 && "text-foreground/50")}>
          {selectedIds.length === 0
            ? "材料を選択..."
            : selectedIds.length === 1
              ? selectedNames[0]
              : `${selectedIds.length}件選択中`}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-foreground/40 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* 選択中のタグ表示 */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedNames.map((name, index) => (
            <span
              key={selectedIds[index]}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-gold/20 text-gold border border-gold/30"
            >
              {name}
              <button
                type="button"
                onClick={() => onToggle(selectedIds[index])}
                className="hover:text-gold/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border/30 rounded-lg shadow-lg">
          {/* 検索入力 */}
          <div className="p-2 border-b border-border/30">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40" />
              <input
                type="text"
                placeholder="材料名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 text-sm bg-transparent border-none focus:outline-none placeholder:text-foreground/40"
                autoFocus
              />
            </div>
          </div>

          {/* 選択肢一覧 */}
          <div className="max-h-48 overflow-y-auto">
            {filteredIngredients.length === 0 ? (
              <div className="px-3 py-4 text-sm text-foreground/50 text-center">
                該当する材料がありません
              </div>
            ) : (
              filteredIngredients.map((ingredient) => {
                const isSelected = selectedIds.includes(ingredient.id)
                return (
                  <button
                    key={ingredient.id}
                    type="button"
                    onClick={() => onToggle(ingredient.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                      "hover:bg-gold/10",
                      isSelected && "bg-gold/5"
                    )}
                  >
                    <span
                      className={cn(
                        "w-4 h-4 flex items-center justify-center rounded border transition-colors",
                        isSelected
                          ? "bg-gold border-gold text-background"
                          : "border-border/50"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </span>
                    <span className={cn(isSelected && "text-gold")}>{ingredient.name}</span>
                    {ingredient.category && (
                      <span className="ml-auto text-xs text-foreground/40">
                        {ingredient.category}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
