-- ============================================
-- Cocktailpedia データベース マイグレーション
-- 004: 初期データ投入
-- ============================================
--
-- 実行方法:
--   Supabaseダッシュボード → SQL Editor → このSQLを貼り付けて実行
--   ※ 001〜003 実行後に実行すること
--
-- 投入データ:
--   - site_settings: サイト説明文
--   - ingredients: テスト用材料（オプション）
--   - cocktails: テスト用カクテル（オプション）
-- ============================================

-- -------------------------------------------
-- 1. site_settings 初期値
-- -------------------------------------------

INSERT INTO site_settings (key, value) VALUES
  (
    'about_content',
    '# Cocktailpediaについて

Cocktailpediaは、クラシックカクテルの情報を集めたデータベースサイトです。

## 特徴

- **豊富なカクテル情報**: 定番のクラシックカクテルから珍しいカクテルまで
- **詳細な検索機能**: ベース、度数、味わいなど様々な条件で検索
- **お気に入り機能**: 気になるカクテルをブックマーク

## 免責事項

当サイトに掲載されているカクテルのレシピや情報は、参考情報として提供しています。
お酒は20歳になってから。飲酒運転は法律で禁止されています。'
  )
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

-- -------------------------------------------
-- 2. テスト用材料（オプション）
-- 動作確認用。本番データは管理画面から登録
-- -------------------------------------------

-- コメントアウトを解除して使用
/*
INSERT INTO ingredients (name, name_en, category, is_searchable) VALUES
  ('ドライジン', 'Dry Gin', 'spirits', true),
  ('トニックウォーター', 'Tonic Water', 'soda', true),
  ('ライム', 'Lime', 'fruit', true),
  ('ドライベルモット', 'Dry Vermouth', 'wine', true),
  ('オリーブ', 'Olive', 'other', false)
ON CONFLICT (name) DO NOTHING;
*/

-- -------------------------------------------
-- 3. テスト用カクテル（オプション）
-- 動作確認用。本番データは管理画面から登録
-- -------------------------------------------

-- コメントアウトを解除して使用
/*
INSERT INTO cocktails (
  name, name_en, slug, description, cocktail_word,
  base, technique, glass, alcohol_percentage, temperature, carbonation, color
) VALUES
  (
    'ジントニック',
    'Gin and Tonic',
    'gin-tonic',
    'ジントニックは、ジンをトニックウォーターで割ったシンプルで爽やかなカクテル。19世紀のイギリス植民地時代に、マラリア予防のキニーネ（トニックウォーターの主成分）を飲みやすくするために生まれたとされる。',
    '強い意志',
    'gin',
    'build',
    'highball',
    15,
    'ice',
    'strong',
    'clear'
  ),
  (
    'マティーニ',
    'Martini',
    'martini',
    'マティーニは「カクテルの王様」と呼ばれる、ジンとドライベルモットで作る辛口のカクテル。シンプルながら奥深く、バーテンダーの腕が問われる一杯。オリーブを添えるのが定番。',
    '知性',
    'gin',
    'stir',
    'cocktail',
    35,
    'ice',
    'none',
    'clear'
  )
ON CONFLICT (slug) DO NOTHING;
*/

-- -------------------------------------------
-- 4. テスト用レシピ（オプション）
-- 材料とカクテルのテストデータを投入した場合に使用
-- -------------------------------------------

-- コメントアウトを解除して使用
/*
-- ジントニックのレシピ
INSERT INTO recipe_items (cocktail_id, ingredient_id, amount, sort_order)
SELECT c.id, i.id, '45ml', 1
FROM cocktails c, ingredients i
WHERE c.slug = 'gin-tonic' AND i.name = 'ドライジン'
ON CONFLICT (cocktail_id, ingredient_id) DO NOTHING;

INSERT INTO recipe_items (cocktail_id, ingredient_id, amount, sort_order)
SELECT c.id, i.id, '適量', 2
FROM cocktails c, ingredients i
WHERE c.slug = 'gin-tonic' AND i.name = 'トニックウォーター'
ON CONFLICT (cocktail_id, ingredient_id) DO NOTHING;

INSERT INTO recipe_items (cocktail_id, ingredient_id, amount, sort_order)
SELECT c.id, i.id, '1/6カット', 3
FROM cocktails c, ingredients i
WHERE c.slug = 'gin-tonic' AND i.name = 'ライム'
ON CONFLICT (cocktail_id, ingredient_id) DO NOTHING;

-- マティーニのレシピ
INSERT INTO recipe_items (cocktail_id, ingredient_id, amount, sort_order)
SELECT c.id, i.id, '45ml', 1
FROM cocktails c, ingredients i
WHERE c.slug = 'martini' AND i.name = 'ドライジン'
ON CONFLICT (cocktail_id, ingredient_id) DO NOTHING;

INSERT INTO recipe_items (cocktail_id, ingredient_id, amount, sort_order)
SELECT c.id, i.id, '15ml', 2
FROM cocktails c, ingredients i
WHERE c.slug = 'martini' AND i.name = 'ドライベルモット'
ON CONFLICT (cocktail_id, ingredient_id) DO NOTHING;

INSERT INTO recipe_items (cocktail_id, ingredient_id, amount, sort_order)
SELECT c.id, i.id, '1個', 3
FROM cocktails c, ingredients i
WHERE c.slug = 'martini' AND i.name = 'オリーブ'
ON CONFLICT (cocktail_id, ingredient_id) DO NOTHING;
*/
