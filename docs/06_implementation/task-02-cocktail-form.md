# タスク: カクテルフォーム拡張

| 項目 | 内容 |
|------|------|
| ステータス | ドラフト |
| 作成日 | 2026-01-31 |
| 前提タスク | task-01-gemini-api（完了していること） |

---

## 実装範囲

既存のCocktailFormにAI自動入力機能を追加する。

- 「AIで自動入力」ボタンの追加
- ボタン押下時のAPI呼び出し・フォーム自動入力
- ローディング状態・エラー表示
- 材料マッチング処理（未登録材料の検出）

---

## 修正対象ファイル

### `src/app/admin/cocktails/_components/CocktailForm.tsx`

**追加する機能:**

1. **AI自動入力ボタン**
   - カクテル名入力欄の横に配置
   - アイコン: ✨ または 🤖
   - ラベル: 「AIで自動入力」

2. **ボタン押下時の処理**
   ```
   1. バリデーション（カクテル名が空でないか等）
   2. ローディング状態ON
   3. fetchCocktailRecipe(cocktailName) 呼び出し
   4. レスポンスが正常なら:
      - 各フィールドにセット（name_en, base, technique, glass, etc.）
      - 材料はマッチング処理へ
   5. エラーなら:
      - トースト表示
   6. ローディング状態OFF
   ```

3. **材料マッチング処理**
   ```typescript
   // AIレスポンスの材料と材料マスタを突き合わせ
   const matchResult = matchIngredients(aiIngredients, masterIngredients)
   // matchResult = { matched: [...], unmatched: [...] }
   
   // matched → レシピ項目に追加
   // unmatched → 未登録材料ダイアログへ（Task 3で実装）
   ```

4. **ローディング状態**
   - ボタンにスピナー表示
   - ボタンを無効化
   - フォーム全体をdisabledにはしない（他のフィールド編集は可能）

5. **エラー表示**
   - `toast.error()` でトースト表示
   - エラー種別に応じたメッセージ

---

## 新規作成ファイル

### `src/lib/ingredient-matcher.ts`

材料マッチングロジックを分離。

```typescript
interface MatchResult {
  matched: {
    aiIngredient: IngredientInput
    masterIngredient: Ingredient
  }[]
  unmatched: IngredientInput[]
}

export function matchIngredients(
  aiIngredients: IngredientInput[],
  masterIngredients: Ingredient[]
): MatchResult
```

---

## UI追加箇所

```
カクテル名: [________________] [AIで自動入力 ✨]
                                     ↑ ここにボタン追加

※ ボタン押下時は「読み込み中...」とスピナー表示
```

---

## 達成すべきこと

- [ ] CocktailFormに「AIで自動入力」ボタンが追加されている
- [ ] ボタン押下でカクテル情報が各フィールドに自動入力される
- [ ] 材料マッチング処理が動作し、matched/unmatchedが分類される
- [ ] ローディング状態が適切に表示される
- [ ] エラー時にトースト表示される
- [ ] 未登録材料がある場合、次タスク（ダイアログ）へ渡せる状態になっている

---

## 守るべき制約

- `docs/04_guidelines/coding_standards.md` に従う
- `docs/04_guidelines/component_architecture.md` に従う
- 既存のCocktailFormのロジックを壊さない

> [!IMPORTANT]
> **このタスクにはUI実装が含まれます。**
> 必ず `Frontend-design` スキルを読み込み、スキルの指示に従って実装してください。
> これは必須です。

---

## 参照ドキュメント

| ドキュメント | 用途 |
|-------------|------|
| 追加要件 | docs/02_requirements/additional_ai_recipe_input.md |
| 全体実装計画 | docs/04_design/implementation_plan_ai_recipe_input.md |
| Task 1 | docs/06_implementation/task-01-gemini-api.md |

---

## Git運用

- 開発は `develop` ブランチをベースとする
- 作業ブランチ: `feature/task-02-cocktail-form`
- 全ての実装が完了し、施主が確認したらPRを作成
- PRは `develop` へマージ

---

## 判断に迷ったら

- 自分で判断せず、選択肢を提示して施主に確認

---

## 動作確認方法

1. `/admin/cocktails/new` にアクセス
2. カクテル名「ジントニック」を入力
3. 「AIで自動入力」ボタンをクリック
4. 以下を確認:
   - ローディング表示が出る
   - 各フィールド（name_en, base, technique, glass等）に値が自動入力される
   - 材料がマッチングされる
5. 存在しないカクテル名でテスト → エラートースト表示

---

## 作業完了後チェック

- [ ] 全ての変更をコミット
- [ ] 施主に完了報告（動作確認結果を添えて）
- [ ] 施主確認後、PRを作成
