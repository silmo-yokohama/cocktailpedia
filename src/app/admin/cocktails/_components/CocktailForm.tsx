"use client"

import { useState, useCallback } from "react"
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
import type { Cocktail, Ingredient, RecipeItem } from "@/types"
import {
  BASE_OPTIONS,
  TECHNIQUE_OPTIONS,
  GLASS_OPTIONS,
  TEMPERATURE_OPTIONS,
  CARBONATION_OPTIONS,
  COLOR_OPTIONS,
} from "@/types/constants"
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
 * カクテル登録/編集フォームコンポーネント
 */
export function CocktailForm({
  cocktail,
  recipeItems = [],
  ingredients,
}: CocktailFormProps) {
  const router = useRouter()
  const isEdit = !!cocktail

  // フォーム状態
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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
      color: ((formData.get("color") as string) === "__unset__" ? undefined : formData.get("color") as string) || undefined,
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 基本情報セクション */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">基本情報</h2>

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
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              </div>
            )}
          </div>

          {/* ドロップゾーン */}
          <div
            {...getRootProps()}
            className={`flex-1 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
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
            <Select name="base" defaultValue={cocktail?.base || "gin"} required>
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
              defaultValue={cocktail?.technique || "build"}
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
              defaultValue={cocktail?.glass || "highball"}
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
              defaultValue={cocktail?.temperature || "ice"}
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
              defaultValue={cocktail?.carbonation || "weak"}
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
            <Select name="color" defaultValue={cocktail?.color || "__unset__"}>
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
          ingredients={ingredients}
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
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting
            ? isEdit
              ? "更新中..."
              : "登録中..."
            : isEdit
              ? "更新する"
              : "登録する"}
        </Button>
      </div>
    </form>
  )
}
