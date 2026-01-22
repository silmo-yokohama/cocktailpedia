# タスク2: 共通基盤 - 詳細実行計画

## 概要

| 項目 | 内容 |
|------|------|
| タスク名 | 共通基盤 |
| 目的 | 型定義と共通コンポーネントを作成し、実装の基盤を整える |
| 前提タスク | タスク1（環境構築） ✅ 完了 |
| 作業ブランチ | `feature/task-02-common-foundation` |
| ベースブランチ | `develop` |

---

## 作業開始前チェック

- [ ] `develop` ブランチが最新であることを確認
- [ ] 未コミットの変更がないことを確認
- [ ] 作業用ブランチを作成: `git checkout -b feature/task-02-common-foundation develop`

---

## 達成すべきこと

### 1. 型定義の作成

#### 1.1 データモデル型 (`src/types/`)

**ファイル**: `src/types/database.ts`

| 型名 | 説明 | 必須フィールド |
|------|------|---------------|
| `Cocktail` | カクテル情報 | id, name, slug, base, technique, glass, alcohol_percentage, temperature, carbonation |
| `Ingredient` | 材料情報 | id, name, category, is_searchable |
| `RecipeItem` | レシピ項目 | id, cocktail_id, ingredient_id, amount, sort_order |
| `SiteSetting` | サイト設定 | id, key, value |

> [!TIP]
> 基本設計書 `docs/05_design/basic_design.md` の「1.2 テーブル定義」を参照

#### 1.2 選択肢定義 (`src/types/constants.ts`)

基本設計書の「1.5 選択肢定義」に基づいて定義：

| 定数名 | 説明 | 値の例 |
|--------|------|-------|
| `BASE_OPTIONS` | ベース（基酒） | gin, vodka, rum, tequila... |
| `TECHNIQUE_OPTIONS` | 技法 | shake, stir, build, blend |
| `GLASS_OPTIONS` | グラスの種類 | cocktail, rocks, highball... |
| `TEMPERATURE_OPTIONS` | 冷たさ | ice, hot, crushed_ice, frozen |
| `CARBONATION_OPTIONS` | 炭酸 | strong, weak, none |
| `COLOR_OPTIONS` | カラー | red, orange, yellow... |
| `INGREDIENT_CATEGORY_OPTIONS` | 材料カテゴリ | spirits, liqueur, juice... |
| `ALCOHOL_STRENGTH_OPTIONS` | 度数区分（検索用） | none, low, medium, high |

**形式**: 値と表示名のペア

```typescript
export const BASE_OPTIONS = [
  { value: "gin", label: "ジン" },
  { value: "vodka", label: "ウォッカ" },
  // ...
] as const
```

#### 1.3 検索フィルター型 (`src/types/search.ts`)

| 型名 | 説明 |
|------|------|
| `SearchFilters` | 検索条件（フリーワード、ベース、材料、技法、度数、グラス、冷たさ、炭酸、カラー） |
| `SortOption` | ソート順（name_asc, name_desc, view_count_desc, bookmark_count_desc） |

---

### 2. 共通コンポーネントの作成

#### 2.1 ディレクトリ構成

```
src/components/
├── ui/                  # shadcn/ui（既存）
├── atoms/               # 自作の最小単位
│   └── Logo/
├── molecules/           # 機能単位
│   ├── CocktailCard/
│   ├── FavoriteButton/
│   └── SortSelect/
└── organisms/           # 独立したUI構成要素
    ├── Header/
    └── Footer/
```

#### 2.2 Header（Organism）

**パス**: `src/components/organisms/Header/`

| 要素 | 説明 |
|------|------|
| ロゴ | クリックでトップへ遷移 |
| ベース別ナビ | 主要ベースへのリンク（ジン、ウォッカ、ラム、テキーラ、ウイスキー、その他） |
| お気に入りアイコン | `/favorites` へ遷移 |
| 検索アイコン | 検索モーダルを開く（モーダル自体はタスク4で実装） |

**レスポンシブ対応**:
- モバイル: ハンバーガーメニュー or 縮小版
- PC: 全要素を表示

#### 2.3 Footer（Organism）

**パス**: `src/components/organisms/Footer/`

| 要素 | 説明 |
|------|------|
| コピーライト | `© 2026 Cocktailpedia` |
| サイト説明リンク | `/about` へ遷移 |

#### 2.4 CocktailCard（Molecule）

**パス**: `src/components/molecules/CocktailCard/`

| 要素 | 説明 |
|------|------|
| 画像 | カクテル画像（なければプレースホルダー） |
| 名前 | カクテル名 |
| ベースバッジ | ベース（基酒）を表示 |
| お気に入りボタン | クリックでお気に入り登録/解除 |

**Props**:
```typescript
interface CocktailCardProps {
  cocktail: Cocktail
  isFavorite?: boolean
  onFavoriteToggle?: (id: string) => void
}
```

**備考**: カード全体がクリック可能でカクテル詳細へ遷移

#### 2.5 FavoriteButton（Molecule）

**パス**: `src/components/molecules/FavoriteButton/`

| 状態 | 表示 |
|------|------|
| 未登録 | ハートアウトライン（lucide-react: Heart） |
| 登録済み | ハート塗りつぶし（lucide-react: HeartFilled or 色変更） |

#### 2.6 SortSelect（Molecule）

**パス**: `src/components/molecules/SortSelect/`

| オプション | 説明 |
|-----------|------|
| 名前順（昇順） | A→Z、あ→ん |
| 名前順（降順） | Z→A、ん→あ |
| 閲覧数順 | view_count DESC |
| ブックマーク順 | bookmark_count DESC |

---

### 3. レイアウトの設定

#### 3.1 ルートレイアウト (`app/layout.tsx`)

| 項目 | 内容 |
|------|------|
| フォント | Google Fonts（CCにおまかせ、日本語対応） |
| テーマ | ダークモードをデフォルト |
| メタデータ | title, description, og:image 等 |
| Header/Footer | 公開画面に共通で表示 |
| GA4 | 準備のみ（タグIDは後で設定） |

#### 3.2 Google Analytics 4 準備

環境変数 `NEXT_PUBLIC_GA_MEASUREMENT_ID` でタグIDを受け取れるように準備。
値が未設定の場合はGAスクリプトを読み込まない。

`.env.local.example` に追記：
```
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 参照ドキュメント

| ドキュメント | 参照内容 |
|-------------|---------|
| [基本設計書](docs/05_design/basic_design.md) | 1.2 テーブル定義、1.5 選択肢定義 |
| [画面要件書](docs/02_requirements/screens.md) | 共通コンポーネント、デザイン方針 |
| [コンポーネント設計](docs/04_guidelines/component_architecture.md) | Atomic Design、ディレクトリ構成 |
| [コーディング規約](docs/04_guidelines/coding_standards.md) | 命名規則、ファイル構成 |

---

## 作業完了後チェック

- [ ] 全ての型定義が作成されている
- [ ] Header, Footer が正常に表示される
- [ ] CocktailCard のモック表示ができる（ダミーデータで確認）
- [ ] SortSelect が動作する
- [ ] レスポンシブ対応（モバイル/PC）
- [ ] ダークテーマが適用されている
- [ ] ESLint / Prettier エラーがない
- [ ] `npm run build` が成功する
- [ ] 全ての変更をコミット

---

## 完了報告

作業完了後、以下を施主に報告：

1. 作成したファイル一覧
2. 動作確認方法
3. 判断に迷った点があれば報告

施主が確認後、`develop` へのPRを作成。

---

## 判断に迷ったら

- **デザインの詳細**: 画面要件書のデザイン方針（クラシック・レトロ）に沿っていればCCの裁量でOK
- **コンポーネント分割**: 迷ったらMoleculeに分類
- **その他**: 選択肢を提示して施主に確認

---

## 備考

- 作成日: 2026/01/23
- 作成者: AG
- ステータス: CC作業依頼用
