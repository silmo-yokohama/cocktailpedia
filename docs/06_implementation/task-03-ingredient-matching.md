# タスク: 材料マッチングUI

| 項目 | 内容 |
|------|------|
| ステータス | ドラフト |
| 作成日 | 2026-01-31 |
| 前提タスク | task-02-cocktail-form（完了していること） |

---

## 実装範囲

未登録材料がある場合に表示するダイアログを作成する。

- 未登録材料ダイアログコンポーネント
- 既存材料選択 / 新規登録の切り替えUI
- 材料マスタへの追加処理
- レシピ項目への自動紐付け

---

## 新規作成ファイル

### `src/app/admin/cocktails/_components/UnmatchedIngredientsDialog.tsx`

**Props:**

```typescript
interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  unmatchedIngredients: IngredientInput[]  // AIが返した未登録材料
  masterIngredients: Ingredient[]          // 材料マスタ全件
  onComplete: (resolved: ResolvedIngredient[]) => void
}

interface ResolvedIngredient {
  originalName: string        // AIが返した名前
  ingredientId: string        // 紐付けする材料ID
  amount: string | null       // 分量
  isNewlyCreated: boolean     // 新規作成したか
}
```

**UI構成:**

```
┌─────────────────────────────────────────────────┐
│ 未登録材料の処理                            [×] │
├─────────────────────────────────────────────────┤
│                                                 │
│ 以下の材料が材料マスタに見つかりませんでした。  │
│ 既存の材料を選択するか、新規登録してください。  │
│                                                 │
│ ─────────────────────────────────────────────── │
│                                                 │
│ 【ドライジン】                                  │
│   ○ 既存材料を使用: [ジン ▼]                   │
│   ● 新規登録                                    │
│       名前: [ドライジン____]                    │
│       カテゴリ: [spirits ▼]                    │
│                                                 │
│ ─────────────────────────────────────────────── │
│                                                 │
│ 【ホワイトキュラソー】                          │
│   ○ 既存材料を使用: [─ 選択 ─ ▼]              │
│   ● 新規登録                                    │
│       名前: [ホワイトキュラソー]                │
│       カテゴリ: [liqueur ▼]                    │
│                                                 │
│ ─────────────────────────────────────────────── │
│                                                 │
│                              [キャンセル] [確定] │
└─────────────────────────────────────────────────┘
```

**動作:**

1. デフォルトは「新規登録」を選択状態
2. 名前・カテゴリはAIレスポンスの値を初期値として設定
3. 「既存材料を使用」選択時はドロップダウンが有効に
4. 「確定」押下で:
   - 新規登録選択 → 材料マスタにINSERT
   - 既存材料選択 → そのIDを使用
5. 完了後、`onComplete` で結果を返す

---

### `src/actions/ingredients.ts`

**実装内容:**

```typescript
"use server"

// 材料を新規作成
export async function createIngredient(data: {
  name: string
  name_en?: string | null
  category?: string | null
}): Promise<ActionResult<Ingredient>>
```

---

## 修正対象ファイル

### `src/app/admin/cocktails/_components/CocktailForm.tsx`

**追加する処理:**

1. `UnmatchedIngredientsDialog` の表示制御（state追加）
2. ダイアログ完了後、レシピ項目を更新

```typescript
// ダイアログの状態
const [showUnmatchedDialog, setShowUnmatchedDialog] = useState(false)
const [unmatchedIngredients, setUnmatchedIngredients] = useState<IngredientInput[]>([])

// AI自動入力後の処理
const handleAIComplete = (matchResult: MatchResult) => {
  // matched → レシピ項目に追加
  addMatchedToRecipe(matchResult.matched)
  
  // unmatched → ダイアログ表示
  if (matchResult.unmatched.length > 0) {
    setUnmatchedIngredients(matchResult.unmatched)
    setShowUnmatchedDialog(true)
  }
}

// ダイアログ完了後
const handleUnmatchedComplete = (resolved: ResolvedIngredient[]) => {
  addResolvedToRecipe(resolved)
  setShowUnmatchedDialog(false)
}
```

---

## 達成すべきこと

- [ ] `UnmatchedIngredientsDialog` が作成されている
- [ ] ダイアログで既存材料選択 / 新規登録を切り替えられる
- [ ] 新規登録時、材料マスタにINSERTされる
- [ ] 確定後、レシピ項目に材料が正しく追加される
- [ ] CocktailFormと連携して動作する

---

## 守るべき制約

- `docs/04_guidelines/coding_standards.md` に従う
- `docs/04_guidelines/component_architecture.md` に従う
- shadcn/ui の `Dialog`, `RadioGroup`, `Select` を使用

> [!IMPORTANT]
> **このタスクにはUI実装が含まれます。**
> 必ず `Frontend-design` スキルを読み込み、スキルの指示に従って実装してください。
> これは必須です。

---

## 参照ドキュメント

| ドキュメント | 用途 |
|-------------|------|
| 追加要件 | docs/02_requirements/additional_ai_recipe_input.md（5.3節 未登録材料の処理UI） |
| Task 2 | docs/06_implementation/task-02-cocktail-form.md |

---

## Git運用

- 開発は `develop` ブランチをベースとする
- 作業ブランチ: `feature/task-03-ingredient-matching`
- 全ての実装が完了し、施主が確認したらPRを作成
- PRは `develop` へマージ

---

## 判断に迷ったら

- 自分で判断せず、選択肢を提示して施主に確認

---

## 動作確認方法

1. `/admin/cocktails/new` にアクセス
2. カクテル名「マルガリータ」でAI自動入力を実行
3. 未登録材料があれば、ダイアログが表示されることを確認
4. 以下をテスト:
   - 既存材料選択 → 確定 → レシピに追加される
   - 新規登録 → 確定 → 材料マスタに追加 & レシピに追加される
5. 全ての未登録材料を処理後、レシピ項目に正しく反映されていることを確認

---

## 作業完了後チェック

- [ ] 全ての変更をコミット
- [ ] 施主に完了報告（動作確認結果を添えて）
- [ ] 施主確認後、PRを作成
