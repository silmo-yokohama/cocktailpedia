# タスク4: 公開画面（基本） - 詳細実行計画

## 概要

| 項目 | 内容 |
|------|------|
| タスク名 | 公開画面（基本） |
| 目的 | コア機能である一覧・詳細・検索を実装する |
| 前提タスク | タスク2（共通基盤）✅、タスク3（データベース）✅ |
| 作業ブランチ | `feature/task-04-public-pages` |
| ベースブランチ | `develop` |

---

## 作業開始前チェック

- [ ] `develop` ブランチが最新であることを確認
- [ ] 未コミットの変更がないことを確認
- [ ] 作業用ブランチを作成: `git checkout -b feature/task-04-public-pages develop`
- [ ] Supabaseにテーブルが作成されていることを確認

---

## 達成すべきこと

### 1. トップページ（S-001）

**URL**: `/`

#### 1.1 カクテル一覧表示（F-001）

| 項目 | 仕様 |
|------|------|
| 表示方式 | **無限スクロール** |
| 1回の読み込み件数 | 60件 |
| カード表示 | CocktailCard コンポーネントを使用 |
| データ取得 | Server Component で初回60件取得 → スクロールで追加読み込み |

**実装ポイント**:
- 初回データは Server Component で取得（SEO対応）
- 追加読み込みは Client Component + Server Action
- Intersection Observer で無限スクロール実装

#### 1.2 ソート機能（F-007）

| ソート | 説明 | デフォルト |
|--------|------|------------|
| 登録順 | created_at DESC | ○ |
| 名前順 | name ASC | |
| ブックマーク数順 | bookmark_count DESC | |
| 閲覧回数順 | view_count DESC | |

**実装ポイント**:
- SortSelect コンポーネントを使用
- URLクエリパラメータでソート状態を保持（例: `?sort=name_asc`）
- ソート変更時はリストをリセットして再取得

#### 1.3 最近見たカクテル（F-013）

| 項目 | 仕様 |
|------|------|
| 表示位置 | カクテル一覧の上部 |
| 表示件数 | 最大10件（新しい順） |
| データ保存 | localStorage |
| 表示条件 | 履歴がある場合のみ表示 |

**実装ポイント**:
- Client Component で localStorage から取得
- カクテルIDリストを保存 → IDからデータを取得して表示
- 詳細ページ閲覧時に履歴を更新

---

### 2. カクテル詳細ページ（S-002）

**URL**: `/cocktails/[slug]`

#### 2.1 詳細情報表示（F-002）

表示する情報:

| 項目 | 説明 |
|------|------|
| 画像 | image_url（なければプレースホルダー） |
| カクテル名 | name, name_en, name_alias |
| ベース | base（表示名に変換） |
| 材料と分量 | recipe_items + ingredients を JOIN |
| 技法 | technique |
| グラスの種類 | glass |
| 度数（推定） | alcohol_percentage |
| 冷たさ | temperature |
| 炭酸 | carbonation |
| カラー | color |
| 由来・歴史 | description |
| カクテル言葉 | cocktail_word |
| バリエーション | variation_text |

#### 2.2 閲覧カウント

| 項目 | 仕様 |
|------|------|
| タイミング | ページ表示時（クライアントサイドでマウント時） |
| 処理 | Server Action で view_count を +1 |
| 注意 | 同一ユーザーのリロードによる水増しは許容 |

**実装ポイント**:
- useEffect で Server Action を呼び出し
- 非同期で実行（ページ表示をブロックしない）

#### 2.3 閲覧履歴記録

| 項目 | 仕様 |
|------|------|
| 保存先 | localStorage |
| 保存形式 | カクテルIDの配列（最大10件） |
| 重複処理 | 既存のIDは先頭に移動 |

#### 2.4 お気に入り登録/解除（F-005）

| 項目 | 仕様 |
|------|------|
| ボタン | FavoriteButton コンポーネント |
| 保存先 | localStorage |
| サーバー連携 | bookmark_count を +1/-1（Server Action） |
| エラー処理 | サーバーエラー時もローカル保存は成功させる |

#### 2.5 関連カクテル表示（F-012）

| 項目 | 仕様 |
|------|------|
| 表示件数 | 最大5件 |
| 並び順 | ブックマーク数が多い順 |
| 計算ロジック | ①同じベース + 材料2つ以上共通、または ②材料3つ以上共通 |
| 表示条件 | 関連カクテルがある場合のみ表示 |

**参照**: 基本設計書「1.6 関連カクテル計算ロジック」

---

### 3. ベース別一覧（S-003）

**URL**: `/filter/[base]`

| 項目 | 仕様 |
|------|------|
| パラメータ | base（gin, vodka, rum, tequila, whiskey, brandy, liqueur, wine, beer, non_alcoholic, other） |
| 表示内容 | 指定ベースのカクテル一覧 |
| ソート | トップページと同様（F-007） |
| 無効なベース | 404エラーページを表示 |

**実装ポイント**:
- generateStaticParams でベース一覧を事前生成（SSG）
- ヘッダーナビからの遷移用

---

### 4. 検索モーダル（S-007）

**表示方法**: ヘッダーの検索アイコンクリックで表示

#### 4.1 検索条件（F-003）

| 条件 | 種別 | 複数選択 |
|------|------|----------|
| フリーワード | テキスト入力 | - |
| ベース | 単一選択 | × |
| 材料 | 複数選択 | ○（AND条件） |
| 技法 | 単一選択 | × |
| 度数 | 単一選択 | × |
| グラスの種類 | 単一選択（アイコン表示） | × |
| 冷たさ | 単一選択 | × |
| 炭酸 | 単一選択 | × |
| カラー | 単一選択 | × |

**実装ポイント**:
- モーダルコンポーネントを作成
- フォーム状態は useState で管理
- 検索実行でトップページに遷移（URLクエリパラメータに条件を付与）
- ベース別一覧から開いた場合、ベースは選択済み状態

#### 4.2 グラスアイコン

グラスの種類はアイコンで表示。
アイコンはCCの裁量で選定（lucide-react、または自作SVG）。

---

### 5. Server Actions

#### 5.1 カクテル一覧取得

```typescript
// src/actions/cocktails.ts
async function getCocktails(params: {
  offset: number
  limit: number
  sort: SortOption
  filters?: SearchFilters
}): Promise<Cocktail[]>
```

#### 5.2 カクテル詳細取得

```typescript
async function getCocktailBySlug(slug: string): Promise<CocktailWithRecipe | null>
```

#### 5.3 閲覧カウント更新

```typescript
async function incrementViewCount(id: string): Promise<void>
```

#### 5.4 ブックマーク数更新

```typescript
async function updateBookmarkCount(id: string, increment: boolean): Promise<void>
```

#### 5.5 関連カクテル取得

```typescript
async function getRelatedCocktails(cocktailId: string): Promise<Cocktail[]>
```

---

## 参照ドキュメント

| ドキュメント | 参照内容 |
|-------------|---------|
| [機能要件書](docs/02_requirements/functional.md) | F-001〜F-004, F-007, F-012, F-013 |
| [画面要件書](docs/02_requirements/screens.md) | S-001〜S-003, S-007 |
| [基本設計書](docs/05_design/basic_design.md) | 1.6 関連カクテル計算ロジック、3.2 データフロー |
| [コンポーネント設計](docs/04_guidelines/component_architecture.md) | ディレクトリ構成 |

---

## 作業完了後チェック

### トップページ
- [ ] カクテル一覧が表示される
- [ ] 無限スクロールで追加読み込みできる
- [ ] ソート変更が動作する
- [ ] 最近見たカクテルが表示される（履歴がある場合）

### 詳細ページ
- [ ] カクテル詳細情報が正しく表示される
- [ ] 閲覧カウントが更新される
- [ ] 閲覧履歴がlocalStorageに保存される
- [ ] お気に入り登録/解除が動作する
- [ ] 関連カクテルが表示される

### ベース別一覧
- [ ] `/filter/gin` 等でフィルタリングされた一覧が表示される
- [ ] 無効なベースで404が表示される

### 検索モーダル
- [ ] モーダルが開閉する
- [ ] 各検索条件が入力できる
- [ ] 検索実行で絞り込まれた結果が表示される

### その他
- [ ] レスポンシブ対応（モバイル/PC）
- [ ] ESLint / Prettier エラーがない
- [ ] `npm run build` が成功する
- [ ] 全ての変更をコミット

---

## 完了報告

作業完了後、以下を施主に報告：

1. 実装した画面・機能の一覧
2. 動作確認方法
3. 判断に迷った点があれば報告

施主が確認後、`develop` へのPRを作成。

---

## 判断に迷ったら

- **無限スクロールの実装方法**: Intersection Observer 等の詳細はCCの裁量
- **検索モーダルのデザイン**: 画面要件書のデザイン方針に沿っていればOK
- **グラスアイコン**: lucide-react にあれば使用、なければ自作またはテキスト表示
- **その他**: 選択肢を提示して施主に確認

---

## 備考

- 作成日: 2026/01/23
- 作成者: AG
- ステータス: CC作業依頼用
