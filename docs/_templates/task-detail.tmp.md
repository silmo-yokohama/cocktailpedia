# タスク: [タスク名]

| 項目 | 内容 |
|------|------|
| ステータス | ドラフト / レビュー中 / 承認済み |
| 作成日 | YYYY-MM-DD |
| 前提タスク | task-XX-xxx（完了していること） |

---

## 実装範囲

このタスクで実装する内容を記載。

- 〇〇
- 〇〇
- 〇〇

---

## 達成すべきこと

完了条件を具体的に記載。

- [ ] 〇〇が完成している
- [ ] 〇〇が動作する
- [ ] 〇〇が確認できる

---

## 守るべき制約

- `docs/04_guidelines/coding_standards.md` に従う
- `docs/04_guidelines/component_architecture.md` に従う
- `docs/05_design/basic_design.md` のデータモデルに従う

<!-- 
以下はUI実装を含むタスクのみ記載（AGが判断）
> [!IMPORTANT]
> **このタスクにはUI実装が含まれます。**
> 必ず `Frontend-design` スキルを読み込み、スキルの指示に従って実装してください。
> これは必須です。
-->

---

## 参照ドキュメント

| ドキュメント | 用途 |
|-------------|------|
| 要件定義 | docs/02_requirements/ |
| 基本設計 | docs/05_design/basic_design.md |
| 全体実装計画 | docs/06_implementation/implementation_plan.md |

---

## Git運用

- 開発は `develop` ブランチをベースとする
- 作業ブランチ: `feature/task-XX-簡潔な説明`
- 全ての実装が完了し、施主が確認したらPRを作成
- PRは `develop` へマージ（リリース時に `main` へマージ）

---

## 判断に迷ったら

- 自分で判断せず、選択肢を提示して施主に確認

---

## 作業完了後チェック

- [ ] 全ての変更をコミット
- [ ] 施主に完了報告
- [ ] 施主確認後、PRを作成
