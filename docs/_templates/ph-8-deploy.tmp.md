# デプロイ手順書（deploy_guide.md）

## 概要

本ドキュメントは、プロジェクトのデプロイ手順と本番環境の情報を管理する。

---

## 本番環境情報

| 項目 | 内容 |
|------|------|
| ホスティング | Vercel / Cloudflare Pages / その他 |
| 本番URL | https://example.com |
| プレビューURL | 自動生成（PR作成時） |
| ダッシュボードURL | https://vercel.com/xxx / https://dash.cloudflare.com/xxx |

---

## 環境変数

### 必要な環境変数

| 変数名 | 用途 | 本番値の取得方法 | 設定済み |
|--------|------|-----------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase接続 | Supabase Dashboard → Settings → API | ○ / × |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase接続 | Supabase Dashboard → Settings → API | ○ / × |
| `SUPABASE_SERVICE_ROLE_KEY` | サーバー側Supabase接続 | Supabase Dashboard → Settings → API | ○ / × |
| | | | |

### 環境変数の設定場所

| 環境 | 設定場所 |
|------|---------|
| ローカル | `.env.local` |
| プレビュー | ホスティング先のダッシュボード |
| 本番 | ホスティング先のダッシュボード |

---

## デプロイ手順

### 通常のデプロイ（自動）

mainブランチにマージすると自動でデプロイされる。

```
1. 作業ブランチで実装
2. PRを作成 → プレビューデプロイで確認
3. 問題なければmainにマージ
4. 自動で本番デプロイ
5. 本番環境で動作確認
```

### 手動デプロイ（必要な場合）

```bash
# Vercel CLIを使用する場合
npx vercel --prod

# Cloudflare Pages（wrangler）を使用する場合
npx wrangler pages deploy .next --project-name=xxx
```

---

## デプロイ前チェックリスト

### コードの確認

- [ ] 全ての変更がmainブランチにマージされている
- [ ] ビルドエラーがない（`npm run build` が成功する）
- [ ] 開発用のコード（console.log等）が残っていない
- [ ] 環境変数がハードコードされていない
- [ ] 不要なファイルがコミットされていない

### 設定の確認

- [ ] 本番用の環境変数が設定されている
- [ ] 外部サービスの本番設定が完了している
- [ ] リダイレクトURL等が本番URLになっている（OAuth等）

### テストの確認

- [ ] テストが完了している
- [ ] Critical / High のバグがない

---

## デプロイ後チェックリスト

### 動作確認

| 確認項目 | 結果 | 備考 |
|---------|------|------|
| トップページが表示される | ○ / × | |
| 主要な画面が表示される | ○ / × | |
| ログイン・ログアウトが動作する | ○ / × | |
| データの登録・表示が動作する | ○ / × | |
| エラー画面が適切に表示される | ○ / × | |
| OGP画像が正しく表示される | ○ / × | SNSシェアで確認 |
| アクセス解析が動作している | ○ / × | |

### モニタリング確認

| 確認項目 | 結果 | 備考 |
|---------|------|------|
| エラーが発生していない | ○ / × | Sentry等で確認 |
| パフォーマンスに問題がない | ○ / × | |

---

## トラブルシューティング

### よくあるトラブルと対応

| トラブル | 原因 | 対応 |
|---------|------|------|
| 画面が真っ白 | ビルドエラー | Vercel/Cloudflareのビルドログを確認 |
| API呼び出しが失敗 | 環境変数の設定漏れ | ダッシュボードで環境変数を確認 |
| 画像が表示されない | パスの問題 | 画像URLを確認、相対パス/絶対パスを確認 |
| ログインできない | OAuthのリダイレクトURL | 認証プロバイダの設定を確認 |
| 404エラー | ルーティング設定 | vercel.json / next.config.js を確認 |

### ロールバック手順

**問題が発生した場合、前のバージョンに戻す**

1. ダッシュボードにアクセス
2. 「Deployments」（デプロイ履歴）を開く
3. 前のデプロイを選択
4. 「Promote to Production」または「Rollback」を実行

---

## ドメイン設定

### カスタムドメイン

| 項目 | 内容 |
|------|------|
| ドメイン | example.com |
| レジストラ | お名前.com / Google Domains / etc. |
| SSL | 自動（Let's Encrypt） |

### DNS設定

| タイプ | ホスト | 値 | TTL |
|--------|-------|-----|-----|
| CNAME | www | xxx.vercel.app | 自動 |
| A | @ | 76.76.21.21 | 自動 |

---

## 外部サービス設定

### Supabase

| 項目 | 内容 |
|------|------|
| プロジェクトURL | https://xxx.supabase.co |
| ダッシュボードURL | https://app.supabase.com/project/xxx |
| リージョン | ap-northeast-1 (Tokyo) |

### 認証プロバイダ（OAuth使用時）

| プロバイダ | 設定場所 | リダイレクトURL |
|-----------|---------|----------------|
| Google | Google Cloud Console | https://example.com/auth/callback |
| GitHub | GitHub Developer Settings | https://example.com/auth/callback |

### アクセス解析

| ツール | 設定場所 | 備考 |
|--------|---------|------|
| GA4 | Google Analytics | 測定ID: G-XXXXXXXXXX |

### エラー監視

| ツール | 設定場所 | 備考 |
|--------|---------|------|
| Sentry | Sentry Dashboard | DSN: https://xxx@xxx.ingest.sentry.io/xxx |

---

## デプロイ履歴

| 日付 | バージョン/コミット | 内容 | 結果 |
|------|-------------------|------|------|
| YYYY/MM/DD | abc1234 | 初回デプロイ | 成功 |
| YYYY/MM/DD | def5678 | 機能追加 | 成功 |

---

## 備考

- 作成日: YYYY/MM/DD
- 最終更新: YYYY/MM/DD
- ステータス: 運用中

### 更新履歴

| 日付 | 内容 | 担当 |
|------|------|------|
| YYYY/MM/DD | 初版作成 | 施主 |