"use client"

import { ArrowLeft, Droplets, Flame, Sparkles, Wine } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"

import { incrementViewCount } from "@/actions/cocktails"
import { Badge } from "@/components/atoms/Badge"
import { CornerDecoration } from "@/components/atoms/CornerDecoration"
import { SectionTitle } from "@/components/atoms/SectionTitle"
import { FavoriteButton } from "@/components/molecules/FavoriteButton"
import { InfoCard } from "@/components/molecules/InfoCard"
import { useFavorites, useRecentlyViewed } from "@/hooks"
import type { CocktailWithRecipe } from "@/types"
import {
  BASE_OPTIONS,
  CARBONATION_OPTIONS,
  COLOR_OPTIONS,
  getLabel,
  GLASS_OPTIONS,
  TECHNIQUE_OPTIONS,
  TEMPERATURE_OPTIONS,
} from "@/types"

/** デフォルトのプレースホルダー画像 */
const PLACEHOLDER_IMAGE = "/images/cocktail-placeholder.svg"

interface CocktailDetailClientProps {
  /** カクテル詳細データ */
  cocktail: CocktailWithRecipe
}

/**
 * カクテル詳細のクライアントコンポーネント
 * 閲覧カウント、履歴記録、お気に入り機能を管理
 */
export function CocktailDetailClient({ cocktail }: CocktailDetailClientProps) {
  const { isFavorite, toggleFavorite, isLoaded: isFavoritesLoaded } = useFavorites()
  const { addToHistory, isInHistory, isLoaded: isHistoryLoaded } = useRecentlyViewed()

  // 処理済みフラグ（無限ループ防止）
  const processedRef = useRef(false)

  // マウント時に閲覧カウントを更新し、履歴に追加
  useEffect(() => {
    // 履歴の読み込みが完了するまで待機
    if (!isHistoryLoaded) return

    // 既に処理済みの場合はスキップ
    if (processedRef.current) return
    processedRef.current = true

    // 履歴に含まれていない場合のみ閲覧カウントを更新（重複加算の抑止）
    if (!isInHistory(cocktail.id)) {
      incrementViewCount(cocktail.id).catch(console.error)
    }

    // 閲覧履歴に追加（既存の場合は先頭に移動）
    addToHistory(cocktail.id)
  }, [cocktail.id, addToHistory, isInHistory, isHistoryLoaded])

  // ラベルの取得
  const baseLabel = getLabel(BASE_OPTIONS, cocktail.base)
  const techniqueLabel = getLabel(TECHNIQUE_OPTIONS, cocktail.technique)
  const glassLabel = getLabel(GLASS_OPTIONS, cocktail.glass)
  const temperatureLabel = getLabel(TEMPERATURE_OPTIONS, cocktail.temperature)
  const carbonationLabel = getLabel(CARBONATION_OPTIONS, cocktail.carbonation)
  const colorLabel = cocktail.color ? getLabel(COLOR_OPTIONS, cocktail.color) : null

  return (
    <article>
      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-gold transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>一覧に戻る</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* 画像エリア */}
        <div className="relative">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={cocktail.image_url || PLACEHOLDER_IMAGE}
              alt={cocktail.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />

            {/* Art Deco風フレーム */}
            <div className="absolute inset-0 pointer-events-none">
              {/* コーナー装飾 */}
              <div className="absolute top-4 left-4">
                <CornerDecoration />
              </div>
              <div className="absolute top-4 right-4 -scale-x-100">
                <CornerDecoration />
              </div>
              <div className="absolute bottom-4 left-4 -scale-y-100">
                <CornerDecoration />
              </div>
              <div className="absolute bottom-4 right-4 scale-[-1]">
                <CornerDecoration />
              </div>
            </div>
          </div>

          {/* お気に入りボタン */}
          {isFavoritesLoaded && (
            <div className="absolute top-6 right-6">
              <FavoriteButton
                isFavorite={isFavorite(cocktail.id)}
                onToggle={() => toggleFavorite(cocktail.id)}
                size="lg"
                ariaLabel={
                  isFavorite(cocktail.id)
                    ? `${cocktail.name}をお気に入りから削除`
                    : `${cocktail.name}をお気に入りに追加`
                }
              />
            </div>
          )}
        </div>

        {/* 詳細情報エリア */}
        <div className="flex flex-col">
          {/* カクテル名 */}
          <header className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold text-foreground mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {cocktail.name}
            </h1>
            {cocktail.name_en && (
              <p className="text-lg text-foreground/60">{cocktail.name_en}</p>
            )}
            {cocktail.name_alias && (
              <p className="text-sm text-gold/70 mt-1">別名: {cocktail.name_alias}</p>
            )}
          </header>

          {/* 基本情報バッジ */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge icon={<Wine className="w-4 h-4" />} label="ベース" value={baseLabel} />
            <Badge icon={<Sparkles className="w-4 h-4" />} label="技法" value={techniqueLabel} />
            <Badge label="グラス" value={glassLabel} />
          </div>

          {/* レシピ（材料と分量） */}
          {cocktail.recipe_items.length > 0 && (
            <section className="mb-8">
              <SectionTitle>レシピ</SectionTitle>
              <ul className="space-y-3">
                {cocktail.recipe_items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-border/20"
                  >
                    <span className="text-foreground">{item.ingredient.name}</span>
                    <span className="text-foreground/60 text-sm">{item.amount || "—"}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 特徴 */}
          <section className="mb-8">
            <SectionTitle>特徴</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InfoCard
                icon={<Flame className="w-5 h-5" />}
                label="度数"
                value={`${cocktail.alcohol_percentage}%`}
              />
              <InfoCard
                icon={<Droplets className="w-5 h-5" />}
                label="冷たさ"
                value={temperatureLabel}
              />
              <InfoCard label="炭酸" value={carbonationLabel} />
              {colorLabel && <InfoCard label="カラー" value={colorLabel} />}
            </div>
          </section>

          {/* カクテル言葉 */}
          {cocktail.cocktail_word && (
            <section className="mb-8">
              <blockquote className="relative pl-6 py-2 border-l-2 border-gold/40">
                <p className="text-lg italic text-foreground/80">
                  「{cocktail.cocktail_word}」
                </p>
                <cite className="text-sm text-gold/60 not-italic mt-2 block">
                  — カクテル言葉
                </cite>
              </blockquote>
            </section>
          )}

          {/* 説明・由来・歴史 */}
          {cocktail.description && (
            <section className="mb-8">
              <SectionTitle>由来・歴史</SectionTitle>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {cocktail.description}
              </p>
            </section>
          )}

          {/* バリエーション */}
          {cocktail.variation_text && (
            <section className="mb-8">
              <SectionTitle>バリエーション</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {cocktail.variation_text.split(",").map((variation) => (
                  <span
                    key={variation.trim()}
                    className="px-3 py-1 text-sm rounded-full bg-gold/10 text-gold/80 border border-gold/20"
                  >
                    {variation.trim()}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  )
}
