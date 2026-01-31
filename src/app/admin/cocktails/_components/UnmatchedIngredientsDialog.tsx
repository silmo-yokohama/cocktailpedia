"use client"

/**
 * 未登録材料処理ダイアログ
 *
 * AIが返した材料のうち、材料マスタに存在しない材料を処理するためのダイアログ。
 * 既存材料の選択または新規登録を行い、レシピへの紐付けを可能にする。
 */

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { createIngredient } from "@/actions/ingredients"
import type {
  AIIngredientInput,
  Ingredient,
  ResolvedIngredient,
  IngredientCategoryValue,
} from "@/types"
import { INGREDIENT_CATEGORY_OPTIONS } from "@/types/constants"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// ============================================
// 型定義
// ============================================

/** コンポーネントのProps */
interface UnmatchedIngredientsDialogProps {
  /** ダイアログの開閉状態 */
  open: boolean
  /** 開閉状態変更ハンドラ */
  onOpenChange: (open: boolean) => void
  /** AIが返した未登録材料リスト */
  unmatchedIngredients: AIIngredientInput[]
  /** 材料マスタ全件（既存材料選択用） */
  masterIngredients: Ingredient[]
  /** 処理完了時のコールバック */
  onComplete: (resolved: ResolvedIngredient[]) => void
}

/** 各未登録材料の処理モード */
type ResolutionMode = "existing" | "new"

/** 各未登録材料の状態 */
interface IngredientResolution {
  /** AIが返した元の情報 */
  original: AIIngredientInput
  /** 処理モード */
  mode: ResolutionMode
  /** 既存材料選択時のID */
  existingId: string | null
  /** 新規登録時の名前（編集可能） */
  newName: string
  /** 新規登録時のカテゴリ */
  newCategory: IngredientCategoryValue | null
}

// ============================================
// アイコンコンポーネント
// ============================================

/**
 * ボトルアイコン（未登録材料を表すシンボル）
 */
function BottleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2h4" />
      <path d="M12 2v4" />
      <path d="M8.5 6h7l1.5 3v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9l1.5-3z" />
      <path d="M8 15h8" />
    </svg>
  )
}

/**
 * スピナーアイコン
 */
function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/**
 * チェックアイコン
 */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  )
}

// ============================================
// メインコンポーネント
// ============================================

/**
 * 未登録材料処理ダイアログ
 *
 * @example
 * <UnmatchedIngredientsDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   unmatchedIngredients={unmatched}
 *   masterIngredients={allIngredients}
 *   onComplete={handleResolved}
 * />
 */
export function UnmatchedIngredientsDialog({
  open,
  onOpenChange,
  unmatchedIngredients,
  masterIngredients,
  onComplete,
}: UnmatchedIngredientsDialogProps) {
  // 各材料の解決状態を管理
  const [resolutions, setResolutions] = useState<IngredientResolution[]>(() =>
    unmatchedIngredients.map((ingredient) => ({
      original: ingredient,
      mode: "new" as const, // デフォルトは新規登録
      existingId: null,
      newName: ingredient.name,
      newCategory: ingredient.category,
    }))
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * 処理モードを変更
   */
  const handleModeChange = useCallback((index: number, mode: ResolutionMode) => {
    setResolutions((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], mode }
      return updated
    })
  }, [])

  /**
   * 既存材料IDを変更
   */
  const handleExistingIdChange = useCallback((index: number, id: string) => {
    setResolutions((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], existingId: id }
      return updated
    })
  }, [])

  /**
   * 新規登録名を変更
   */
  const handleNewNameChange = useCallback((index: number, name: string) => {
    setResolutions((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], newName: name }
      return updated
    })
  }, [])

  /**
   * 新規登録カテゴリを変更
   */
  const handleNewCategoryChange = useCallback(
    (index: number, category: IngredientCategoryValue | null) => {
      setResolutions((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], newCategory: category }
        return updated
      })
    },
    []
  )

  /**
   * 確定ボタン押下時の処理
   */
  const handleConfirm = async () => {
    // バリデーション
    for (const resolution of resolutions) {
      if (resolution.mode === "existing" && !resolution.existingId) {
        toast.error(`「${resolution.original.name}」の既存材料を選択してください`)
        return
      }
      if (resolution.mode === "new" && !resolution.newName.trim()) {
        toast.error(`「${resolution.original.name}」の材料名を入力してください`)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const resolved: ResolvedIngredient[] = []

      for (const resolution of resolutions) {
        if (resolution.mode === "existing") {
          // 既存材料を使用
          resolved.push({
            originalName: resolution.original.name,
            ingredientId: resolution.existingId!,
            amount: resolution.original.amount,
            isNewlyCreated: false,
          })
        } else {
          // 新規作成
          const result = await createIngredient({
            name: resolution.newName.trim(),
            name_en: resolution.original.name_en,
            category: resolution.newCategory,
          })

          if (!result.success) {
            toast.error(result.message)
            setIsSubmitting(false)
            return
          }

          resolved.push({
            originalName: resolution.original.name,
            ingredientId: result.data.id,
            amount: resolution.original.amount,
            isNewlyCreated: true,
          })
        }
      }

      // 成功通知
      const newCount = resolved.filter((r) => r.isNewlyCreated).length
      if (newCount > 0) {
        toast.success(`${newCount}件の材料を新規登録しました`)
      }

      onComplete(resolved)
      onOpenChange(false)
    } catch (error) {
      console.error("材料の処理に失敗しました:", error)
      toast.error("材料の処理に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-2xl">
        <DialogHeader className="space-y-3">
          {/* ヘッダーアイコンとタイトル */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400">
              <BottleIcon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                未登録材料の処理
              </DialogTitle>
              <DialogDescription className="text-sm">
                {unmatchedIngredients.length}件の材料が見つかりませんでした
              </DialogDescription>
            </div>
          </div>

          {/* 説明文 */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            以下の材料が材料マスタに見つかりませんでした。
            既存の材料を選択するか、新規登録してください。
          </p>
        </DialogHeader>

        {/* 材料リスト（スクロール可能） */}
        <div className="my-2 max-h-[50vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            {resolutions.map((resolution, index) => (
              <IngredientResolutionItem
                key={resolution.original.name}
                resolution={resolution}
                index={index}
                masterIngredients={masterIngredients}
                onModeChange={handleModeChange}
                onExistingIdChange={handleExistingIdChange}
                onNewNameChange={handleNewNameChange}
                onNewCategoryChange={handleNewCategoryChange}
                disabled={isSubmitting}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="min-w-[100px] bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
          >
            {isSubmitting ? (
              <>
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                処理中...
              </>
            ) : (
              <>
                <CheckIcon className="mr-2 h-4 w-4" />
                確定
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// 個別材料の解決UI
// ============================================

interface IngredientResolutionItemProps {
  resolution: IngredientResolution
  index: number
  masterIngredients: Ingredient[]
  onModeChange: (index: number, mode: ResolutionMode) => void
  onExistingIdChange: (index: number, id: string) => void
  onNewNameChange: (index: number, name: string) => void
  onNewCategoryChange: (index: number, category: IngredientCategoryValue | null) => void
  disabled: boolean
}

/**
 * 個別の未登録材料の解決UI
 */
function IngredientResolutionItem({
  resolution,
  index,
  masterIngredients,
  onModeChange,
  onExistingIdChange,
  onNewNameChange,
  onNewCategoryChange,
  disabled,
}: IngredientResolutionItemProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/50 p-4 transition-all hover:border-border">
      {/* 材料名ヘッダー */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">
            {resolution.original.name}
          </span>
          {resolution.original.amount && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {resolution.original.amount}
            </span>
          )}
        </div>
        {resolution.original.category && (
          <span className="text-xs text-muted-foreground">
            {INGREDIENT_CATEGORY_OPTIONS.find(
              (opt) => opt.value === resolution.original.category
            )?.label || resolution.original.category}
          </span>
        )}
      </div>

      {/* 選択モード */}
      <RadioGroup
        value={resolution.mode}
        onValueChange={(value) => onModeChange(index, value as ResolutionMode)}
        className="space-y-3"
        disabled={disabled}
      >
        {/* 既存材料を使用 */}
        <div className="flex items-start gap-3">
          <div className="flex h-9 items-center">
            <RadioGroupItem value="existing" id={`existing-${index}`} />
          </div>
          <div className="flex-1 space-y-2">
            <Label
              htmlFor={`existing-${index}`}
              className="cursor-pointer text-sm font-normal"
            >
              既存材料を使用
            </Label>
            {resolution.mode === "existing" && (
              <Select
                value={resolution.existingId || ""}
                onValueChange={(value) => onExistingIdChange(index, value)}
                disabled={disabled}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="材料を選択..." />
                </SelectTrigger>
                <SelectContent>
                  {masterIngredients.map((ingredient) => (
                    <SelectItem key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                      {ingredient.category && (
                        <span className="ml-2 text-muted-foreground">
                          (
                          {INGREDIENT_CATEGORY_OPTIONS.find(
                            (opt) => opt.value === ingredient.category
                          )?.label || ingredient.category}
                          )
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* 新規登録 */}
        <div className="flex items-start gap-3">
          <div className="flex h-9 items-center">
            <RadioGroupItem value="new" id={`new-${index}`} />
          </div>
          <div className="flex-1 space-y-2">
            <Label
              htmlFor={`new-${index}`}
              className="cursor-pointer text-sm font-normal"
            >
              新規登録
            </Label>
            {resolution.mode === "new" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">名前</Label>
                  <Input
                    value={resolution.newName}
                    onChange={(e) => onNewNameChange(index, e.target.value)}
                    placeholder="材料名"
                    className="h-9"
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    カテゴリ
                  </Label>
                  <Select
                    value={resolution.newCategory || "__unset__"}
                    onValueChange={(value) =>
                      onNewCategoryChange(
                        index,
                        value === "__unset__"
                          ? null
                          : (value as IngredientCategoryValue)
                      )
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="カテゴリを選択..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__unset__">未設定</SelectItem>
                      {INGREDIENT_CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}
