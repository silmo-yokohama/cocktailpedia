"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { toast } from "sonner"
import {
  createCocktail,
  updateCocktail,
  uploadCocktailImage,
  type CocktailFormData,
} from "@/actions/admin"
import { fetchCocktailRecipe, generateCocktailImageAction } from "@/actions/ai-cocktail"
import type {
  Cocktail,
  Ingredient,
  RecipeItem,
  AIIngredientInput,
  ResolvedIngredient,
} from "@/types"
import {
  BASE_OPTIONS,
  TECHNIQUE_OPTIONS,
  GLASS_OPTIONS,
  TEMPERATURE_OPTIONS,
  CARBONATION_OPTIONS,
  COLOR_OPTIONS,
} from "@/types/constants"
import {
  matchIngredients,
  createRecipeItemsFromMatchResult,
} from "@/lib/ingredient-matcher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RecipeItemsField } from "./RecipeItemsField"
import { UnmatchedIngredientsDialog } from "./UnmatchedIngredientsDialog"

/** デフォルト画像のURL */
const DEFAULT_IMAGE = "/images/cocktail-placeholder.svg"

/** フォームのプロパティ */
interface CocktailFormProps {
  /** 編集時のカクテル情報（新規登録時はnull） */
  cocktail?: Cocktail | null
  /** 編集時のレシピ情報 */
  recipeItems?: (RecipeItem & { ingredient: Ingredient })[]
  /** 材料一覧（選択肢用） */
  ingredients: Ingredient[]
}

/**
 * AI自動入力ボタンのスピナーアイコン
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
 * AI自動入力ボタンのスパークルアイコン
 */
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
        clipRule="evenodd"
      />
    </svg>
  )
}

/**
 * カクテル登録/編集フォームコンポーネント
 */
export function CocktailForm({
  cocktail,
  recipeItems = [],
  ingredients,
}: CocktailFormProps) {
  const router = useRouter()
  const isEdit = !!cocktail
  const formRef = useRef<HTMLFormElement>(null)

  // フォーム状態
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isImageGenerating, setIsImageGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState(cocktail?.image_url || "")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // レシピ項目の状態
  const [currentRecipeItems, setCurrentRecipeItems] = useState<
    { ingredient_id: string; amount: string; sort_order: number }[]
  >(
    recipeItems.map((item, index) => ({
      ingredient_id: item.ingredient_id,
      amount: item.amount || "",
      sort_order: index,
    }))
  )

  // セレクトボックスの状態（制御コンポーネント化）
  const [selectValues, setSelectValues] = useState({
    base: cocktail?.base || "gin",
    technique: cocktail?.technique || "build",
    glass: cocktail?.glass || "highball",
    temperature: cocktail?.temperature || "ice",
    carbonation: cocktail?.carbonation || "weak",
    color: cocktail?.color || "__unset__",
  })

  // 未登録材料の状態
  const [unmatchedIngredients, setUnmatchedIngredients] = useState<
    AIIngredientInput[]
  >([])
  // 未登録材料ダイアログの表示状態
  const [showUnmatchedDialog, setShowUnmatchedDialog] = useState(false)
  // 材料リストの状態（ダイアログ完了後に更新するため）
  const [currentIngredients, setCurrentIngredients] = useState<Ingredient[]>(ingredients)

  /**
   * 画像ドロップ時の処理
   */
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // プレビュー表示
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // アップロード
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadCocktailImage(formData)

    if (result.success) {
      setImageUrl(result.url)
      toast.success("画像をアップロードしました")
    } else {
      toast.error(result.error)
      setImagePreview(null)
    }

    setIsUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  })

  /**
   * AI自動入力ボタン押下時の処理
   */
  const handleAiAutoFill = async () => {
    if (!formRef.current) return

    // カクテル名を取得
    const nameInput = formRef.current.querySelector<HTMLInputElement>(
      'input[name="name"]'
    )
    const cocktailName = nameInput?.value?.trim()

    // バリデーション
    if (!cocktailName) {
      toast.error("カクテル名を入力してください")
      nameInput?.focus()
      return
    }

    setIsAiLoading(true)

    try {
      // API呼び出し
      const result = await fetchCocktailRecipe(cocktailName)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      const recipe = result.data

      // 各フィールドに値をセット
      setFormValue("name", recipe.name)
      setFormValue("name_en", recipe.name_en || "")
      setFormValue("name_alias", recipe.name_alias || "")
      setFormValue("slug", recipe.slug)
      setFormValue("description", recipe.description || "")
      setFormValue("cocktail_word", recipe.cocktail_word || "")
      setFormValue("alcohol_percentage", recipe.alcohol_percentage.toString())
      setFormValue("variation_text", recipe.variation_text || "")

      // セレクトボックスの値をセット（制御コンポーネントなのでstateを更新）
      setSelectValues({
        base: recipe.base,
        technique: recipe.technique,
        glass: recipe.glass,
        temperature: recipe.temperature,
        carbonation: recipe.carbonation,
        color: recipe.color || "__unset__",
      })

      // 材料マッチング処理
      const matchResult = matchIngredients(recipe.ingredients, currentIngredients)

      // マッチした材料をレシピ項目に追加
      const newRecipeItems = createRecipeItemsFromMatchResult(matchResult)
      setCurrentRecipeItems(newRecipeItems)

      // 未登録材料を保存
      setUnmatchedIngredients(matchResult.unmatched)

      // 結果をトーストで通知＆ダイアログ表示
      if (matchResult.unmatched.length > 0) {
        toast.info(
          `カクテル情報を入力しました。${matchResult.unmatched.length}件の未登録材料を処理してください。`,
          {
            duration: 4000,
          }
        )
        // 未登録材料ダイアログを表示
        setShowUnmatchedDialog(true)
      } else {
        toast.success("カクテル情報を自動入力しました")
      }
    } catch (error) {
      console.error("AI自動入力エラー:", error)
      toast.error("エラーが発生しました。時間を置いて再度お試しください")
    } finally {
      setIsAiLoading(false)
    }
  }

  /**
   * 画像自動生成ボタン押下時の処理
   */
  const handleImageGeneration = async () => {
    if (!formRef.current) return

    // 必要な情報を取得
    const nameInput = formRef.current.querySelector<HTMLInputElement>(
      'input[name="name"]'
    )
    const slugInput = formRef.current.querySelector<HTMLInputElement>(
      'input[name="slug"]'
    )
    const glassInput = formRef.current.querySelector<HTMLInputElement>(
      'input[name="glass"]'
    )
    const colorInput = formRef.current.querySelector<HTMLInputElement>(
      'input[name="color"]'
    )

    const name = nameInput?.value?.trim()
    const slug = slugInput?.value?.trim()
    const glass = glassInput?.value || "highball"
    const color = colorInput?.value || "clear"

    // バリデーション
    if (!name) {
      toast.error("画像を生成するにはカクテル名を入力してください")
      nameInput?.focus()
      return
    }

    if (!slug) {
      toast.error("画像を生成するにはURLスラッグを入力してください")
      slugInput?.focus()
      return
    }

    // 色が未設定の場合はクリアにする
    const effectiveColor = color === "__unset__" ? "clear" : color

    setIsImageGenerating(true)

    try {
      // API呼び出し
      const result = await generateCocktailImageAction(
        name,
        slug,
        glass,
        effectiveColor
      )

      if (!result.success) {
        toast.error(result.message)
        return
      }

      // 成功時：プレビューとURLをセット
      setImagePreview(result.data)
      setImageUrl(result.data)
      toast.success("画像を生成しました")
    } catch (error) {
      console.error("画像生成エラー:", error)
      toast.error("画像の生成に失敗しました。画像なしで続行できます")
    } finally {
      setIsImageGenerating(false)
    }
  }

  /**
   * フォームのinput要素に値をセットするヘルパー
   */
  const setFormValue = (name: string, value: string) => {
    if (!formRef.current) return
    const input = formRef.current.querySelector<
      HTMLInputElement | HTMLTextAreaElement
    >(`[name="${name}"]`)
    if (input) {
      input.value = value
    }
  }

  /**
   * フォーム送信
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    // フォームデータを構築
    const data: CocktailFormData = {
      name: formData.get("name") as string,
      name_en: (formData.get("name_en") as string) || undefined,
      name_alias: (formData.get("name_alias") as string) || undefined,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || undefined,
      cocktail_word: (formData.get("cocktail_word") as string) || undefined,
      base: formData.get("base") as string,
      technique: formData.get("technique") as string,
      glass: formData.get("glass") as string,
      alcohol_percentage: Number(formData.get("alcohol_percentage")),
      temperature: formData.get("temperature") as string,
      carbonation: formData.get("carbonation") as string,
      color:
        (formData.get("color") as string) === "__unset__"
          ? undefined
          : (formData.get("color") as string) || undefined,
      variation_text: (formData.get("variation_text") as string) || undefined,
      image_url: imageUrl || undefined,
      recipeItems: currentRecipeItems.filter((item) => item.ingredient_id),
    }

    // バリデーション
    if (!data.name) {
      toast.error("カクテル名を入力してください")
      setIsSubmitting(false)
      return
    }
    if (!data.slug) {
      toast.error("URLスラッグを入力してください")
      setIsSubmitting(false)
      return
    }
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
      toast.error("URLスラッグは英小文字、数字、ハイフンのみ使用できます")
      setIsSubmitting(false)
      return
    }

    // 保存
    const result = isEdit
      ? await updateCocktail(cocktail!.id, data)
      : await createCocktail(data)

    if (result.success) {
      toast.success(isEdit ? "カクテルを更新しました" : "カクテルを登録しました")
      router.push("/admin/cocktails")
      router.refresh()
    } else {
      toast.error(result.error)
    }

    setIsSubmitting(false)
  }

  /**
   * 未登録材料ダイアログの完了処理
   * 解決済みの材料をレシピ項目に追加し、材料リストを更新
   */
  const handleUnmatchedComplete = useCallback(
    (resolved: ResolvedIngredient[]) => {
      // 解決済み材料をレシピ項目に追加
      const newItems = resolved.map((item, index) => ({
        ingredient_id: item.ingredientId,
        amount: item.amount || "",
        sort_order: currentRecipeItems.length + index,
      }))

      setCurrentRecipeItems((prev) => [...prev, ...newItems])

      // 新規作成された材料を材料リストに追加（選択肢用）
      const newIngredients = resolved
        .filter((r) => r.isNewlyCreated)
        .map((r) => ({
          id: r.ingredientId,
          name: r.originalName,
          name_en: null,
          category: null,
          is_searchable: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))

      if (newIngredients.length > 0) {
        setCurrentIngredients((prev) => [...prev, ...newIngredients])
      }

      // 未登録材料リストをクリア
      setUnmatchedIngredients([])
      setShowUnmatchedDialog(false)
    },
    [currentRecipeItems.length]
  )

  /**
   * URLスラッグを自動生成
   */
  const generateSlug = (name: string) => {
    // カタカナをひらがなに変換
    const hiragana = name.replace(/[\u30a1-\u30f6]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) - 0x60)
    )
    // 英数字とハイフン以外を削除してローマ字に（簡易版）
    // 実際のプロジェクトではより高度な変換ライブラリを使用
    return hiragana
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {/* 基本情報セクション */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">基本情報</h2>

          {/* AI自動入力ボタン（新規登録時のみ表示） */}
          {!isEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAiAutoFill}
              disabled={isAiLoading || isSubmitting}
              className="group relative overflow-hidden border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5 text-amber-700 transition-all hover:border-amber-500/50 hover:from-amber-500/10 hover:to-orange-500/10 hover:text-amber-600 dark:border-amber-400/30 dark:text-amber-400 dark:hover:border-amber-400/50 dark:hover:text-amber-300"
            >
              {/* グラデーションのアニメーション背景 */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-500/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {isAiLoading ? (
                <>
                  <SpinnerIcon className="h-4 w-4 animate-spin" />
                  <span>読み込み中...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  <span>AIで自動入力</span>
                </>
              )}
            </Button>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* カクテル名 */}
          <div className="space-y-2">
            <Label htmlFor="name">
              カクテル名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={cocktail?.name}
              placeholder="ジントニック"
              required
              onBlur={(e) => {
                if (!isEdit) {
                  const slugInput = document.getElementById(
                    "slug"
                  ) as HTMLInputElement
                  if (slugInput && !slugInput.value) {
                    // 何も入力されていない場合のみ自動生成
                    slugInput.value = generateSlug(e.target.value)
                  }
                }
              }}
            />
            {!isEdit && (
              <p className="text-xs text-muted-foreground">
                カクテル名を入力して「AIで自動入力」ボタンを押すと、レシピ情報を自動取得できます
              </p>
            )}
          </div>

          {/* URLスラッグ */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              URLスラッグ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={cocktail?.slug}
              placeholder="gin-tonic"
              required
              pattern="[a-z0-9-]+"
            />
            <p className="text-xs text-muted-foreground">
              英小文字、数字、ハイフンのみ使用可能
            </p>
          </div>

          {/* 英語名 */}
          <div className="space-y-2">
            <Label htmlFor="name_en">英語名</Label>
            <Input
              id="name_en"
              name="name_en"
              defaultValue={cocktail?.name_en || ""}
              placeholder="Gin and Tonic"
            />
          </div>

          {/* 別名 */}
          <div className="space-y-2">
            <Label htmlFor="name_alias">別名</Label>
            <Input
              id="name_alias"
              name="name_alias"
              defaultValue={cocktail?.name_alias || ""}
              placeholder="ジントニ"
            />
          </div>
        </div>
      </section>

      {/* 未登録材料の警告表示 */}
      {unmatchedIngredients.length > 0 && (
        <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3.5 w-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  未登録の材料があります
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUnmatchedDialog(true)}
                  className="h-7 border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400"
                >
                  処理する
                </Button>
              </div>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                以下の材料は材料マスタに登録されていないため、レシピに追加されていません。
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {unmatchedIngredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-1 text-xs text-amber-700 dark:text-amber-400"
                  >
                    {ingredient.name}
                    {ingredient.amount && (
                      <span className="ml-1 text-amber-600/60 dark:text-amber-400/60">
                        ({ingredient.amount})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 画像セクション */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">画像</h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* プレビュー */}
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={imagePreview || imageUrl || DEFAULT_IMAGE}
              alt="プレビュー"
              fill
              className="object-cover"
            />
            {/* アップロード中またはAI画像生成中のオーバーレイ */}
            {(isUploading || isImageGenerating) && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              </div>
            )}
          </div>

          {/* ドロップゾーンとボタンのコンテナ */}
          <div className="flex flex-1 flex-col gap-3">
            {/* ドロップゾーン */}
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                isDragActive
                  ? "border-gold bg-gold/5"
                  : "border-border hover:border-gold/50 hover:bg-muted/50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 text-muted-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              {isDragActive ? (
                <p className="text-sm text-gold">ここにドロップ</p>
              ) : (
                <>
                  <p className="text-sm text-foreground">
                    クリックまたはドラッグ＆ドロップで画像を選択
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPEG, PNG, WebP（最大5MB）
                  </p>
                </>
              )}
            </div>

            {/* AI画像生成ボタン（新規登録時のみ表示） */}
            {!isEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={handleImageGeneration}
                disabled={isImageGenerating || isUploading || isSubmitting}
                className="group relative w-full overflow-hidden border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 text-emerald-700 transition-all hover:border-emerald-500/50 hover:from-emerald-500/10 hover:to-teal-500/10 hover:text-emerald-600 dark:border-emerald-400/30 dark:text-emerald-400 dark:hover:border-emerald-400/50 dark:hover:text-emerald-300"
              >
                {/* グラデーションのアニメーション背景 */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {isImageGenerating ? (
                  <>
                    <SpinnerIcon className="h-4 w-4 animate-spin" />
                    <span>画像を生成中...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4" />
                    <span>AIで画像を自動生成</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 属性セクション */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">属性</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* ベース */}
          <div className="space-y-2">
            <Label htmlFor="base">
              ベース <span className="text-destructive">*</span>
            </Label>
            <Select
              name="base"
              value={selectValues.base}
              onValueChange={(value) =>
                setSelectValues((prev) => ({ ...prev, base: value }))
              }
              required
            >
              <SelectTrigger id="base">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {BASE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 技法 */}
          <div className="space-y-2">
            <Label htmlFor="technique">
              技法 <span className="text-destructive">*</span>
            </Label>
            <Select
              name="technique"
              value={selectValues.technique}
              onValueChange={(value) =>
                setSelectValues((prev) => ({ ...prev, technique: value }))
              }
              required
            >
              <SelectTrigger id="technique">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {TECHNIQUE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* グラス */}
          <div className="space-y-2">
            <Label htmlFor="glass">
              グラス <span className="text-destructive">*</span>
            </Label>
            <Select
              name="glass"
              value={selectValues.glass}
              onValueChange={(value) =>
                setSelectValues((prev) => ({ ...prev, glass: value }))
              }
              required
            >
              <SelectTrigger id="glass">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {GLASS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 度数 */}
          <div className="space-y-2">
            <Label htmlFor="alcohol_percentage">
              度数（%） <span className="text-destructive">*</span>
            </Label>
            <Input
              id="alcohol_percentage"
              name="alcohol_percentage"
              type="number"
              min={0}
              max={100}
              defaultValue={cocktail?.alcohol_percentage ?? 10}
              required
            />
          </div>

          {/* 冷たさ */}
          <div className="space-y-2">
            <Label htmlFor="temperature">
              冷たさ <span className="text-destructive">*</span>
            </Label>
            <Select
              name="temperature"
              value={selectValues.temperature}
              onValueChange={(value) =>
                setSelectValues((prev) => ({ ...prev, temperature: value }))
              }
              required
            >
              <SelectTrigger id="temperature">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {TEMPERATURE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 炭酸 */}
          <div className="space-y-2">
            <Label htmlFor="carbonation">
              炭酸 <span className="text-destructive">*</span>
            </Label>
            <Select
              name="carbonation"
              value={selectValues.carbonation}
              onValueChange={(value) =>
                setSelectValues((prev) => ({ ...prev, carbonation: value }))
              }
              required
            >
              <SelectTrigger id="carbonation">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {CARBONATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* カラー */}
          <div className="space-y-2">
            <Label htmlFor="color">カラー</Label>
            <Select
              name="color"
              value={selectValues.color}
              onValueChange={(value) =>
                setSelectValues((prev) => ({ ...prev, color: value }))
              }
            >
              <SelectTrigger id="color">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__unset__">未設定</SelectItem>
                {COLOR_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* レシピセクション */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">レシピ（材料）</h2>
        <RecipeItemsField
          ingredients={currentIngredients}
          items={currentRecipeItems}
          onChange={setCurrentRecipeItems}
        />
      </section>

      {/* 説明セクション */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">説明・その他</h2>

        <div className="space-y-6">
          {/* 説明 */}
          <div className="space-y-2">
            <Label htmlFor="description">説明・由来・歴史</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={cocktail?.description || ""}
              placeholder="カクテルの由来や歴史などを記述..."
              rows={4}
            />
          </div>

          {/* カクテル言葉 */}
          <div className="space-y-2">
            <Label htmlFor="cocktail_word">カクテル言葉</Label>
            <Input
              id="cocktail_word"
              name="cocktail_word"
              defaultValue={cocktail?.cocktail_word || ""}
              placeholder="あなたが魅力的だから"
            />
          </div>

          {/* バリエーション */}
          <div className="space-y-2">
            <Label htmlFor="variation_text">バリエーション</Label>
            <Input
              id="variation_text"
              name="variation_text"
              defaultValue={cocktail?.variation_text || ""}
              placeholder="ギブソン, ダーティマティーニ"
            />
            <p className="text-xs text-muted-foreground">
              カンマ区切りで複数入力可能
            </p>
          </div>
        </div>
      </section>

      {/* 送信ボタン */}
      <div className="flex items-center justify-end gap-4 border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading || isAiLoading || isImageGenerating}>
          {isSubmitting
            ? isEdit
              ? "更新中..."
              : "登録中..."
            : isEdit
              ? "更新する"
              : "登録する"}
        </Button>
      </div>

      {/* 未登録材料処理ダイアログ */}
      <UnmatchedIngredientsDialog
        open={showUnmatchedDialog}
        onOpenChange={setShowUnmatchedDialog}
        unmatchedIngredients={unmatchedIngredients}
        masterIngredients={currentIngredients}
        onComplete={handleUnmatchedComplete}
      />
    </form>
  )
}
