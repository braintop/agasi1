import type { HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface TabItem {
  id: string
  label: string
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
}

export function SegmentedTabs({
  items,
  value,
  onChange,
  className,
  ...props
}: TabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 p-1',
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = item.id === value
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'min-w-[80px] rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              'text-text-secondary',
              isActive && 'bg-bg text-text-primary',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

