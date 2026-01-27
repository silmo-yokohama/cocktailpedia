import { cn } from "@/lib/utils"

/**
 * アイコンコンポーネント共通のProps
 */
interface IconProps {
  /** アイコンサイズ（px） */
  size?: number
  /** 追加のクラス名 */
  className?: string
}

/**
 * 共通SVGラッパー
 * Heroicons スタイルの線幅1.5px、24x24 viewBox
 */
function IconWrapper({
  size = 24,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    >
      {children}
    </svg>
  )
}

/**
 * プラスアイコン（追加ボタン用）
 */
export function PlusIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </IconWrapper>
  )
}

/**
 * 検索アイコン
 */
export function SearchIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </IconWrapper>
  )
}

/**
 * ×アイコン（閉じる・削除用）
 */
export function XIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </IconWrapper>
  )
}

/**
 * 縦三点アイコン（メニュー用）
 */
export function MoreVerticalIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
      />
    </IconWrapper>
  )
}

/**
 * ペンシルアイコン（編集用）
 */
export function PencilIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </IconWrapper>
  )
}

/**
 * 外部リンクアイコン
 */
export function ExternalLinkIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </IconWrapper>
  )
}

/**
 * ゴミ箱アイコン（削除用）
 */
export function TrashIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </IconWrapper>
  )
}

/**
 * 左矢印アイコン
 */
export function ChevronLeftIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </IconWrapper>
  )
}

/**
 * 右矢印アイコン
 */
export function ChevronRightIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </IconWrapper>
  )
}

/**
 * 上矢印アイコン
 */
export function ChevronUpIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 15.75l7.5-7.5 7.5 7.5"
      />
    </IconWrapper>
  )
}

/**
 * 下矢印アイコン
 */
export function ChevronDownIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </IconWrapper>
  )
}

/**
 * 上下矢印アイコン（セレクター用）
 */
export function ChevronsUpDownIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </IconWrapper>
  )
}

/**
 * チェックアイコン
 */
export function CheckIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </IconWrapper>
  )
}

/**
 * 画像アイコン（アップロード用）
 */
export function ImageIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </IconWrapper>
  )
}

/**
 * 右矢印アイコン（ナビゲーション用）
 */
export function ArrowRightIcon({ size, className }: IconProps) {
  return (
    <IconWrapper size={size} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </IconWrapper>
  )
}
