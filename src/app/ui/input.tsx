import type { InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl bg-surface-2 px-3 text-sm text-[#2F2626]',
        'placeholder:text-text-secondary/60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A6B]/70',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

