import { useMemo, useState } from 'react'
import {
  Check,
  ChevronLeft,
  Dumbbell,
  Edit3,
  Flame,
  Sparkles,
  Sun,
  Snowflake,
  Pill,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../app/ui/card'
import { cn } from '../../app/utils/cn'

export function DailyHabitsPage() {
  const navigate = useNavigate()

  const topTabs = useMemo(
    () => [
      { id: 'weekly', label: 'Weekly Check-in' },
      { id: 'progress', label: 'התקדמות' },
      { id: 'weeklyInsights', label: 'תובנות שבועיות' },
      { id: 'training', label: 'אימון כח ואירובי' },
      { id: 'habits', label: 'הרגלים יומיים', active: true },
    ],
    [],
  )

  type HabitKey = 'sauna' | 'sun' | 'meditation' | 'cold'

  const [done, setDone] = useState<Record<HabitKey, boolean>>({
    sauna: false,
    sun: false,
    meditation: false,
    cold: false,
  })

  const supplements = useMemo(
    () => [
      { name: 'ויטמין D3', detail: 'IU 5000', done: false },
      { name: 'אומגה 3', detail: '2g', done: false },
      { name: 'מגנזיום', detail: '400mg', done: false },
      { name: 'ויטמין K2', detail: '200mcg', done: false },
    ],
    [],
  )
  const [suppDone, setSuppDone] = useState<boolean[]>(
    () => supplements.map((s) => s.done),
  )

  const totalHabits = 5
  const doneCount =
    Object.values(done).filter(Boolean).length +
    (suppDone.some(Boolean) ? 1 : 0)

  const toggleHabit = (k: HabitKey) => setDone((p) => ({ ...p, [k]: !p[k] }))

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Top pills */}
      <div className="flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {topTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                if (t.id === 'training') navigate('/training')
              }}
              className={cn(
                'rounded-full border px-4 py-2 text-xs font-semibold transition-colors',
                t.active
                  ? 'border-transparent bg-[color:var(--primary)] text-bg'
                  : 'border-white/10 bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary',
              )}
            >
              <span className="inline-flex items-center gap-2">
                {t.id === 'training' ? <Dumbbell className="h-4 w-4" /> : null}
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-text-primary">הרגלים יומיים</h1>
        <p className="mt-1 text-sm text-text-secondary">
          הרגלים קטנים שמייצרים אריכות חיים
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* AI coach card */}
        <Card className="border border-white/10 bg-surface">
          <CardHeader className="mb-0 pb-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-right">
                <CardTitle className="text-base">AI מאמן אישי</CardTitle>
                <p className="mt-1 text-xs text-text-secondary">
                  תובנות והמלצות מותאמות אישית
                </p>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {[
              {
                tag: 'התאוששות',
                tone: 'bg-[#8B5CF6]/15 text-[#8B5CF6]',
                text: 'עקביות הסאונה שלך גבוהה — השפעה חיובית על ההתאוששות',
              },
              {
                tag: 'קרדיו',
                tone: 'bg-[#10B981]/15 text-[#10B981]',
                text: 'מומלץ להוסיף 10 דק׳ Zone 2 השבוע',
              },
              {
                tag: 'כח',
                tone: 'bg-[#38BDF8]/15 text-[#38BDF8]',
                text: 'המשקל שלך בלחיצת חזה עלה ב־10% בשבועיים האחרונים',
              },
            ].map((row) => (
              <div key={row.tag} className="rounded-2xl border border-white/10 bg-surface-2 px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className={cn('rounded-full px-3 py-1 text-[11px] font-semibold', row.tone)}>
                    {row.tag}
                  </span>
                  <span className="text-[color:var(--primary)]">↗</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-primary/90">
                  {row.text}
                </p>
              </div>
            ))}

            <button
              type="button"
              className={cn(
                'mt-1 w-full rounded-2xl bg-[color:var(--primary)] px-4 py-3 text-sm font-semibold text-bg',
                'hover:bg-[color:var(--primary-dark)]',
              )}
            >
              המלצות מותאמות
            </button>
            <button
              type="button"
              className={cn(
                'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-text-primary',
                'hover:bg-white/10',
              )}
            >
              התאמת שגרה <span className="ml-2 inline-block align-middle">⚙</span>
            </button>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-text-secondary/80">
              ההמלצות מבוססות על הנתונים שלך ועל מחקר עדכני בתחום אריכות ימים
            </div>
          </CardContent>
        </Card>

        {/* Habits grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-text-secondary">
              <span className="text-text-primary">היום</span>
              <span className="text-text-secondary/80">2026 בינואר 25</span>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary"
              aria-label="פתח"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <HabitCard
              title="סאונה"
              subtitle="לא בוצע"
              icon={<Flame className="h-5 w-5" />}
              done={done.sauna}
              onToggle={() => toggleHabit('sauna')}
            />

            <SupplementsCard
              items={supplements}
              checked={suppDone}
              onToggle={(idx) =>
                setSuppDone((p) => p.map((v, i) => (i === idx ? !v : v)))
              }
            />

            <HabitCard
              title="חשיפה לשמש"
              subtitle="7–15 דק׳"
              icon={<Sun className="h-5 w-5" />}
              done={done.sun}
              onToggle={() => toggleHabit('sun')}
            />

            <HabitCard
              title="נשימה / מדיטציה"
              subtitle="לא בוצע"
              icon={<Sparkles className="h-5 w-5" />}
              done={done.meditation}
              onToggle={() => toggleHabit('meditation')}
              compact
            />

            <HabitCard
              title="אמבטיית קרח"
              subtitle="לא בוצע"
              icon={<Snowflake className="h-5 w-5" />}
              done={done.cold}
              onToggle={() => toggleHabit('cold')}
              compact
            />
          </div>

          {/* Bottom adherence */}
          <Card className="border border-white/10 bg-surface">
            <CardContent className="space-y-3 py-5">
              <div className="text-center text-sm font-semibold text-text-primary">
                עקיבות היום: {doneCount} מתוך {totalHabits} הרגלים
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[color:var(--primary)]"
                  style={{ width: `${Math.round((doneCount / totalHabits) * 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function HabitCard({
  title,
  subtitle,
  icon,
  done,
  onToggle,
  compact,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  done: boolean
  onToggle: () => void
  compact?: boolean
}) {
  return (
    <Card className={cn('border border-white/10 bg-surface', compact && 'lg:col-span-1')}>
      <CardHeader className="mb-0 pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-right">
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="mt-1 text-xs text-text-secondary/80">{subtitle}</p>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
            {icon}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-colors',
            done
              ? 'bg-[color:var(--primary)] text-bg hover:bg-[color:var(--primary-dark)]'
              : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary',
          )}
        >
          {done ? 'הושלם' : 'סמן כביצוע'}
        </button>
      </CardContent>
    </Card>
  )
}

function SupplementsCard({
  items,
  checked,
  onToggle,
}: {
  items: { name: string; detail: string }[]
  checked: boolean[]
  onToggle: (idx: number) => void
}) {
  return (
    <Card className="border border-white/10 bg-surface">
      <CardHeader className="mb-0 pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-right">
            <CardTitle className="text-base">תוספים</CardTitle>
            <p className="mt-1 text-xs text-text-secondary/80">
              הושלמו 0/4
            </p>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
            <Edit3 className="h-4 w-4" />
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-2">
        {items.map((it, idx) => {
          const isOn = checked[idx] ?? false
          return (
            <button
              key={it.name}
              type="button"
              onClick={() => onToggle(idx)}
              className={cn(
                'flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-right transition-colors',
                'border-white/10 bg-white/5 hover:bg-white/10',
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'inline-flex h-5 w-5 items-center justify-center rounded-full border',
                    isOn
                      ? 'border-transparent bg-[color:var(--primary)] text-bg'
                      : 'border-white/20 bg-transparent text-transparent',
                  )}
                >
                  {isOn ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
                <div>
                  <div className="text-xs font-semibold text-text-primary">
                    {it.name}
                  </div>
                  <div className="text-[11px] text-text-secondary/80">{it.detail}</div>
                </div>
              </div>

              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
                <Pill className="h-4 w-4" />
              </span>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}

