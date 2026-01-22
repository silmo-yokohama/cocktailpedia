-- ============================================
-- Cocktailpedia データベース マイグレーション
-- 003: RLS（Row Level Security）有効化とポリシー設定
-- ============================================
--
-- 実行方法:
--   Supabaseダッシュボード → SQL Editor → このSQLを貼り付けて実行
--   ※ 001_create_tables.sql 実行後に実行すること
--
-- セキュリティ方針:
--   - 管理画面のBasic認証はNext.js Middlewareで実施
--   - RLSでは全操作を許可（Supabaseのベストプラクティスに従いRLSは有効化）
--   - 公開APIは読み取りのみ許可
-- ============================================

-- -------------------------------------------
-- 1. RLS 有効化
-- -------------------------------------------

ALTER TABLE cocktails ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------
-- 2. cocktails テーブルのポリシー
-- -------------------------------------------

-- 読み取り: 全員許可（公開データ）
CREATE POLICY "Allow public read on cocktails" ON cocktails
  FOR SELECT
  USING (true);

-- 挿入: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow insert on cocktails" ON cocktails
  FOR INSERT
  WITH CHECK (true);

-- 更新: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow update on cocktails" ON cocktails
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 削除: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow delete on cocktails" ON cocktails
  FOR DELETE
  USING (true);

-- -------------------------------------------
-- 3. ingredients テーブルのポリシー
-- -------------------------------------------

-- 読み取り: 全員許可（公開データ）
CREATE POLICY "Allow public read on ingredients" ON ingredients
  FOR SELECT
  USING (true);

-- 挿入: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow insert on ingredients" ON ingredients
  FOR INSERT
  WITH CHECK (true);

-- 更新: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow update on ingredients" ON ingredients
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 削除: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow delete on ingredients" ON ingredients
  FOR DELETE
  USING (true);

-- -------------------------------------------
-- 4. recipe_items テーブルのポリシー
-- -------------------------------------------

-- 読み取り: 全員許可（公開データ）
CREATE POLICY "Allow public read on recipe_items" ON recipe_items
  FOR SELECT
  USING (true);

-- 挿入: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow insert on recipe_items" ON recipe_items
  FOR INSERT
  WITH CHECK (true);

-- 更新: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow update on recipe_items" ON recipe_items
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 削除: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow delete on recipe_items" ON recipe_items
  FOR DELETE
  USING (true);

-- -------------------------------------------
-- 5. site_settings テーブルのポリシー
-- -------------------------------------------

-- 読み取り: 全員許可（公開データ）
CREATE POLICY "Allow public read on site_settings" ON site_settings
  FOR SELECT
  USING (true);

-- 挿入: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow insert on site_settings" ON site_settings
  FOR INSERT
  WITH CHECK (true);

-- 更新: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow update on site_settings" ON site_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 削除: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow delete on site_settings" ON site_settings
  FOR DELETE
  USING (true);

-- -------------------------------------------
-- 6. Storage ポリシー（cocktail-images バケット用）
-- -------------------------------------------
-- 注意: 事前に Supabaseダッシュボード → Storage で
--       「cocktail-images」バケットを作成し、Public bucket: ON にすること
-- -------------------------------------------

-- 読み取り: 全員許可（公開画像）
CREATE POLICY "Public read access for cocktail images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'cocktail-images');

-- アップロード: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow upload to cocktail images" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'cocktail-images');

-- 更新: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow update cocktail images" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'cocktail-images')
  WITH CHECK (bucket_id = 'cocktail-images');

-- 削除: 全員許可（Basic認証はMiddlewareで実施）
CREATE POLICY "Allow delete cocktail images" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'cocktail-images');
