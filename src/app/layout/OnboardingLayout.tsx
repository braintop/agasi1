import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../utils/cn'

const ONBOARDING_STEPS = [
  { id: 'welcome', label: 'ברוכים הבאים', path: '/welcome' },
  { id: 'basics', label: 'פרטים בסיסיים', path: '/basics' },
  { id: 'goals', label: 'מטרות', path: '/goals' },
  { id: 'fitness', label: 'כושר', path: '/fitness' },
  { id: 'lifestyle', label: 'אורח חיים', path: '/lifestyle' },
  { id: 'nutrition', label: 'תזונה', path: '/nutrition' },
  { id: 'complete', label: 'סיום', path: '/complete' },
] as const

function StepDots({
  currentIndex,
}: {
  currentIndex: number
}) {
  return (
    <div className="mx-auto mb-6 flex w-full max-w-3xl items-center justify-center gap-2 px-1 lg:hidden">
      {ONBOARDING_STEPS.map((step, index) => {
        const isActive = index === currentIndex
        const isDone = currentIndex !== -1 && index <= currentIndex

        return (
          <Link
            key={step.id}
            to={step.path}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors',
              // Default: background like screen, thin white border, white text
              'bg-transparent text-text-primary border border-white/60',
              // Progress: filled with the same brown as primary buttons
              isDone && 'border-transparent bg-[#C98A6B] text-text-primary',
              // Current step gets a subtle ring for clarity
              isActive && 'ring-2 ring-[#C98A6B]/60 ring-offset-2 ring-offset-bg',
            )}
            aria-current={isActive ? 'step' : undefined}
            title={step.label}
          >
            {index + 1}
          </Link>
        )
      })}
    </div>
  )
}

export function OnboardingLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const isWelcome = location.pathname === '/welcome'
  const STEPS_WITH_OWN_ACTIONS = [
    '/basics',
    '/goals',
    '/fitness',
    '/lifestyle',
    '/nutrition',
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
      {/* כותרת עליונה + סטפר אופקי בדסקטופ */}
      <header className="sticky top-0 z-20 bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C98A6B] text-sm font-semibold text-bg">
              Y
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">Younger</span>
              <span className="text-xs text-text-secondary">
                תהליך התחלה מותאם לאריכות ימים
              </span>
            </div>
          </div>
        </div>

        {/* סטפר – רק במסכים רחבים */}
        <nav className="hidden border-t border-border/60 lg:block">
          <div className="mx-auto flex max-w-5xl items-center gap-1.5 px-4 py-2">
            {ONBOARDING_STEPS.map((step, index) => {
              const isActive = location.pathname === step.path
              const isCompleted =
                currentIndex !== -1 && index < currentIndex && !isActive

              return (
                <Link
                  key={step.id}
                  to={step.path}
                  className={cn(
                    'flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-colors',
                    isActive
                      ? 'bg-[#A96D51] text-[#2F2626] shadow-card'
                      : isCompleted
                        ? 'bg-transparent text-text-primary'
                        : 'bg-transparent text-text-secondary hover:bg-surface-2/60',
                  )}
                >
                  <span className="text-[10px]">{index + 1}</span>
                  <span>{step.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </header>

      {/* תוכן המסך – ממורכז, בלי תפריט צדדי */}
      <main className="mx-auto flex max-w-2xl flex-col px-4 pb-32 pt-8">
        {/* מד־התקדמות: 1–6 (מעל כפתורי המשך/חזור בכל מסך) */}
        <StepDots currentIndex={currentIndex} />
        <Outlet />
      </main>

      {!isStepWithOwnActions && (
        <footer className="fixed inset-x-0 bottom-0 z-20 bg-surface-2/90 px-4 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            {isWelcome ? (
              <div className="flex w-full justify-center">
                <Button
                  size="lg"
                  className="w-full max-w-md"
                  onClick={() => navigate('/basics')}
                  rightIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  בוא נתחיל
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col text-xs text-text-secondary">
                  <span>ניווט בין השלבים מתבצע עם כפתורי אחורה / המשך בכל מסך.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="md" disabled>
                    אחורה
                  </Button>
                  <Button size="md" disabled>
                    המשך
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

