# コーディング規約

## 概要

本ドキュメントは、Cocktailpedia プロジェクトのコーディングルールを定義する。

---

## 命名規則

### ファイル・ディレクトリ

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネントファイル | PascalCase | `CocktailCard.tsx` |
| ユーティリティ・関数 | camelCase | `formatDate.ts` |
| 定数ファイル | camelCase | `constants.ts` |
| ディレクトリ | kebab-case | `cocktail-detail/` |
| テストファイル | 対象ファイル名 + `.test` | `formatDate.test.ts` |

### コード内

| 対象 | 規則 | 例 |
|------|------|-----|
| 変数・関数 | camelCase | `cocktailName`, `fetchCocktails()` |
| 定数 | UPPER_SNAKE_CASE | `MAX_ITEMS_PER_PAGE` |
| 型・インターフェース | PascalCase | `Cocktail`, `SearchFilters` |
| コンポーネント | PascalCase | `CocktailCard` |
| カスタムフック | use + PascalCase | `useFavorites`, `useCocktailSearch` |
| イベントハンドラ | handle + 動詞 | `handleClick`, `handleSearch` |
| 真偽値 | is / has / can + 形容詞/動詞 | `isLoading`, `hasFavorites` |

### 命名で避けること

- 略語の多用（`usr` → `user`）
- 意味のない名前（`data`, `info`, `temp`）
- 否定形の真偽値（`isNotLoading` → `isLoading`）

---

## ディレクトリ構成

### 基本構成

```
project-root/
├── docs/               # ドキュメント
├── PROJECT.md          # プロジェクト管理
│
└── src/                # ソースコード（Next.jsプロジェクト）
    ├── app/            # App Router（ルーティング・ページ）
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── (public)/   # 公開ページ群
    │   ├── admin/      # 管理画面（Basic認証）
    │   └── api/        # API Routes
    ├── components/     # UIコンポーネント（Atomic Design）
    │   ├── ui/         # shadcn/ui（自動生成）
    │   ├── atoms/      # 自作の最小単位
    │   ├── molecules/  # 機能単位
    │   └── organisms/  # 独立したUI構成要素
    ├── hooks/          # カスタムフック
    ├── lib/            # ユーティリティ・ヘルパー
    │   ├── supabase/   # Supabase関連
    │   └── utils/      # フォーマット・変換関数
    └── types/          # 型定義
```

### 配置方針

| 種類 | 配置場所 |
|------|---------|
| ページコンポーネント | `app/` 配下 |
| 共通UIコンポーネント | `components/`（Atomic Design） |
| shadcn/ui | `components/ui/` |
| カスタムフック | `hooks/` |
| Supabase設定・関数 | `lib/supabase/` |
| ユーティリティ関数 | `lib/utils/` |
| 型定義 | `types/` |

---

## コンポーネント設計

### 分割の方針

| 分割する | 分割しない |
|---------|-----------|
| 再利用する可能性がある | 1箇所でしか使わない＆小さい |
| 100行を超える | 50行以下 |
| 独立したロジックを持つ | 親コンポーネントと密結合 |

### コンポーネントの構造

```tsx
// 1. import文
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. 型定義
type Props = {
  title: string
  onSubmit: (value: string) => void
}

// 3. コンポーネント本体
export function MyComponent({ title, onSubmit }: Props) {
  // 3-1. hooks
  const [value, setValue] = useState('')

  // 3-2. イベントハンドラ
  const handleSubmit = () => {
    onSubmit(value)
  }

  // 3-3. JSX
  return (
    <div>
      <h1>{title}</h1>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={handleSubmit}>送信</Button>
    </div>
  )
}
```

### 避けること

- 1コンポーネントに複数の責務を持たせる
- propsのバケツリレー（3階層以上）
- コンポーネント内でのデータフェッチ乱立

---

## 状態管理

| 状態の種類 | 管理方法 |
|-----------|---------|
| コンポーネントローカルな状態 | `useState` |
| 複数コンポーネントで共有する状態 | Context |
| サーバーから取得するデータ | Server Components / Server Actions |
| お気に入り（デバイス保存） | localStorage + useState |

---

## その他のルール

### コメント

- **書くべき**: 「なぜ」そうしたかの理由、複雑なロジックの説明
- **書かなくていい**: 「何を」しているかの説明（コードを読めばわかる）

### エラーハンドリング

- エラーは握りつぶさない
- ユーザーに適切なフィードバックを返す

### マジックナンバー・マジックストリング

意味のある数値・文字列は定数化する。

```tsx
// Bad
if (items.length > 10) { ... }

// Good
const MAX_DISPLAY_ITEMS = 10
if (items.length > MAX_DISPLAY_ITEMS) { ... }
```

---

## プロジェクト固有のルール

特になし（デフォルトルールに従う）

---

## 備考

- 作成日: 2026/01/21
- ステータス: 施主承認済み
- 詳細なコンポーネント配置は **component_architecture.md** を参照
