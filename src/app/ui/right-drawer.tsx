import { useEffect, type ReactNode } from 'react'
import { cn } from '../utils/cn'

interface RightDrawerProps {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
}

export function RightDrawer({ open, title, onClose, children }: RightDrawerProps) {
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    // Used by UserLayout to keep main content centered between drawers.
    root.style.setProperty('--left-drawer-offset', '28rem')
    return () => {
      root.style.removeProperty('--left-drawer-offset')
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="סגירה"
        onClick={onClose}
      />

      <aside
        dir="rtl"
        className={cn(
          'absolute inset-y-0 left-0 w-full max-w-md',
          'border-r border-white/10 bg-bg/95 backdrop-blur',
        )}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-5">
          <h2 className="text-lg font-semibold leading-snug text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-lg',
              'border border-white/10 bg-white/5 text-text-primary hover:bg-white/10',
            )}
            aria-label="סגירה"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-6">{children}</div>
      </aside>
    </div>
  )
}

