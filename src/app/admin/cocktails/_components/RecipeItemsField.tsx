"use client"

import { useState } from "react"
import type { Ingredient } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/** レシピ項目の型 */
interface RecipeItemInput {
  ingredient_id: string
  amount: string
  sort_order: number
}

/** コンポーネントのプロパティ */
interface RecipeItemsFieldProps {
  /** 材料一覧（選択肢） */
  ingredients: Ingredient[]
  /** 現在のレシピ項目 */
  items: RecipeItemInput[]
  /** 変更時のコールバック */
  onChange: (items: RecipeItemInput[]) => void
}

/**
 * レシピ項目の動的フォームコンポーネント
 * 材料と分量のペアを複数追加・削除できる
 */
export function RecipeItemsField({
  ingredients,
  items,
  onChange,
}: RecipeItemsFieldProps) {
  /**
   * 項目を追加
   */
  const addItem = () => {
    onChange([
      ...items,
      {
        ingredient_id: "",
        amount: "",
        sort_order: items.length,
      },
    ])
  }

  /**
   * 項目を削除
   */
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    // sort_orderを再計算
    onChange(newItems.map((item, i) => ({ ...item, sort_order: i })))
  }

  /**
   * 項目を更新
   */
  const updateItem = (
    index: number,
    field: "ingredient_id" | "amount",
    value: string
  ) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    onChange(newItems)
  }

  /**
   * 項目を上に移動
   */
  const moveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = temp
    // sort_orderを再計算
    onChange(newItems.map((item, i) => ({ ...item, sort_order: i })))
  }

  /**
   * 項目を下に移動
   */
  const moveDown = (index: number) => {
    if (index === items.length - 1) return
    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = temp
    // sort_orderを再計算
    onChange(newItems.map((item, i) => ({ ...item, sort_order: i })))
  }

  /**
   * 材料名を取得
   */
  const getIngredientName = (id: string) => {
    return ingredients.find((ing) => ing.id === id)?.name || ""
  }

  return (
    <div className="space-y-4">
      {/* 項目一覧 */}
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <RecipeItemRow
              key={index}
              item={item}
              index={index}
              ingredients={ingredients}
              getIngredientName={getIngredientName}
              onUpdate={updateItem}
              onRemove={removeItem}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
              isFirst={index === 0}
              isLast={index === items.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            材料がありません。「材料を追加」ボタンで追加してください。
          </p>
        </div>
      )}

      {/* 追加ボタン */}
      <Button type="button" variant="outline" onClick={addItem} className="w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="mr-2 h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        材料を追加
      </Button>
    </div>
  )
}

/**
 * レシピ項目の1行コンポーネント
 */
function RecipeItemRow({
  item,
  index,
  ingredients,
  getIngredientName,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  item: RecipeItemInput
  index: number
  ingredients: Ingredient[]
  getIngredientName: (id: string) => string
  onUpdate: (index: number, field: "ingredient_id" | "amount", value: string) => void
  onRemove: (index: number) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  isFirst: boolean
  isLast: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card p-3">
      {/* 順序変更ボタン */}
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={isFirst}
          className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-3.5 w-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={isLast}
          className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-3.5 w-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </div>

      {/* 材料選択（Combobox） */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex-1 justify-between font-normal"
          >
            {item.ingredient_id
              ? getIngredientName(item.ingredient_id)
              : "材料を選択..."}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ml-2 h-4 w-4 shrink-0 opacity-50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="材料を検索..." />
            <CommandList>
              <CommandEmpty>材料が見つかりません</CommandEmpty>
              <CommandGroup>
                {ingredients.map((ingredient) => (
                  <CommandItem
                    key={ingredient.id}
                    value={ingredient.name}
                    onSelect={() => {
                      onUpdate(index, "ingredient_id", ingredient.id)
                      setOpen(false)
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`mr-2 h-4 w-4 ${
                        item.ingredient_id === ingredient.id
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {ingredient.name}
                    {ingredient.name_en && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({ingredient.name_en})
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* 分量入力 */}
      <Input
        placeholder="30ml"
        value={item.amount}
        onChange={(e) => onUpdate(index, "amount", e.target.value)}
        className="w-24 shrink-0"
      />

      {/* 削除ボタン */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        className="h-8 w-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span className="sr-only">削除</span>
      </Button>
    </div>
  )
}
