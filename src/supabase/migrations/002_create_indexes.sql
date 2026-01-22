-- ============================================
-- Cocktailpedia データベース マイグレーション
-- 002: インデックス作成
-- ============================================
--
-- 実行方法:
--   Supabaseダッシュボード → SQL Editor → このSQLを貼り付けて実行
--   ※ 001_create_tables.sql 実行後に実行すること
--
-- 作成するインデックス:
--   - cocktails: base, slug
--   - recipe_items: cocktail_id, ingredient_id
-- ============================================

-- -------------------------------------------
-- cocktails テーブルのインデックス
-- -------------------------------------------

-- ベース（基酒）での検索を高速化
-- 検索条件で「ジンベース」「ウォッカベース」等の絞り込みに使用
CREATE INDEX IF NOT EXISTS idx_cocktails_base ON cocktails(base);

-- スラッグでの検索を高速化
-- 詳細ページ /cocktails/[slug] でのルックアップに使用
-- ※ UNIQUE制約によりインデックスは自動作成されるが、明示的に作成
CREATE INDEX IF NOT EXISTS idx_cocktails_slug ON cocktails(slug);

-- -------------------------------------------
-- recipe_items テーブルのインデックス
-- -------------------------------------------

-- カクテルIDでの検索を高速化
-- カクテル詳細ページでレシピ一覧を取得する際に使用
CREATE INDEX IF NOT EXISTS idx_recipe_items_cocktail ON recipe_items(cocktail_id);

-- 材料IDでの検索を高速化
-- 「この材料を使ったカクテル一覧」等の検索に使用
CREATE INDEX IF NOT EXISTS idx_recipe_items_ingredient ON recipe_items(ingredient_id);
