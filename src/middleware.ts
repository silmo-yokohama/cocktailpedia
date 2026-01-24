import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Basic認証のヘッダーを検証
 * @param authHeader Authorization ヘッダーの値
 * @returns 認証成功時は true、失敗時は false
 */
function isValidBasicAuth(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false
  }

  const base64Credentials = authHeader.split(" ")[1]
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8")
  const [username, password] = credentials.split(":")

  const validUsername = process.env.ADMIN_USER
  const validPassword = process.env.ADMIN_PASSWORD

  // 環境変数が設定されていない場合は認証を拒否
  if (!validUsername || !validPassword) {
    console.error("管理者認証情報が環境変数に設定されていません")
    return false
  }

  return username === validUsername && password === validPassword
}

/**
 * 401 Unauthorized レスポンスを返す
 * ブラウザに Basic 認証ダイアログを表示させる
 */
function unauthorizedResponse(): NextResponse {
  return new NextResponse("認証が必要です", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Cocktailpedia Admin"',
    },
  })
}

/**
 * Next.js Middleware
 * /admin/* 配下へのアクセスに Basic 認証を要求する
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/* 配下のみ Basic 認証を適用
  if (pathname.startsWith("/admin")) {
    const authHeader = request.headers.get("authorization")

    if (!isValidBasicAuth(authHeader)) {
      return unauthorizedResponse()
    }
  }

  return NextResponse.next()
}

/**
 * Middleware を適用するパスの設定
 */
export const config = {
  matcher: ["/admin/:path*"],
}
