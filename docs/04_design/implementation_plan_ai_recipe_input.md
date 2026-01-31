# 実装計画: AI自動入力機能（カクテル登録画面）

**作成日**: 2026-01-31
**関連要件**: [additional_ai_recipe_input.md](file:///home/a/03.products/cocktailpedia/docs/02_requirements/additional_ai_recipe_input.md)

---

## 概要

カクテル登録画面にAI自動入力機能を追加する。以下の4つのタスクに分割して実装する。

---

## タスク一覧

| # | タスク名 | 概要 | 見積もり |
|---|---------|------|----------|
| 1 | Gemini API連携モジュール | API呼び出し、レスポンスパース、エラーハンドリング | 中 |
| 2 | カクテルフォーム拡張 | AI自動入力ボタン追加、フォーム自動入力 | 中 |
| 3 | 材料マッチングUI | 未登録材料の処理UI（既存選択/新規登録） | 大 |
| 4 | 画像自動生成機能 | Nano Banana連携、Storage保存 | 中 |

---

## Task 1: Gemini API連携モジュール

### 目的
Gemini APIとの通信を担当するモジュールを作成する。

### 対象ファイル

#### [NEW] [gemini.ts](file:///home/a/03.products/cocktailpedia/src/lib/gemini.ts)

API呼び出しを担当するユーティリティモジュール。

**実装内容:**
- `generateCocktailRecipe(cocktailName: string)` - テキスト生成API呼び出し
- `generateCocktailImage(name: string, glass: string, color: string)` - 画像生成API呼び出し
- プロンプトテンプレート定義
- レスポンスのJSONパース
- エラーハンドリング（リトライロジック含む）

**環境変数:**
- `GEMINI_API_KEY` を `.env.local` から読み込み

#### [NEW] [ai-cocktail.ts](file:///home/a/03.products/cocktailpedia/src/actions/ai-cocktail.ts)

Server Actionとしてフロントエンドから呼び出し可能な形式で提供。

**実装内容:**
- `fetchCocktailRecipe(cocktailName: string)` - カクテル情報取得Action
- `generateCocktailImageAction(...)` - 画像生成Action
- バリデーション（カクテル名の重複チェック等）

### 検証方法

- **手動検証**: 管理画面でAI自動入力ボタンを押して動作確認
- カクテル名入力 → ボタン押下 → コンソールでAPI呼び出し結果を確認

---

## Task 2: カクテルフォーム拡張

### 目的
既存のCocktailFormにAI自動入力ボタンを追加し、フォームを自動入力する。

### 対象ファイル

#### [MODIFY] [CocktailForm.tsx](file:///home/a/03.products/cocktailpedia/src/app/admin/cocktails/_components/CocktailForm.tsx)

**実装内容:**
- 「AIで自動入力」ボタンを追加（カクテル名入力欄の横）
- ボタン押下時の処理:
  1. カクテル名のバリデーション（空チェック、重複チェック）
  2. `fetchCocktailRecipe` Server Actionを呼び出し
  3. レスポンスをフォームの各フィールドにセット
  4. 材料はマッチング処理へ渡す
- ローディング状態の管理
- エラー時のトースト表示

**UI追加:**
- `<Button>` AI自動入力ボタン
- `<Spinner>` ローディング表示

### 検証方法

- **手動検証**:
  1. `/admin/cocktails/new` にアクセス
  2. カクテル名「ジントニック」を入力
  3. 「AIで自動入力」ボタンをクリック
  4. 各フィールド（name_en, base, technique, glass, etc.）に値が自動入力されることを確認

---

## Task 3: 材料マッチングUI

### 目的
AIが返した材料と材料マスタをマッチングし、未登録材料の処理UIを提供する。

### 対象ファイル

#### [NEW] [UnmatchedIngredientsDialog.tsx](file:///home/a/03.products/cocktailpedia/src/app/admin/cocktails/_components/UnmatchedIngredientsDialog.tsx)

未登録材料がある場合に表示するダイアログコンポーネント。

**実装内容:**
- 未登録材料ごとに以下を表示:
  - AIが返した材料名
  - ラジオボタン: 「既存材料を使用」「新規登録」
  - 既存材料ドロップダウン
  - 新規登録フォーム（名前、カテゴリ）
- 「確定」ボタンで処理を実行
- 新規登録時は材料マスタにINSERT

#### [MODIFY] [CocktailForm.tsx](file:///home/a/03.products/cocktailpedia/src/app/admin/cocktails/_components/CocktailForm.tsx)

**実装内容:**
- 材料マッチング処理を追加
- 未登録材料がある場合に `UnmatchedIngredientsDialog` を表示
- ダイアログ完了後、レシピ項目を更新

#### [NEW] [ingredients.ts](file:///home/a/03.products/cocktailpedia/src/actions/ingredients.ts)

**実装内容:**
- `createIngredient(data)` - 材料をマスタに追加するServer Action

### 検証方法

- **手動検証**:
  1. カクテル「マルガリータ」でAI自動入力を実行
  2. 「ホワイトキュラソー」等が未登録の場合、ダイアログが表示されることを確認
  3. 既存材料選択 or 新規登録を行い、確定ボタンで閉じる
  4. レシピ項目に材料が正しく追加されていることを確認

---

## Task 4: 画像自動生成機能

### 目的
Nano Bananaで画像を生成し、Supabase Storageに保存する。

### 対象ファイル

#### [MODIFY] [CocktailForm.tsx](file:///home/a/03.products/cocktailpedia/src/app/admin/cocktails/_components/CocktailForm.tsx)

**実装内容:**
- 画像アップロード欄に「画像を自動生成」ボタンを追加
- ボタン押下時の処理:
  1. フォームから情報取得（カクテル名、グラス、色）
  2. `generateCocktailImageAction` を呼び出し
  3. 生成画像をSupabase Storageにアップロード
  4. `image_url` フィールドにURLをセット
- ローディング状態の管理
- エラー時はトースト表示（画像なしで続行可能）

#### [MODIFY] [gemini.ts](file:///home/a/03.products/cocktailpedia/src/lib/gemini.ts)

**実装内容:**
- `generateCocktailImage` の実装（Task 1で作成済みの場合はスキップ）
- Base64レスポンスのデコード処理

#### [MODIFY] [ai-cocktail.ts](file:///home/a/03.products/cocktailpedia/src/actions/ai-cocktail.ts)

**実装内容:**
- 画像生成 → Storage保存 → URL取得の一連処理

### 検証方法

- **手動検証**:
  1. カクテル登録画面で「画像を自動生成」ボタンをクリック
  2. 画像が生成され、プレビューに表示されることを確認
  3. 登録後、公開画面で画像が正しく表示されることを確認

---

## 実装順序

1. **Task 1** → API連携の基盤を作る
2. **Task 2** → フォーム拡張でAI自動入力を動かす
3. **Task 3** → 材料マッチングUIを追加
4. **Task 4** → 画像生成機能を追加

---

## 注意事項

- **APIキー**: `GEMINI_API_KEY` は既に `.env.local` に設定済み
- **レート制限**: 無料枠の制限に注意（1日20〜250リクエスト程度）
- **リトライ**: エラー時は最大2回リトライ
- **セキュリティ**: Server ActionでAPI呼び出し（クライアントにキーを露出しない）

---

## 参考

- [追加要件ドキュメント](file:///home/a/03.products/cocktailpedia/docs/02_requirements/additional_ai_recipe_input.md)
- [既存CocktailForm](file:///home/a/03.products/cocktailpedia/src/app/admin/cocktails/_components/CocktailForm.tsx)
