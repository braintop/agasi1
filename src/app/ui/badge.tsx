import type { HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type BadgeVariant = 'default' | 'outline' | 'success' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-2 text-text-secondary border-transparent',
  outline: 'bg-transparent text-text-secondary border-border',
  success: 'bg-success/10 text-success border-success/40',
  danger: 'bg-danger/10 text-danger border-danger/40',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}

