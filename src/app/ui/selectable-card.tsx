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
        'border-border bg-surface-2 text-text-primary/90 hover:bg-surface hover:border-border/80',
        selected &&
          'border-[#10B981] bg-surface shadow-card text-text-primary',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

