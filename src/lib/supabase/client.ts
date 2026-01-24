import { createClient } from "@supabase/supabase-js"

/**
 * ブラウザ用Supabaseクライアント
 * クライアントコンポーネントで使用する
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(supabaseUrl, supabaseAnonKey)
}
