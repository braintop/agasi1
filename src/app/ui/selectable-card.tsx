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
        'border-[#8C7A73]/70 bg-transparent text-text-primary hover:bg-white/5',
        selected &&
          // Selected: keep border (stronger) + highlighted background, still white text
          'border-[#C98A6B] bg-[#A96D51] text-text-primary shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

