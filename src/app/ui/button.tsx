import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A6B]/70 disabled:cursor-not-allowed disabled:opacity-60'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#C98A6B] text-[#2F2626] border-transparent hover:bg-[#A96D51] shadow-card',
  secondary:
    'bg-surface-2 text-[#2F2626] border-transparent hover:bg-[#e0bba7]',
  ghost:
    'bg-transparent text-text-secondary border-transparent hover:bg-surface-2 hover:text-[#2F2626]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3',
  md: 'h-10 px-4',
  lg: 'h-11 px-5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
}

