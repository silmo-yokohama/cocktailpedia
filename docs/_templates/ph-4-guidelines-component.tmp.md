# コンポーネントアーキテクチャ（component_architecture.md）

## 概要

本ドキュメントは、プロジェクトのコンポーネント設計方針を定義する。
どのようにコンポーネントを分類・配置するかの共通認識を持つ。

---

## 採用パターン

（以下から選択）

- [ ] **Atomic Design** - UI を階層的に分類（Atoms → Molecules → Organisms → Templates → Pages）
- [ ] **Feature-based** - 機能ごとにコンポーネントをまとめる
- [ ] **フラット** - 特にルールを設けず、必要に応じて配置
- [ ] **その他** - 独自のルールを定義

---

## Atomic Design（採用する場合）

### レイヤー定義

| レイヤー | 定義 | 特徴 |
|---------|------|------|
| **Atoms** | これ以上分解できない最小単位 | 単体では意味をなさない、汎用的 |
| **Molecules** | Atomsを組み合わせた小さな機能単位 | 1つの役割を持つ、再利用可能 |
| **Organisms** | Molecules/Atomsを組み合わせた独立したUI | 単体で意味をなす、機能を持つ |
| **Templates** | ページのレイアウト構造 | データを持たない、骨組みのみ |
| **Pages** | Templatesにデータを流し込んだ実体 | 実際のページ、データ取得を行う |

### 具体例

| レイヤー | 例 |
|---------|-----|
| Atoms | Button, Input, Label, Icon, Avatar, Badge, Spinner |
| Molecules | SearchBox, FormField, NavLink, Card, MenuItem |
| Organisms | Header, Footer, Sidebar, LoginForm, ProductList, CommentSection |
| Templates | DefaultLayout, DashboardLayout, AuthLayout |
| Pages | HomePage, ProductDetailPage, UserSettingsPage |

### ディレクトリ構成

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx（必要な場合）
│   │   │   └── index.ts
│   │   ├── Input/
│   │   └── ...
│   ├── molecules/
│   │   ├── SearchBox/
│   │   ├── FormField/
│   │   └── ...
│   ├── organisms/
│   │   ├── Header/
│   │   ├── LoginForm/
│   │   └── ...
│   └── templates/
│       ├── DefaultLayout/
│       └── ...
├── app/（または pages/）
│   └── ...
└── ...
```

### 判断基準

どのレイヤーに属するか迷ったときの判断フロー：

```
Q1. 他のプロジェクトでも使い回せそう？
    → Yes: Atom または Molecule
    → No: Organism

Q2.（Atom/Moleculeの場合）単体で1つの役割を持つ？
    → Yes: Molecule
    → No: Atom

Q3.（Organismの場合）ページ全体のレイアウトに関わる？
    → Yes: Template
    → No: Organism
```

### 依存関係のルール

上位レイヤーは下位レイヤーのみを参照できる：

```
Pages → Templates → Organisms → Molecules → Atoms
  ↓        ↓           ↓           ↓
  OK       OK          OK          OK
  
Atoms → Molecules（NG：下位から上位への参照は禁止）
```

---

## Feature-based（採用する場合）

### 考え方

機能（Feature）ごとにコンポーネントをまとめる。
機能内で閉じたコンポーネントと、機能横断で使う共通コンポーネントを分ける。

### ディレクトリ構成

```
src/
├── components/
│   └── ui/                    # 共通UIコンポーネント
│       ├── Button.tsx
│       ├── Input.tsx
│       └── ...
├── features/
│   ├── auth/                  # 認証機能
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── index.ts
│   ├── products/              # 商品機能
│   │   ├── components/
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductCard.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts
│   │   └── index.ts
│   └── ...
├── app/（または pages/）
│   └── ...
└── ...
```

### 配置の判断基準

| 条件 | 配置場所 |
|------|---------|
| 2つ以上の機能で使う | `components/ui/` |
| 1つの機能でしか使わない | `features/[機能名]/components/` |
| 機能固有のロジック | `features/[機能名]/hooks/` |

### Feature の粒度

- 1つの Feature = 1つのドメイン領域
- 例：auth, products, cart, user, settings
- 細かくしすぎない（ファイル探しが大変になる）

---

## フラット（採用する場合）

### 考え方

特にルールを設けず、シンプルに配置する。
小規模プロジェクトや、プロトタイプ段階に向いている。

### ディレクトリ構成

```
src/
├── components/
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── LoginForm.tsx
│   ├── ProductCard.tsx
│   └── ...
├── app/（または pages/）
│   └── ...
└── ...
```

### 注意点

- コンポーネントが増えてきたら、後からAtomic DesignやFeature-basedに移行を検討
- 目安：コンポーネントが20個を超えたら整理を考える

---

## その他（独自ルールの場合）

### 採用するルール

（独自のルールを記載）

### ディレクトリ構成

```
（構成を記載）
```

### 判断基準

（どう分類するかの基準を記載）

---

## プロジェクトでの決定事項

### 採用したパターン

（選択したパターンを記載）

### 採用理由

（なぜこのパターンにしたかを記載）

### プロジェクト固有のルール

（標準から変更・追加したルールがあれば記載）

---

## 備考

- 作成日: YYYY/MM/DD
- ステータス: ドラフト / 施主承認済み