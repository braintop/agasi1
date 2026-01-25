import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface SelectableCardProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

export function SelectableCard({
  selected,
  className,
  children,
  type,
  ...props
}: SelectableCardProps) {
  return (
    <button
      type={type ?? 'button'}
      className={cn(
        'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-colors',
        // Default (unselected): framed + readable on dark background
        'border-white/15 bg-transparent text-text-primary hover:bg-white/5',
        selected &&
          // Selected: keep border (stronger) + highlighted background, still white text
          '!border-transparent !bg-[color:var(--primary)] !text-bg shadow-card hover:!bg-[color:var(--primary-dark)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

