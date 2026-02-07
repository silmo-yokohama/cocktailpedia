# Cocktailpedia

**クラシックカクテルの検索・閲覧に特化した Web アプリケーション**

「種類が多すぎて覚えられない」カクテルの世界を、直感的な検索と美しい UI で楽しめるようにするプロダクトです。バーでスマートフォンから手軽に調べられることを想定し、モバイルファーストで設計されています。

---

## 主な機能

### カクテル検索・閲覧（公開画面）

| 機能 | 説明 |
|------|------|
| **カクテル一覧** | 無限スクロールで一覧表示（60件ずつ読み込み） |
| **多条件検索** | フリーワード、ベース（基酒）、材料、技法、度数、グラス、温度、炭酸、カラーなど多彩なフィルターで絞り込み |
| **ベース別フィルター** | ジン・ウォッカ・ラムなどベース酒ごとにワンタップで絞り込み |
| **カクテル詳細** | レシピ（材料・分量）、作り方、由来、AI 生成画像を表示 |
| **お気に入り登録** | ユーザー登録不要。localStorage に保存し、一覧画面で管理 |
| **ソート** | 名前順（昇順/降順）、閲覧数順、ブックマーク数順 |
| **関連カクテル** | ベースや材料の共通点から自動算出して表示 |
| **最近見たカクテル** | トップページに閲覧履歴を表示 |
| **閲覧数カウント** | 各カクテルの閲覧数を自動集計 |

### 管理画面

Basic 認証で保護された管理者専用画面です。

| 機能 | 説明 |
|------|------|
| **カクテル CRUD** | カクテルの新規登録・編集・削除。画像アップロード対応 |
| **材料マスタ管理** | 材料の登録・編集・削除。検索画面への表示フラグ制御 |
| **AI レシピ自動入力** | カクテル名を入力するだけで、AI がレシピ情報を自動生成してフォームに入力 |
| **AI 画像自動生成** | カクテルの情報（グラス、色など）から AI が画像を自動生成し、Supabase Storage にアップロード |

### AI 自動生成機能（Google Gemini API）

管理画面から利用できる AI 支援機能です。カクテルデータの効率的な登録を実現します。

#### レシピ自動入力

1. 管理画面でカクテル名を入力
2. Gemini API（`gemini-3-flash-preview`）がレシピ情報を JSON 形式で生成
3. **材料マッチング処理** により、AI が返した材料名を既存の材料マスタと自動照合
4. 未登録の材料がある場合は、その場で簡易登録ダイアログを表示
5. フォームに自動入力された内容をユーザーが確認・修正して登録

**生成される情報**: 名前、英語名、別名、ベース、技法、グラス、度数、温度、炭酸の有無、色、材料と分量、作り方の説明

#### 画像自動生成

1. カクテルの詳細情報（名前、グラスの種類、色、代表的なボトルなど）をプロンプトに組み込み
2. Gemini API（`gemini-3-pro-image-preview`）がカクテル画像を生成
3. 生成された画像を Supabase Storage に自動アップロード
4. カクテルデータに画像 URL を紐付け

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| **フレームワーク** | Next.js 16（App Router） |
| **言語** | TypeScript |
| **スタイリング** | Tailwind CSS 4 |
| **UI コンポーネント** | shadcn/ui（Radix UI ベース） |
| **データベース** | Supabase（PostgreSQL） |
| **ストレージ** | Supabase Storage |
| **AI** | Google Gemini API |
| **ホスティング** | Vercel（Hobby プラン） |
| **アクセス解析** | Google Analytics 4 |
| **認証（管理画面）** | Basic 認証（Next.js Middleware） |

---

## データベース設計

### テーブル構成

| テーブル | 説明 |
|---------|------|
| `cocktails` | カクテル情報（名前、ベース、技法、グラス、度数、色、画像 URL、閲覧数、ブックマーク数など） |
| `ingredients` | 材料マスタ（名前、英語名、カテゴリ、検索表示フラグ） |
| `recipe_items` | レシピ中間テーブル（カクテルと材料の紐付け、分量、表示順） |
| `site_settings` | サイト設定（key-value 形式） |

- Row Level Security（RLS）を有効化し、公開ページからは読み取りのみ許可
- 管理画面の書き込みは Basic 認証で制御

---

## 検索フィルター

以下の条件を組み合わせて AND 検索が可能です。

| フィルター | 選択肢の例 |
|-----------|-----------|
| フリーワード | 名前・別名・英語名に部分一致 |
| ベース（基酒） | ジン、ウォッカ、ラム、テキーラ、ウイスキー、ブランデー、リキュール、ワイン、ビール、ノンアルコール など |
| 材料 | 材料マスタから複数選択（AND 条件） |
| 技法 | シェイク、ステア、ビルド、ブレンド |
| 度数 | ノンアルコール、弱め、普通、強め |
| グラス | カクテルグラス、ロックグラス、ハイボールグラスなど 11 種類 |
| 温度 | アイス、ホット、クラッシュアイス、フローズン |
| 炭酸 | 強、弱、無 |
| カラー | 赤、オレンジ、黄、緑、青、紫、ピンク、茶、琥珀、白、透明、レイヤー（多層） |

---

## プロジェクト構成

```
cocktailpedia/
├── docs/                        # 設計・要件ドキュメント
│   ├── 02_requirements/         # 要件定義
│   ├── 03_tech_stack/           # 技術選定
│   ├── 04_guidelines/           # ガイドライン
│   ├── 05_design/               # 基本設計
│   └── 06_implementation/       # 実装計画・タスク
├── src/                         # Next.js プロジェクト
│   ├── app/                     # ページ・API ルート
│   │   ├── (public)/            # 公開ページ
│   │   ├── admin/               # 管理画面
│   │   └── api/                 # API Routes
│   ├── actions/                 # Server Actions
│   ├── components/              # UI コンポーネント（Atomic Design）
│   │   ├── atoms/               # 最小単位（Logo など）
│   │   ├── molecules/           # 機能単位（CocktailCard, FavoriteButton など）
│   │   ├── organisms/           # 独立した UI（Header, SearchModal など）
│   │   └── ui/                  # shadcn/ui
│   ├── hooks/                   # カスタムフック
│   ├── lib/                     # ユーティリティ・外部サービス連携
│   ├── types/                   # 型定義
│   └── supabase/migrations/     # DB マイグレーション
├── CLAUDE.md                    # CC（Claude Code）向け指示書
├── GEMINI.md                    # AG（Gemini）向け指示書
├── TAKUMI.md                    # 開発フレームワーク定義
└── PROJECT.md                   # プロジェクト状態管理
```

---

## セットアップ

### 前提条件

- Node.js 18 以上
- npm
- Supabase プロジェクト（無料枠で運用可能）
- Google Gemini API キー
- Vercel アカウント（デプロイ用）

### 環境変数

`.env.local` を作成し、以下を設定してください。

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# 管理者認証
ADMIN_USER=admin
ADMIN_PASSWORD=your-password

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXX
```

### インストール・起動

```bash
cd src
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。

### データベースの初期化

Supabase の SQL エディタで以下のマイグレーションを順番に実行してください。

1. `src/supabase/migrations/001_create_tables.sql` - テーブル作成
2. `src/supabase/migrations/002_create_indexes.sql` - インデックス作成
3. `src/supabase/migrations/003_enable_rls.sql` - RLS ポリシー設定
4. `src/supabase/migrations/004_initial_data.sql` - 初期データ投入

---

## デザインコンセプト

- **クラシック・レトロな雰囲気**: バーの世界観を表現したダークモードベースの UI
- **モバイルファースト**: バーでスマートフォンから閲覧することを想定
- **レスポンシブ対応**: PC でも快適に利用可能

---

## SEO・OGP 対応

- メタタグ（title, description）を各ページに設定
- OGP 画像対応（SNS シェア時にカクテル画像・タイトルを表示）
- サイトマップ自動生成
- Favicon 設定済み

---

## 運用コスト

すべて無料枠内で運用しています。

| サービス | 無料枠 | 使用量目安 |
|---------|--------|-----------|
| Vercel | 帯域 100GB/月 | 個人サイトなら十分 |
| Supabase DB | 500MB | 300 件のカクテルで約 10MB |
| Supabase Storage | 1GB | 300 件 × 2MB 画像で約 600MB |
| Google Gemini API | 日次制限あり | データ登録時のみ使用 |
| Google Analytics 4 | 無料 | - |

---

## 開発フレームワーク

本プロジェクトは **takumi フレームワーク** を採用しています。

- **AG（Architect/Generator）**: Gemini が要件定義・設計・ドキュメント生成を担当
- **CC（Claude Code）**: Claude がシニアエンジニアとして実装を担当
- **施主（プロダクトオーナー）**: 最終判断・レビューを行う

---

## ライセンス

個人プロジェクトです。
