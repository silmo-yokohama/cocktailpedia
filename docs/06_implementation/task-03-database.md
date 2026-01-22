# タスク3: データベース - 詳細実行計画

## 概要

| 項目 | 内容 |
|------|------|
| タスク名 | データベース |
| 目的 | Supabaseにテーブルを作成し、初期データを投入できる状態にする |
| 前提タスク | タスク1（環境構築） ✅ 完了 |
| 作業ブランチ | `feature/task-03-database` |
| ベースブランチ | `develop` |

---

## 作業開始前チェック

- [ ] `develop` ブランチが最新であることを確認
- [ ] 未コミットの変更がないことを確認
- [ ] 作業用ブランチを作成: `git checkout -b feature/task-03-database develop`
- [ ] Supabaseダッシュボードにアクセスできることを確認

---

## 達成すべきこと

### 1. テーブル作成

#### 1.1 マイグレーションSQL

**ファイル**: `src/supabase/migrations/001_create_tables.sql`

> [!NOTE]
> Supabaseダッシュボードの「SQL Editor」で実行するか、
> ローカルで管理するためにファイルとして保存。

#### 1.2 cocktails テーブル

```sql
CREATE TABLE cocktails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  name_alias TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cocktail_word TEXT,
  base TEXT NOT NULL,
  technique TEXT NOT NULL,
  glass TEXT NOT NULL,
  alcohol_percentage INTEGER NOT NULL,
  temperature TEXT NOT NULL,
  carbonation TEXT NOT NULL,
  color TEXT,
  variation_text TEXT,
  image_url TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  bookmark_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**インデックス**:
```sql
CREATE INDEX idx_cocktails_base ON cocktails(base);
CREATE INDEX idx_cocktails_slug ON cocktails(slug);
```

#### 1.3 ingredients テーブル

```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  name_en TEXT,
  category TEXT,
  is_searchable BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### 1.4 recipe_items テーブル

```sql
CREATE TABLE recipe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cocktail_id UUID NOT NULL REFERENCES cocktails(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  amount TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(cocktail_id, ingredient_id)
);
```

**インデックス**:
```sql
CREATE INDEX idx_recipe_items_cocktail ON recipe_items(cocktail_id);
CREATE INDEX idx_recipe_items_ingredient ON recipe_items(ingredient_id);
```

#### 1.5 site_settings テーブル

```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 2. RLS (Row Level Security) 設定

> [!IMPORTANT]
> Supabaseではセキュリティのため、RLSを有効にすることが推奨される。
> 管理画面のBasic認証はMiddlewareで行うため、RLSでは全操作を許可する。

#### 2.1 RLS有効化

```sql
ALTER TABLE cocktails ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
```

#### 2.2 ポリシー作成

**cocktails**:
```sql
-- 読み取り: 全員許可
CREATE POLICY "Allow public read" ON cocktails
  FOR SELECT USING (true);

-- 書き込み: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow all write" ON cocktails
  FOR ALL USING (true);
```

**ingredients**:
```sql
CREATE POLICY "Allow public read" ON ingredients
  FOR SELECT USING (true);

CREATE POLICY "Allow all write" ON ingredients
  FOR ALL USING (true);
```

**recipe_items**:
```sql
CREATE POLICY "Allow public read" ON recipe_items
  FOR SELECT USING (true);

CREATE POLICY "Allow all write" ON recipe_items
  FOR ALL USING (true);
```

**site_settings**:
```sql
CREATE POLICY "Allow public read" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow all write" ON site_settings
  FOR ALL USING (true);
```

---

### 3. Supabase Storage バケット作成

#### 3.1 バケット設定

| 項目 | 値 |
|------|-----|
| バケット名 | `cocktail-images` |
| 公開設定 | パブリック（読み取り可能） |
| 許可ファイル形式 | image/jpeg, image/png, image/webp |
| 最大ファイルサイズ | 5MB |

#### 3.2 作成方法

1. Supabaseダッシュボード → Storage
2. 「New bucket」をクリック
3. バケット名: `cocktail-images`
4. Public bucket: ON
5. 「Create bucket」をクリック

#### 3.3 ストレージポリシー

```sql
-- 読み取り: 全員許可
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'cocktail-images');

-- アップロード: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cocktail-images');

-- 更新/削除: 全員許可
CREATE POLICY "Allow update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cocktail-images');

CREATE POLICY "Allow delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'cocktail-images');
```

---

### 4. 初期データ投入（任意）

#### 4.1 site_settings 初期値

```sql
INSERT INTO site_settings (key, value) VALUES
  ('about_content', '# Cocktailpediaについて\n\nCocktailpediaは、クラシックカクテルの情報を集めたデータベースサイトです。');
```

#### 4.2 テスト用カクテルデータ（オプション）

動作確認用に1〜2件のテストデータを投入してもOK。
本番データはタスク6以降で管理画面から登録する。

---

### 5. 成果物

#### 5.1 ファイル構成

```
src/
└── supabase/
    └── migrations/
        ├── 001_create_tables.sql      # テーブル作成
        ├── 002_create_indexes.sql     # インデックス作成
        ├── 003_enable_rls.sql         # RLS有効化・ポリシー
        └── 004_initial_data.sql       # 初期データ（任意）
```

> [!TIP]
> SQLファイルはバージョン管理用。
> 実際の適用はSupabaseダッシュボードのSQL Editorで実行。

---

## 参照ドキュメント

| ドキュメント | 参照内容 |
|-------------|---------|
| [基本設計書](docs/05_design/basic_design.md) | 1. データモデル設計（テーブル定義、リレーション、制約） |

---

## 作業完了後チェック

- [ ] 4テーブルが作成されている（cocktails, ingredients, recipe_items, site_settings）
- [ ] 各テーブルにRLSが設定されている
- [ ] Storage バケット `cocktail-images` が作成されている
- [ ] マイグレーションSQLがファイルとして保存されている
- [ ] Supabaseダッシュボードでテーブル構造を確認
- [ ] 簡単なSELECTクエリが実行できる（空でもOK）
- [ ] `npm run build` が成功する
- [ ] 全ての変更をコミット

---

## 完了報告

作業完了後、以下を施主に報告：

1. 作成したテーブル一覧
2. RLS設定の内容
3. Storageバケットの設定
4. 初期データを投入した場合はその内容

施主が確認後、`develop` へのPRを作成。

---

## 注意事項

> [!CAUTION]
> **Supabaseダッシュボードでの操作が必要**
> 
> このタスクはSupabaseダッシュボード（ https://supabase.com/dashboard ）での
> 操作が含まれる。SQL Editorでマイグレーションを実行し、
> StorageでバケットをUIから作成する。

---

## 判断に迷ったら

- **インデックスの追加**: 基本設計にないインデックスを追加したい場合は施主に確認
- **RLSポリシーの詳細**: セキュリティ要件に変更がある場合は施主に確認
- **その他**: 選択肢を提示して施主に確認

---

## 備考

- 作成日: 2026/01/23
- 作成者: AG
- ステータス: CC作業依頼用
