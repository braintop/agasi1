import { useMemo, useState } from 'react'
import {
  CalendarCheck2,
  Check,
  ChevronLeft,
  Droplets,
  Flame,
  Sparkles,
  Utensils,
  X,
  Zap,
  Dumbbell,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../app/ui/card'
import { cn } from '../../app/utils/cn'

export function DailyControlCenterPage() {
  const navigate = useNavigate()

  // Mock for now – we’ll hook real data later
  const habitsDone = 0
  const habitsTotal = 5
  const recoveryLabel = 'טוב'

  const week = useMemo(
    () => [
      { label: 'א׳', done: false },
      { label: 'ב׳', done: false },
      { label: 'ג׳', done: false },
      { label: 'ד׳', done: false },
      { label: 'ה׳', done: false },
      { label: 'ו׳', done: false },
      { label: 'ש׳', done: false },
    ],
    [],
  )

  const smartAssumptions = useMemo(
    () => [
      'אימון מתוכנן → סומן כביצוע',
      'תפריט קיים → סומן כנאכל',
      'קרדיו מחובר לשעון → נכנס אוטומטית',
      'צעדים / שינה → נקלט אוטומטית',
    ],
    [],
  )

  const [aiAnswers, setAiAnswers] = useState<Record<string, boolean | null>>({
    cardioDone: null,
    nutritionDone: null,
  })
  const [aiDismissed, setAiDismissed] = useState<Record<string, boolean>>({
    cardioDone: false,
    nutritionDone: false,
  })

  return (
    <div className="w-full space-y-5 pb-10">
      {/* סטטוס היום */}
      <Card className="border border-white/10 bg-surface">
        <CardHeader className="mb-0 pb-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">סטטוס היום</CardTitle>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary"
              aria-label="פתח"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="mt-0 space-y-4 pt-2">
          <div className="grid gap-3 md:grid-cols-4">
            <StatusChip
              label="אימון"
              value="אימון"
              icon={<Dumbbell className="h-4 w-4" />}
            />
            <StatusChip
              label="תזונה"
              value="תזונה"
              icon={<Utensils className="h-4 w-4" />}
            />
            <StatusChip
              label="הרגלים"
              value={`${habitsDone} / ${habitsTotal}`}
              icon={<CalendarCheck2 className="h-4 w-4" />}
            />
            <StatusChip
              label="התאוששות"
              value={recoveryLabel}
              icon={<Droplets className="h-4 w-4" />}
            />
          </div>

          <button
            type="button"
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-2xl',
              'bg-[color:var(--primary)] px-4 py-4 text-sm font-semibold text-bg',
              'hover:bg-[color:var(--primary-dark)]',
            )}
          >
            <Zap className="h-4 w-4" />
            סיימתי את היום
          </button>

          <p className="text-center text-[11px] text-text-secondary/80">
            לחיצה אחת – וכל היום נסגר
          </p>
        </CardContent>
      </Card>

      {/* גריד אמצעי */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* רצף נוכחי */}
        <Card className="border border-white/10 bg-surface">
          <CardHeader className="mb-0 pb-2">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-text-secondary">
                <span className="text-[color:var(--primary)]">↗</span>
                שיא: 11
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
                <Flame className="h-4 w-4" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-text-primary">
                רצף נוכחי
              </div>
              <div className="mt-1 text-4xl font-semibold text-text-primary">0</div>
            </div>

            <div className="flex items-center justify-between gap-2" dir="ltr">
              {week.map((d) => (
                <div key={d.label} className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border',
                      d.done
                        ? 'border-transparent bg-[color:var(--primary-25)] text-[color:var(--primary)]'
                        : 'border-white/10 bg-white/5 text-text-secondary',
                    )}
                  >
                    {d.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-text-secondary">
              <span className="text-[color:var(--primary)]">🎉</span>{' '}
              שיא אישי חדש! המשך כך.
            </div>
          </CardContent>
        </Card>

        {/* הנחות חכמות להיום */}
        <Card className="border border-white/10 bg-surface">
          <CardHeader className="mb-0 pb-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">הנחות חכמות להיום</CardTitle>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {smartAssumptions.map((row) => (
              <div
                key={row}
                className="flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3"
              >
                <span className="text-sm text-text-primary/90">{row}</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--primary-15)] text-[color:var(--primary)]">
                  <Check className="h-4 w-4" />
                </span>
              </div>
            ))}

            <div className="mt-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-xs text-text-secondary">
              המערכת משלימה נתונים כדי לחסוך זמן
            </div>
          </CardContent>
        </Card>
      </div>

      {/* עדכון מהיר */}
      <Card className="border border-white/10 bg-surface">
        <CardHeader className="mb-0 pb-2">
          <CardTitle className="text-base">עדכון מהיר (אופציונלי)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <QuickUpdateButton
            label="עדכון הרגלים"
            icon={<Droplets className="h-4 w-4" />}
            onClick={() => navigate('/habits')}
          />
          <QuickUpdateButton
            label="עדכון אוכל"
            icon={<Utensils className="h-4 w-4" />}
            onClick={() => navigate('/nutrition')}
          />
          <QuickUpdateButton
            label="עדכון אימון"
            icon={<Dumbbell className="h-4 w-4" />}
            onClick={() => navigate('/training')}
          />
        </CardContent>
      </Card>

      {/* AI עוזר לנהל את היום */}
      <Card className="border border-white/10 bg-surface">
        <CardHeader className="mb-0 pb-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">AI עוזר לנהל את היום</CardTitle>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {!aiDismissed.cardioDone && (
            <AiQuestionRow
              question="נראה שביצעת קרדיו היום לפי השעון – נסמן כהושלם?"
              value={aiAnswers.cardioDone}
              onDismiss={() => setAiDismissed((p) => ({ ...p, cardioDone: true }))}
              onAnswer={(v) => setAiAnswers((p) => ({ ...p, cardioDone: v }))}
            />
          )}
          {!aiDismissed.nutritionDone && (
            <AiQuestionRow
              question="לא סימנת תזונה היום – נאכל לפי התפריט?"
              value={aiAnswers.nutritionDone}
              onDismiss={() =>
                setAiDismissed((p) => ({ ...p, nutritionDone: true }))
              }
              onAnswer={(v) => setAiAnswers((p) => ({ ...p, nutritionDone: v }))}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusChip({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3">
      <div className="text-right">
        <div className="text-xs text-text-secondary/80">{label}</div>
        <div className="text-sm font-semibold text-text-primary">{value}</div>
      </div>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
        {icon}
      </span>
    </div>
  )
}

function QuickUpdateButton({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-4 text-right',
        'hover:bg-white/10',
      )}
    >
      <span className="text-sm font-semibold text-text-primary">{label}</span>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
        {icon}
      </span>
    </button>
  )
}

function AiQuestionRow({
  question,
  value,
  onAnswer,
  onDismiss,
}: {
  question: string
  value: boolean | null
  onAnswer: (v: boolean) => void
  onDismiss: () => void
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface-2 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary"
          aria-label="הסתר"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex-1 text-right text-sm text-text-primary/90">
          {question}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAnswer(false)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold',
              value === false
                ? 'bg-[color:var(--primary)] text-bg'
                : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary',
            )}
          >
            לא
            {value === false ? <Check className="h-3.5 w-3.5" /> : null}
          </button>
          <button
            type="button"
            onClick={() => onAnswer(true)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold',
              value === true
                ? 'bg-[color:var(--primary)] text-bg'
                : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary',
            )}
          >
            כן
            {value === true ? <Check className="h-3.5 w-3.5" /> : null}
          </button>
        </div>
      </div>
    </div>
  )
}

