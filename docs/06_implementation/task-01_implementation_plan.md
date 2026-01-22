# タスク1: 環境構築 - 作業指示書

## 概要

開発環境を構築し、基本的なプロジェクト設定を完了する。

---

## 事前準備

### 必ず読むドキュメント

| ドキュメント | パス |
|-------------|------|
| 実装計画 | docs/06_implementation/implementation_plan.md |
| 基本設計 | docs/05_design/basic_design.md |
| 要件定義 | docs/02_requirements/ |
| ガイドライン | docs/04_guidelines/ |

### 参考ドキュメント

| ドキュメント | パス |
|-------------|------|
| 技術選定 | docs/03_tech_stack/tech_stack.md |
| 企画 | docs/project_overview.md |

---

## 作業開始前チェック

- [ ] 未コミットの変更がないことを確認
- [ ] 作業用ブランチを作成：`git checkout -b feature/task-01-setup`

---

## 達成すべきこと

- [ ] Next.js 15 (App Router) プロジェクトを `src/` に作成
- [ ] Tailwind CSS v4 の設定
- [ ] shadcn/ui の初期設定（Button, Card 等の基本コンポーネント追加）
- [ ] Supabase クライアントの設定
- [ ] 環境変数の設定（`.env.local.example` 作成）
- [ ] ESLint / Prettier の設定
- [ ] 開発サーバーが起動し、トップページが表示されること

---

## 重要な制約

> [!IMPORTANT]
> 開発フレームワークは **`src/` ディレクトリ** にインストールすること。
> プロジェクトルート直下には配置しない（ルートはドキュメント・設定ファイル用）。

### 完了後の構成

```
project-root/
├── docs/            # ドキュメント
├── PROJECT.md       # プロジェクト管理
└── src/             # ← ここにNext.jsプロジェクト
    ├── app/
    ├── components/
    ├── package.json
    └── ...
```

---

## 守るべき規約

- docs/04_guidelines/coding_standards.md に従う
- ディレクトリ構成は coding_standards.md の「ディレクトリ構成」を参照

---

## 判断に迷ったら

自分で判断せず、選択肢を提示して施主に確認すること。

---

## 作業完了後チェック

- [ ] 全ての変更をコミット
- [ ] `npm run dev` で開発サーバーが起動することを確認
- [ ] 施主に完了報告

---

## 備考

- 作成日: 2026/01/22
- 対象タスク: タスク1（環境構築）
