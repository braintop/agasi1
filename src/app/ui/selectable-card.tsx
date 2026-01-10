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
        'border-[color:var(--border)] bg-surface-2 text-[#2F2626] hover:bg-surface',
        selected &&
          'border-transparent bg-[#A96D51] text-[#2F2626] shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

