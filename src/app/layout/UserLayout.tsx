import { useMemo, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  LineChart,
  Sparkles,
  Menu,
  X,
  Utensils,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react'
import { cn } from '../utils/cn'

const USER_NAV_ITEMS = [
  { label: 'דאשבורד', path: '/dashboard', icon: LayoutDashboard },
  { label: 'תזונה', path: '/nutrition', icon: Utensils },
  { label: 'תובנות AI', path: '/aiinsights', icon: Sparkles },
  { label: 'התקדמות', path: '/progress', icon: LineChart },
] as const

export function UserLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedDateISO, setSelectedDateISO] = useState(() => {
    // Fixed date to match Figma screenshots.
    // Later we can connect this to real data sources.
    return '2026-01-24'
  })

  const selectedDate = useMemo(() => new Date(`${selectedDateISO}T12:00:00`), [selectedDateISO])
  const dayLabel = useMemo(() => {
    return selectedDate.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [selectedDate])

  const shiftDay = (deltaDays: number) => {
    const d = new Date(`${selectedDateISO}T12:00:00`)
    d.setDate(d.getDate() + deltaDays)
    setSelectedDateISO(d.toISOString().slice(0, 10))
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <div className="flex max-w-6xl gap-6 px-6 py-6">
        <aside className="flex w-64 flex-col bg-bg/90 pr-4 max-lg:hidden">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C98A6B] text-sm font-semibold text-bg">
              Y
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">Younger</span>
              <span className="text-xs text-text-secondary">אימון לאריכות ימים</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {USER_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                      'text-text-secondary hover:bg-surface-2 hover:text-[#2F2626]',
                      isActive &&
                        'bg-[#C98A6B] text-[#2F2626]',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-border/70 bg-surface-2 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C98A6B]/10 text-xs font-semibold text-[#C98A6B]">
              JH
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium">Jordan Harper</span>
              <span className="text-[11px] text-text-secondary">
                חבר פרימיום
              </span>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C98A6B] text-xs font-semibold text-bg">
                Y
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight">
                  Younger
                </span>
                <span className="text-[11px] text-text-secondary">תפריט</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5',
                'text-text-primary hover:bg-white/10',
              )}
              aria-label="פתיחת תפריט"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile hamburger menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/60"
                aria-label="סגירת תפריט"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <aside className="absolute inset-y-0 right-0 w-72 border-l border-white/10 bg-bg/95 p-4 backdrop-blur">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C98A6B] text-sm font-semibold text-bg">
                      Y
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold tracking-tight">
                        Younger
                      </span>
                      <span className="text-xs text-text-secondary">אימון לאריכות ימים</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5',
                      'text-text-primary hover:bg-white/10',
                    )}
                    aria-label="סגירת תפריט"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {USER_NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                            'text-text-secondary hover:bg-surface-2 hover:text-[#2F2626]',
                            isActive && 'bg-[#C98A6B] text-[#2F2626]',
                          )
                        }
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    )
                  })}
                </nav>
              </aside>
            </div>
          )}

          {/* Day navigation header (matches Figma) */}
          <div className="mb-6 flex justify-center">
            <div className="flex w-full max-w-xl items-center justify-between rounded-2xl border border-white/10 bg-surface px-3 py-2">
              <button
                type="button"
                onClick={() => shiftDay(1)}
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-xl',
                  'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                )}
                aria-label="יום הבא"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-center">
                <CalendarDays className="h-4 w-4 text-[#C98A6B]" />
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold text-text-primary">היום</span>
                  <span className="text-[11px] text-text-secondary">{dayLabel}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => shiftDay(-1)}
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-xl',
                  'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                )}
                aria-label="יום קודם"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  )
}

