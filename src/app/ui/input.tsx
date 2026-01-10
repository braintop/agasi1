import type { InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl bg-surface-2 px-3 text-sm text-text-primary',
        'placeholder:text-text-secondary/60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/60',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

