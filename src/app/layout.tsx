import type { Metadata, Viewport } from "next"
import { Noto_Sans_JP, Playfair_Display } from "next/font/google"

import { Footer } from "@/components/organisms/Footer"
import { Header } from "@/components/organisms/Header"
import { AppProviders } from "@/components/providers/AppProviders"

import "./globals.css"

/**
 * 日本語対応のサンセリフフォント
 * 本文やUIテキストに使用
 */
const notoSansJP = Noto_Sans_JP({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
})

/**
 * エレガントなセリフ体のディスプレイフォント
 * ロゴやタイトルに使用
 */
const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

/**
 * サイトのメタデータ
 */
export const metadata: Metadata = {
  title: {
    default: "Cocktailpedia - カクテル図鑑",
    template: "%s | Cocktailpedia",
  },
  description:
    "多彩な条件でお気に入りのカクテルを探せる、カクテル検索サービス。300種類以上のカクテルをベース、技法、度数、グラスなどから検索できます。",
  keywords: [
    "カクテル",
    "カクテルレシピ",
    "カクテル図鑑",
    "バー",
    "お酒",
    "レシピ検索",
    "cocktail",
  ],
  authors: [{ name: "Cocktailpedia" }],
  creator: "Cocktailpedia",
  publisher: "Cocktailpedia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://cocktailpedia.example.com"
  ),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "Cocktailpedia",
    title: "Cocktailpedia - カクテル図鑑",
    description:
      "多彩な条件でお気に入りのカクテルを探せる、カクテル検索サービス",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cocktailpedia - カクテル図鑑",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocktailpedia - カクテル図鑑",
    description:
      "多彩な条件でお気に入りのカクテルを探せる、カクテル検索サービス",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

/**
 * ビューポート設定
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1612" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

/**
 * ルートレイアウト
 * 全ページ共通のレイアウトを定義
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="dark">
      <body
        className={`${notoSansJP.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        {/* Google Analytics 4（条件付き読み込み） */}
        <GoogleAnalytics />

        {/* プロバイダーとページ構造 */}
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  )
}

/**
 * Google Analytics 4 コンポーネント
 * 環境変数が設定されている場合のみスクリプトを読み込む
 */
function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  // 環境変数が未設定の場合は何も表示しない
  if (!measurementId) {
    return null
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
        }}
      />
    </>
  )
}
