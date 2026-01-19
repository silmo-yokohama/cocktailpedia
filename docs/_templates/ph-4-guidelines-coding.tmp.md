# コーディング規約（coding_standards.md）

## 概要

本ドキュメントは、プロジェクトのコーディングルールを定義する。
AG / CC / 施主の共通認識として機能させる。

---

## 命名規則

### ファイル・ディレクトリ

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネントファイル | PascalCase | `UserProfile.tsx` |
| ユーティリティ・関数 | camelCase | `formatDate.ts` |
| 定数ファイル | camelCase または UPPER_SNAKE | `constants.ts` |
| ディレクトリ | kebab-case | `user-profile/` |
| テストファイル | 対象ファイル名 + `.test` | `formatDate.test.ts` |

### コード内

| 対象 | 規則 | 例 |
|------|------|-----|
| 変数・関数 | camelCase | `userName`, `fetchUser()` |
| 定数 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 型・インターフェース | PascalCase | `User`, `ApiResponse` |
| コンポーネント | PascalCase | `UserProfile` |
| カスタムフック | use + PascalCase | `useAuth`, `useUserData` |
| イベントハンドラ | handle + 動詞 | `handleClick`, `handleSubmit` |
| 真偽値 | is / has / can + 形容詞/動詞 | `isLoading`, `hasError`, `canEdit` |

### 命名で避けること

- 略語の多用（`usr` → `user`）
- 意味のない名前（`data`, `info`, `temp`）
- 否定形の真偽値（`isNotLoading` → `isLoading`）

---

## ディレクトリ構成

### 基本構成（例：Next.js App Router）

```
src/
├── app/                    # ルーティング・ページ
│   ├── layout.tsx
│   ├── page.tsx
│   └── [feature]/
│       └── page.tsx
├── components/             # UIコンポーネント（※詳細は下記参照）
├── hooks/                  # カスタムフック
├── lib/                    # ユーティリティ・ヘルパー
│   ├── api/                # API呼び出し関数
│   └── utils/              # フォーマット・変換関数
├── types/                  # 型定義
├── constants/              # 定数
└── styles/                 # グローバルスタイル（必要な場合）
```

### コンポーネントの配置

コンポーネントのディレクトリ構成は、採用するアーキテクチャによって異なる。

→ 詳細は **component_architecture.md** を参照

### その他の配置方針

| 種類 | 配置場所 |
|------|---------|
| API呼び出し関数 | `lib/api/` |
| フォーマット・変換関数 | `lib/utils/` |
| カスタムフック | `hooks/` |
| 型定義 | `types/` |
| 定数 | `constants/` |

---

## コンポーネント設計

### 分割の方針

| 分割する | 分割しない |
|---------|-----------|
| 再利用する可能性がある | 1箇所でしか使わない＆小さい |
| 100行を超える | 50行以下 |
| 独立したロジックを持つ | 親コンポーネントと密結合 |
| テストを書きたい | テスト不要 |

### コンポーネントの構造

```tsx
// 1. import文
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

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

### 方針

| 状態の種類 | 管理方法 |
|-----------|---------|
| コンポーネントローカルな状態 | `useState` |
| 複数コンポーネントで共有する状態 | Context または状態管理ライブラリ |
| サーバーから取得するデータ | データフェッチライブラリ（SWR, TanStack Query等） |
| フォームの状態 | フォームライブラリ（React Hook Form等）または `useState` |

### 避けること

- グローバル状態の乱用（本当に必要か毎回考える）
- 同じデータを複数箇所で管理する（Single Source of Truth）
- 不要な再レンダリングを引き起こす状態設計

---

## その他のルール

### コメント

- **書くべきコメント**: 「なぜ」そうしたかの理由、複雑なロジックの説明
- **書かなくていいコメント**: 「何を」しているかの説明（コードを読めばわかる）

```tsx
// Bad: 何をしているかの説明
// ユーザー名を取得する
const userName = user.name

// Good: なぜそうしているかの説明
// APIの仕様上、nullの場合があるためデフォルト値を設定
const userName = user.name ?? 'ゲスト'
```

### エラーハンドリング

- エラーは握りつぶさない
- ユーザーに適切なフィードバックを返す
- 開発時にはコンソールにも出力する

### マジックナンバー・マジックストリング

- 意味のある数値・文字列は定数化する

```tsx
// Bad
if (items.length > 10) { ... }

// Good
const MAX_DISPLAY_ITEMS = 10
if (items.length > MAX_DISPLAY_ITEMS) { ... }
```

---

## プロジェクト固有のルール

（プロジェクトごとに追加のルールがあれば記載）

---

## 備考

- 作成日: YYYY/MM/DD
- ステータス: ドラフト / 施主承認済み