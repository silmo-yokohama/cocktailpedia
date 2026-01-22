import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * トップページ
 * 環境構築完了の確認用ページ
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Cocktailpedia</CardTitle>
          <CardDescription>カクテル図鑑 - 環境構築完了</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Next.js 16 + Tailwind CSS v4 + shadcn/ui の環境構築が完了しました。
          </p>
          <div className="flex justify-center gap-4">
            <Button>ボタン</Button>
            <Button variant="outline">アウトライン</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
