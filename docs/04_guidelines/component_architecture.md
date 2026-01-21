# コンポーネントアーキテクチャ

## 概要

本ドキュメントは、Cocktailpedia プロジェクトのコンポーネント設計方針を定義する。

---

## 採用パターン

**Atomic Design** を採用する。

### 採用理由

- フロントエンド学習目的を兼ねており、体系的な設計パターンを学びたい
- 将来的なコンポーネントの拡張に対応しやすい
- 再利用性・保守性を重視

---

## レイヤー定義

| レイヤー | 定義 | 特徴 |
|---------|------|------|
| **Atoms** | 最小単位のUI部品 | 単体では意味をなさない、汎用的 |
| **Molecules** | Atomsを組み合わせた機能単位 | 1つの役割を持つ |
| **Organisms** | 独立したUI構成要素 | 単体で意味をなす |

> **Note**: 
> - Pages は Next.js App Router の `app/` ディレクトリで管理
> - Templates層は不採用。レイアウトは `app/layout.tsx` で管理

---

## 具体例（Cocktailpedia）

| レイヤー | 例 |
|---------|-----|
| Atoms | Button, Input, Label, Icon, Badge, Spinner |
| Molecules | SearchBox, CocktailCard, IngredientTag, FavoriteButton |
| Organisms | Header, Footer, CocktailList, SearchForm, FilterPanel |

---

## ディレクトリ構成

```
src/
├── components/
│   ├── ui/               # shadcn/ui（自動生成、Atoms相当）
│   ├── atoms/            # 自作の最小単位
│   │   └── ...
│   ├── molecules/
│   │   ├── CocktailCard/
│   │   │   ├── CocktailCard.tsx
│   │   │   └── index.ts
│   │   └── ...
│   └── organisms/
│       ├── Header/
│       ├── CocktailList/
│       └── ...
├── app/                  # Pages（Next.js App Router）
│   ├── layout.tsx        # 全体レイアウト
│   ├── admin/
│   │   └── layout.tsx    # 管理画面レイアウト
│   └── ...
└── ...
```

---

## 判断基準

どのレイヤーに属するか迷ったときのフロー：

```
Q1. shadcn/ui に同等のものがある？
    → Yes: components/ui/ を使う
    → No: Q2へ

Q2. 他のプロジェクトでも使い回せそう？
    → Yes: Atom または Molecule
    → No: Organism

Q3.（Atom/Moleculeの場合）状態やイベントハンドリングを持つ？
    → Yes: Molecule
    → No: Atom
```

> **Tip**: 迷ったら Molecule に分類してOK

---

## index.ts の役割

`index.ts` は **re-export用**。複数ファイルがある場合のみ作成。

```ts
// molecules/CocktailCard/index.ts
export { CocktailCard } from './CocktailCard'
```

単一ファイルの場合は不要（直接importでOK）。

---

## 依存関係のルール

上位レイヤーは下位レイヤーのみを参照できる：

```
Pages(app/) → Organisms → Molecules → Atoms/ui
```

下位から上位への参照は禁止。

---

## shadcn/ui との関係

- shadcn/ui のコンポーネントは `components/ui/` に配置（Atoms相当）
- Button, Input などの基本部品は shadcn/ui を優先使用
- shadcn/ui にないものは `atoms/` に自作

---

## 備考

- 作成日: 2026/01/21
- ステータス: 施主承認済み
