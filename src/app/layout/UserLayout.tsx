import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Dumbbell,
  HeartPulse,
  CalendarCheck2,
  LineChart,
  Sparkles,
} from 'lucide-react'
import { cn } from '../utils/cn'

const USER_NAV_ITEMS = [
  { label: 'דאשבורד', path: '/dashboard', icon: LayoutDashboard },
  { label: 'אימונים', path: '/workouts', icon: Dumbbell },
  { label: 'קרדיו', path: '/cardio', icon: HeartPulse },
  { label: 'צ׳ק‑אין יומי', path: '/dailycheckin', icon: CalendarCheck2 },
  { label: 'התקדמות', path: '/progress', icon: LineChart },
  { label: 'תובנות AI', path: '/aiinsights', icon: Sparkles },
] as const

export function UserLayout() {
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
              <span className="text-xs text-text-secondary">
                מאמן אריכות ימים יומי
              </span>
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
                        'bg-[#A96D51] text-[#2F2626]',
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
                <span className="text-[11px] text-text-secondary">
                  אזור משתמש
                </span>
              </div>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  )
}

