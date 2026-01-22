import { createClient } from "@supabase/supabase-js"

/**
 * サーバー用Supabaseクライアント
 * Server Components / Server Actions で使用する
 */
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // サーバーサイドでは永続化を無効化
      persistSession: false,
    },
  })
}
