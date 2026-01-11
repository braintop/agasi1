import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        // Use explicit colors so borders/background always render (even if theme tokens fail)
        'w-full rounded-xl border border-[#8C7A73]/70 bg-[#F4E6DD] px-3 py-2 text-sm text-[#2F2626]',
        'placeholder:text-[#6B5A55]/65',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:cursor-not-allowed disabled:opacity-50 resize-none',
        className,
      )}
      {...props}
    />
  )
}

