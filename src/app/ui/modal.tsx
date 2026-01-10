import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface ModalProps {
  open: boolean
  title?: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-card">
        <div className="flex items-start justify-between gap-3 border-b border-border/70 px-4 py-3">
          <div className="space-y-1">
            {title && (
              <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
            )}
            {description && (
              <p className="text-xs text-text-secondary/80">{description}</p>
            )}
          </div>
          <button
            type="button"
            className={cn(
              'rounded-full px-2 py-1 text-xs text-text-secondary/80 hover:bg-surface-2 hover:text-text-primary',
            )}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="px-4 py-3">{children}</div>
      </div>
    </div>
  )
}

