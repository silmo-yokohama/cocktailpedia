"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteCocktail, type AdminCocktailListItem } from "@/actions/admin"
import { getLabel, BASE_OPTIONS } from "@/types/constants"
import {
  MoreVerticalIcon,
  PencilIcon,
  ExternalLinkIcon,
  TrashIcon,
} from "@/components/atoms/icons/HeroIcons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/** デフォルト画像のURL */
const DEFAULT_IMAGE = "/images/cocktail-placeholder.svg"

/**
 * カクテル一覧テーブルコンポーネント
 */
export function CocktailsTable({ items }: { items: AdminCocktailListItem[] }) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<AdminCocktailListItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  /**
   * 削除処理
   */
  const handleDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    const result = await deleteCocktail(deleteTarget.id)

    if (result.success) {
      toast.success(`「${deleteTarget.name}」を削除しました`)
      router.refresh()
    } else {
      toast.error(result.error)
    }

    setIsDeleting(false)
    setDeleteTarget(null)
  }

  /**
   * 日付をフォーマット
   */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border/50 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-16">画像</TableHead>
              <TableHead>カクテル名</TableHead>
              <TableHead className="hidden md:table-cell">ベース</TableHead>
              <TableHead className="hidden lg:table-cell">更新日時</TableHead>
              <TableHead className="w-20 text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="group">
                {/* 画像 */}
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.image_url || DEFAULT_IMAGE}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                </TableCell>

                {/* カクテル名 */}
                <TableCell>
                  <div>
                    <Link
                      href={`/admin/cocktails/${item.id}/edit`}
                      className="font-medium text-foreground hover:text-gold hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      /{item.slug}
                    </p>
                  </div>
                </TableCell>

                {/* ベース */}
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary" className="font-normal">
                    {getLabel(BASE_OPTIONS, item.base)}
                  </Badge>
                </TableCell>

                {/* 更新日時 */}
                <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                  {formatDate(item.updated_at)}
                </TableCell>

                {/* 操作 */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 md:opacity-0 md:group-hover:opacity-100 data-[state=open]:opacity-100"
                      >
                        <MoreVerticalIcon size={16} />
                        <span className="sr-only">メニューを開く</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/cocktails/${item.id}/edit`}>
                          <PencilIcon size={16} className="mr-2" />
                          編集
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/cocktails/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLinkIcon size={16} className="mr-2" />
                          公開ページを見る
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <TrashIcon size={16} className="mr-2" />
                        削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 削除確認ダイアログ */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>カクテルを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deleteTarget?.name}」を削除します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "削除中..." : "削除する"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
