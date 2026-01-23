import type { Metadata } from "next"
import { Info } from "lucide-react"
import ReactMarkdown from "react-markdown"

import { createServerClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

/**
 * サイト説明ページのメタデータ
 */
export const metadata: Metadata = {
  title: "このサイトについて",
  description: "Cocktailpediaについての説明ページです。",
}

/**
 * site_settingsテーブルからabout_contentを取得
 */
async function getAboutContent(): Promise<string | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "about_content")
    .single()

  if (error) {
    console.error("サイト説明の取得に失敗しました:", error)
    return null
  }

  return data?.value || null
}

/**
 * サイト説明ページ（S-005）
 * site_settingsからMarkdownコンテンツを取得して表示
 */
export default async function AboutPage() {
  const content = await getAboutContent()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダーセクション */}
      <section className="text-center py-12 md:py-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Info className="w-8 h-8 text-gold" />
          <h1
            className="text-3xl md:text-4xl font-bold text-gradient-gold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            このサイトについて
          </h1>
        </div>

        {/* Art Deco風の装飾 */}
        <div className="flex items-center justify-center mt-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <svg
            width="40"
            height="20"
            viewBox="0 0 40 20"
            fill="none"
            className="mx-4"
          >
            <path
              d="M20 0L27 10L20 20L13 10L20 0Z"
              fill="none"
              stroke="oklch(0.75 0.14 75)"
              strokeWidth="1"
              opacity="0.5"
            />
            <circle
              cx="20"
              cy="10"
              r="3"
              fill="oklch(0.75 0.14 75)"
              opacity="0.3"
            />
          </svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
      </section>

      {/* コンテンツセクション */}
      <section className="py-8 max-w-3xl mx-auto">
        {content ? (
          <article
            className={cn(
              // カード風のコンテナ
              "bg-card/50 rounded-lg border border-border/30 p-8 md:p-12",
              // Markdownコンテンツ用のスタイル
              "prose-container"
            )}
          >
            <ReactMarkdown
              components={{
                // 見出しのカスタマイズ
                h1: ({ children }) => (
                  <h1
                    className="text-2xl md:text-3xl font-bold text-foreground mb-6 pb-4 border-b border-gold/20"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3">
                    {children}
                  </h3>
                ),
                // 段落
                p: ({ children }) => (
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                // リスト
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-foreground/90 mb-4 space-y-2 pl-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-foreground/90 mb-4 space-y-2 pl-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-foreground/90">{children}</li>
                ),
                // リンク
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // 強調
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-foreground/80">{children}</em>
                ),
                // 引用
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gold/30 pl-4 py-2 my-4 bg-gold/5 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                // コードブロック
                code: ({ children }) => (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-gold">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                // 水平線
                hr: () => (
                  <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        ) : (
          // コンテンツがない場合のフォールバック
          <DefaultAboutContent />
        )}
      </section>
    </div>
  )
}

/**
 * デフォルトのサイト説明（site_settingsにデータがない場合）
 */
function DefaultAboutContent() {
  return (
    <article
      className={cn(
        "bg-card/50 rounded-lg border border-border/30 p-8 md:p-12",
        "text-center"
      )}
    >
      {/* ロゴ風のテキスト */}
      <h2
        className="text-2xl md:text-3xl font-bold text-gradient-gold mb-6"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Cocktailpedia
      </h2>

      <p className="text-foreground/90 leading-relaxed mb-6 max-w-xl mx-auto">
        Cocktailpediaは、多彩な条件でお気に入りのカクテルを探せるカクテル検索サービスです。
      </p>

      <p className="text-foreground/90 leading-relaxed mb-8 max-w-xl mx-auto">
        ベース、技法、度数、グラス、冷たさ、カラーなど、様々な条件から理想のカクテルを見つけることができます。
        気になるカクテルはお気に入りに登録して、いつでも確認できます。
      </p>

      {/* 装飾 */}
      <div className="flex items-center justify-center">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
        <svg
          width="24"
          height="12"
          viewBox="0 0 24 12"
          fill="none"
          className="mx-3"
        >
          <path
            d="M12 0L15 6L12 12L9 6L12 0Z"
            fill="oklch(0.75 0.14 75)"
            opacity="0.3"
          />
        </svg>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
      </div>
    </article>
  )
}
