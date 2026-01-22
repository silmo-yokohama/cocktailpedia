-- ============================================
-- Cocktailpedia データベース マイグレーション
-- 001: テーブル作成
-- ============================================
--
-- 実行方法:
--   Supabaseダッシュボード → SQL Editor → このSQLを貼り付けて実行
--
-- 対象テーブル:
--   - cocktails: カクテル情報
--   - ingredients: 材料情報
--   - recipe_items: レシピ項目（中間テーブル）
--   - site_settings: サイト設定
-- ============================================

-- -------------------------------------------
-- 1. cocktails テーブル
-- カクテルのマスタデータを格納
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS cocktails (
  -- 主キー
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 基本情報
  name TEXT NOT NULL,                    -- カクテル名（日本語）
  name_en TEXT,                          -- 英語名
  name_alias TEXT,                       -- 別名
  slug TEXT UNIQUE NOT NULL,             -- URLスラッグ（例: gin-tonic）
  description TEXT,                      -- 説明・由来・歴史
  cocktail_word TEXT,                    -- カクテル言葉

  -- 分類情報
  base TEXT NOT NULL,                    -- ベース（gin, vodka等）
  technique TEXT NOT NULL,               -- 技法（shake, stir等）
  glass TEXT NOT NULL,                   -- グラスの種類

  -- 特性
  alcohol_percentage INTEGER NOT NULL,   -- 度数（0-100）
  temperature TEXT NOT NULL,             -- 冷たさ（ice, hot等）
  carbonation TEXT NOT NULL,             -- 炭酸（strong, weak, none）
  color TEXT,                            -- カラー

  -- 関連情報
  variation_text TEXT,                   -- バリエーション（カンマ区切り）
  image_url TEXT,                        -- 画像URL（Supabase Storage）

  -- 統計情報
  view_count INTEGER NOT NULL DEFAULT 0,      -- 閲覧回数
  bookmark_count INTEGER NOT NULL DEFAULT 0,  -- ブックマーク数

  -- タイムスタンプ
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- コメント追加
COMMENT ON TABLE cocktails IS 'カクテルのマスタデータ';
COMMENT ON COLUMN cocktails.slug IS 'URLに使用するスラッグ（例: /cocktails/gin-tonic）';
COMMENT ON COLUMN cocktails.base IS 'ベース: gin, vodka, rum, tequila, whiskey, brandy, liqueur, wine, beer, non_alcoholic, other';
COMMENT ON COLUMN cocktails.technique IS '技法: shake, stir, build, blend';
COMMENT ON COLUMN cocktails.glass IS 'グラス: cocktail, rocks, highball, collins, champagne_flute, champagne_saucer, wine, shot, copper_mug, goblet, other';
COMMENT ON COLUMN cocktails.temperature IS '冷たさ: ice, hot, crushed_ice, frozen';
COMMENT ON COLUMN cocktails.carbonation IS '炭酸: strong, weak, none';
COMMENT ON COLUMN cocktails.color IS 'カラー: red, orange, yellow, green, blue, purple, pink, brown, amber, white, clear, layered';
COMMENT ON COLUMN cocktails.variation_text IS 'バリエーション（派生カクテル名、カンマ区切り）';

-- -------------------------------------------
-- 2. ingredients テーブル
-- 材料のマスタデータを格納
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS ingredients (
  -- 主キー
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 基本情報
  name TEXT UNIQUE NOT NULL,             -- 材料名（日本語）
  name_en TEXT,                          -- 英語名
  category TEXT,                         -- カテゴリ

  -- フラグ
  is_searchable BOOLEAN NOT NULL DEFAULT true,  -- 検索条件に表示するか

  -- タイムスタンプ
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- コメント追加
COMMENT ON TABLE ingredients IS '材料のマスタデータ';
COMMENT ON COLUMN ingredients.category IS 'カテゴリ: spirits, liqueur, wine, juice, soda, syrup, dairy, fruit, herb, other';
COMMENT ON COLUMN ingredients.is_searchable IS '検索画面の材料選択に表示するかどうか';

-- -------------------------------------------
-- 3. recipe_items テーブル
-- カクテルと材料の中間テーブル
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS recipe_items (
  -- 主キー
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 外部キー
  cocktail_id UUID NOT NULL REFERENCES cocktails(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,

  -- レシピ情報
  amount TEXT,                           -- 分量（「30ml」「適量」等）
  sort_order INTEGER NOT NULL DEFAULT 0, -- 表示順

  -- タイムスタンプ
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- 複合ユニーク制約（同一カクテルに同一材料の重複を防止）
  UNIQUE(cocktail_id, ingredient_id)
);

-- コメント追加
COMMENT ON TABLE recipe_items IS 'カクテルと材料の中間テーブル（レシピ）';
COMMENT ON COLUMN recipe_items.amount IS '分量（テキスト形式: 30ml, 1/2, 適量 など）';
COMMENT ON COLUMN recipe_items.sort_order IS 'レシピ内での材料の表示順序';

-- -------------------------------------------
-- 4. site_settings テーブル
-- サイト設定を格納
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  -- 主キー
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 設定情報
  key TEXT UNIQUE NOT NULL,              -- 設定キー
  value TEXT,                            -- 設定値

  -- タイムスタンプ
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- コメント追加
COMMENT ON TABLE site_settings IS 'サイト設定（キーバリュー形式）';
COMMENT ON COLUMN site_settings.key IS '設定キー（例: about_content）';
COMMENT ON COLUMN site_settings.value IS '設定値（Markdown等のテキスト）';
