import type { InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        // Use explicit colors so borders/background always render (even if theme tokens fail)
        'h-10 w-full rounded-xl border border-[#8C7A73]/70 bg-[#F4E6DD] px-3 text-sm text-[#2F2626]',
        'placeholder:text-[#6B5A55]/65',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

