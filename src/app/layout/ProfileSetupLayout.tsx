import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '../utils/cn'

const STEPS = [
  { path: '/profile/fitness', label: 'פרופיל כושר' },
  { path: '/profile/nutrition', label: 'פרופיל תזונה' },
] as const

export function ProfileSetupLayout() {
  const location = useLocation()
  const currentIndex = STEPS.findIndex((s) => location.pathname.startsWith(s.path))
  const safeIndex = currentIndex === -1 ? 0 : currentIndex

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-start px-4 py-10">
        <div className="mb-8 w-full text-center">
          <h1 className="text-2xl font-semibold text-text-primary">
            ברוכים הבאים ל‑Younger
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            בוא נבנה התאמה אישית לתהליך האריכות ימים שלך
          </p>

          {/* 2-step progress */}
          <div className="mx-auto mt-6 flex max-w-md gap-4">
            {STEPS.map((s, idx) => {
              const isActive = idx <= safeIndex
              return (
                <div
                  key={s.path}
                  className={cn(
                    'h-1.5 flex-1 rounded-full',
                    isActive ? 'bg-[#C98A6B]' : 'bg-white/15',
                  )}
                  aria-label={s.label}
                />
              )
            })}
          </div>
        </div>

        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

