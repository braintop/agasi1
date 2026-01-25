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
    <div
      className="min-h-screen bg-bg text-text-primary"
      style={{
        // User-area palette (green) to match new Figma dashboard
        // Scoped here so onboarding can keep its palette.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        ['--bg' as any]: '#0f2b26',
        ['--surface' as any]: '#193b34',
        ['--surface-2' as any]: '#20463e',
        ['--border' as any]: '#2b5a4f',
        ['--text-primary' as any]: '#ffffff',
        ['--text-secondary' as any]: '#a7c0b7',
        ['--text-muted' as any]: '#7aa096',
        ['--primary' as any]: '#63d7be',
        ['--primary-dark' as any]: '#49b9a5',
        ['--accent' as any]: '#63d7be',
        ['--success' as any]: '#63d7be',
        ['--primary-15' as any]: 'rgba(99, 215, 190, 0.15)',
        ['--primary-25' as any]: 'rgba(99, 215, 190, 0.25)',
      }}
    >
      <div className="mx-auto flex w-full max-w-[1400px] justify-center px-6 py-6 lg:pr-[18rem] lg:pl-[var(--left-drawer-offset,0px)]">
        <aside
          className={cn(
            'hidden lg:flex w-64 flex-col bg-surface',
            'fixed right-0 top-0 bottom-0 z-30 px-6 py-6',
            'border-l border-white/10',
          )}
        >
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--primary)] text-sm font-semibold text-bg">
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
                      'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                      isActive &&
                        'bg-[color:var(--primary)] text-bg',
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--primary-15)] text-xs font-semibold text-[color:var(--primary)]">
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

        <main className="w-full max-w-5xl min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--primary)] text-xs font-semibold text-bg">
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--primary)] text-sm font-semibold text-bg">
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
                          'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                          isActive && 'bg-[color:var(--primary)] text-bg',
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
          <div className="mb-6">
            <div className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-surface px-5 py-4">
              <button
                type="button"
                onClick={() => shiftDay(-1)}
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-xl',
                  'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                )}
                aria-label="יום קודם"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-center">
                <CalendarDays className="h-5 w-5 text-[color:var(--primary)]" />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-text-primary">היום</span>
                  <span className="text-xs text-text-secondary">{dayLabel}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => shiftDay(1)}
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-xl',
                  'text-text-secondary hover:bg-white/5 hover:text-text-primary',
                )}
                aria-label="יום הבא"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  )
}

