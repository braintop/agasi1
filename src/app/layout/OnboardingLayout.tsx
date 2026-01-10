import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { cn } from '../utils/cn'

const ONBOARDING_STEPS = [
  { id: 'welcome', label: 'ברוכים הבאים', path: '/welcome' },
  { id: 'basics', label: 'פרטים בסיסיים', path: '/basics' },
  { id: 'goals', label: 'מטרות', path: '/goals' },
  { id: 'fitness', label: 'כושר', path: '/fitness' },
  { id: 'lifestyle', label: 'אורח חיים', path: '/lifestyle' },
  { id: 'complete', label: 'סיום', path: '/complete' },
] as const

export function OnboardingLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const isWelcome = location.pathname === '/welcome'
  const STEPS_WITH_OWN_ACTIONS = [
    '/basics',
    '/goals',
    '/fitness',
    '/lifestyle',
    '/complete',
  ] as const
  const isStepWithOwnActions = STEPS_WITH_OWN_ACTIONS.includes(
    location.pathname as (typeof STEPS_WITH_OWN_ACTIONS)[number],
  )

  const currentIndex = ONBOARDING_STEPS.findIndex((step) =>
    location.pathname.startsWith(step.path),
  )

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981] text-sm font-semibold text-bg">
              Y
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">Younger</span>
              <span className="text-xs text-text-secondary">
                תהליך התחלה מותאם לאריכות ימים
              </span>
            </div>
          </div>

          <Badge variant="outline">תהליך התחלה</Badge>
        </div>

        <nav className="border-t border-border/80">
          <div className="mx-auto flex max-w-5xl items-center gap-1.5 px-4 py-3">
            {ONBOARDING_STEPS.map((step, index) => {
              const isActive = location.pathname === step.path
              const isCompleted =
                currentIndex !== -1 && index < currentIndex && !isActive

              return (
                <Link
                  key={step.id}
                  to={step.path}
                  className={cn(
                    'flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors',
                    'text-text-secondary',
                    isActive &&
                      'bg-[#052e21] text-[#10B981] shadow-card',
                    isCompleted && 'text-text-primary',
                    !isActive && !isCompleted && 'hover:bg-surface-2/60',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full text-[10px]',
                      'bg-surface-2 text-text-secondary',
                      isActive && 'bg-[#10B981] text-bg',
                      isCompleted &&
                        'bg-success text-bg font-semibold',
                    )}
                  >
                    {index + 1}
                  </span>
                  <span>{step.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col px-4 pb-32 pt-8">
        <Outlet />
      </main>

      {!isStepWithOwnActions && (
        <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface-2/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
            {isWelcome ? (
              <div className="flex w-full justify-center">
                <Button
                  size="lg"
                  className="w-full max-w-md"
                  onClick={() => navigate('/basics')}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Get Started
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col text-xs text-text-secondary">
                  <span>Navigation controls are placeholder-only for now.</span>
                  <span>Each step will define its own actions later.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="md" disabled>
                    Back
                  </Button>
                  <Button size="md" disabled>
                    Continue
                  </Button>
                </div>
              </>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}

