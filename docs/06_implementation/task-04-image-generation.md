# タスク: 画像自動生成機能

| 項目 | 内容 |
|------|------|
| ステータス | ドラフト |
| 作成日 | 2026-01-31 |
| 前提タスク | task-01-gemini-api（完了していること） |

---

## 実装範囲

Nano Banana（gemini-2.5-flash-image）で画像を生成し、Supabase Storageに保存する。

- 「画像を自動生成」ボタンの追加
- Nano Banana API呼び出し
- 画像のデコード・Storage保存
- image_urlフィールドへの自動入力

---

## 修正対象ファイル

### `src/app/admin/cocktails/_components/CocktailForm.tsx`

**追加する機能:**

1. **画像自動生成ボタン**
   - 画像アップロード欄に配置
   - ラベル: 「画像を自動生成」

2. **ボタン押下時の処理**
   ```
   1. フォームから情報取得（カクテル名、グラス、色）
   2. ローディング状態ON
   3. generateCocktailImageAction() 呼び出し
   4. 成功:
      - プレビュー表示
      - image_url にURLセット
   5. エラー:
      - トースト表示（画像なしで続行可能）
   6. ローディング状態OFF
   ```

**UI配置:**

```
画像:
┌───────────────────────────────┐
│                               │
│      [画像プレビュー]          │
│                               │
└───────────────────────────────┘
[ファイルを選択] [画像を自動生成 ✨]
                     ↑ ここにボタン追加
```

---

### `src/lib/gemini.ts`

**追加する処理（Task 1で作成済みなら確認のみ）:**

```typescript
export async function generateCocktailImage(
  name: string,
  glass: string,
  color: string
): Promise<string>  // Base64エンコードされた画像データ
```

**プロンプト:**
```
A professional photograph of {name} cocktail.
Served in a {glass} glass.
Color: {color}.
Beautiful lighting, high quality, appetizing, bar setting.
```

---

### `src/actions/ai-cocktail.ts`

**追加する処理:**

```typescript
export async function generateCocktailImageAction(
  name: string,
  glass: string,
  color: string
): Promise<ActionResult<string>>  // Storage URL
```

**処理フロー:**
1. `generateCocktailImage()` で画像生成
2. Base64デコード
3. Supabase Storageにアップロード（`cocktails/images/{slug}.png`）
4. 公開URLを取得
5. URLを返却

---

## 達成すべきこと

- [ ] 「画像を自動生成」ボタンが画像アップロード欄に追加されている
- [ ] ボタン押下で画像が生成される
- [ ] 生成された画像がSupabase Storageに保存される
- [ ] プレビューに画像が表示される
- [ ] image_urlにStorageのURLがセットされる
- [ ] エラー時もカクテル登録は続行可能

---

## 守るべき制約

- `docs/04_guidelines/coding_standards.md` に従う
- 画像は1024x1024px, PNG形式
- Storage保存先: `cocktails/images/{slug}.png`
- 画像生成失敗時はエラートーストを表示し、画像なしで続行可能とする

> [!IMPORTANT]
> **このタスクにはUI実装が含まれます。**
> 必ず `Frontend-design` スキルを読み込み、スキルの指示に従って実装してください。
> これは必須です。

---

## 参照ドキュメント

| ドキュメント | 用途 |
|-------------|------|
| 追加要件 | docs/02_requirements/additional_ai_recipe_input.md（6節 画像生成） |
| Task 1 | docs/06_implementation/task-01-gemini-api.md |

---

## Git運用

- 開発は `develop` ブランチをベースとする
- 作業ブランチ: `feature/task-04-image-generation`
- 全ての実装が完了し、施主が確認したらPRを作成
- PRは `develop` へマージ

---

## 判断に迷ったら

- 自分で判断せず、選択肢を提示して施主に確認

---

## 動作確認方法

1. `/admin/cocktails/new` にアクセス
2. カクテル情報を入力（AI自動入力 or 手動）
3. 「画像を自動生成」ボタンをクリック
4. 以下を確認:
   - ローディング表示が出る
   - 画像が生成されプレビューに表示される
   - Supabase Storageに画像が保存されている
5. カクテルを登録し、公開画面で画像が表示されることを確認

---

## 作業完了後チェック

- [ ] 全ての変更をコミット
- [ ] 施主に完了報告（動作確認結果を添えて）
- [ ] 施主確認後、PRを作成
