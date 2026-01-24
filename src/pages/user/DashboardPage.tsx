import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Footprints,
  Moon,
  CalendarCheck2,
  Dumbbell,
  HeartPulse,
  Utensils,
  X,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../app/ui/card'
import { Button } from '../../app/ui/button'
import { cn } from '../../app/utils/cn'
import {
  explainScoreBreakdown,
  longevityScore,
  todayActions,
} from '../../app/mock/dashboard'
import { RightDrawer } from '../../app/ui/right-drawer'

export function DashboardPage() {
  const navigate = useNavigate()
  const [explainOpen, setExplainOpen] = useState(false)

  const completedCount = 1
  const totalCount = 4
  const progressPct = 25

  const weekDays = useMemo(
    () => [
      { day: 27, month: 'ינו׳' },
      { day: 26, month: 'ינו׳' },
      { day: 25, month: 'ינו׳' },
      { day: 24, month: 'ינו׳', selected: true },
      { day: 23, month: 'ינו׳' },
      { day: 22, month: 'ינו׳' },
      { day: 21, month: 'ינו׳' },
    ],
    [],
  )

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-10">
      {/* כרטיס ציון (עיצוב ירוק) */}
      <Card
        className="border-none shadow-card"
        style={{
          background:
            'linear-gradient(135deg, rgba(99,215,190,0.95) 0%, rgba(124,207,185,0.95) 100%)',
        }}
      >
        <CardContent className="space-y-3 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 text-right">
              <div className="text-sm font-semibold text-bg">ציון אריכות ימים</div>
              <div className="text-xs text-bg/80">
                ↗ {longevityScore.trend.replace('this week', 'השבוע')}
              </div>
              <div className="text-xs text-bg/70">{longevityScore.explanation}</div>
              <Button
                size="sm"
                className="mt-2 h-8 rounded-full bg-black/70 px-5 text-[11px] text-white hover:bg-black/80"
                onClick={() => setExplainOpen(true)}
              >
                הסבר על הציון שלי
              </Button>
            </div>
            <div className="text-6xl font-semibold leading-none text-bg">
              {longevityScore.value}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* שורת ימים */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-text-primary hover:bg-white/10"
          aria-label="שבוע קודם"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="flex flex-1 items-center justify-center gap-2">
          {weekDays.map((d) => (
            <button
              key={d.day}
              type="button"
              className={cn(
                'flex h-12 w-12 flex-col items-center justify-center rounded-2xl',
                d.selected
                  ? 'bg-[color:var(--primary)] text-bg'
                  : 'bg-surface text-text-primary',
              )}
              aria-current={d.selected ? 'date' : undefined}
            >
              <span className="text-sm font-semibold leading-none">{d.day}</span>
              <span className="mt-1 text-[10px] leading-none opacity-80">
                {d.month}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-text-primary hover:bg-white/10"
          aria-label="שבוע הבא"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* 4 מדדים */}
      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard
          title="שינה"
          value="6.5"
          unit="שעות"
          icon={<Moon className="h-4 w-4" />}
          status="טוב"
        />
        <MetricCard
          title="צעדים יומיים"
          value="8,900"
          unit="צעדים"
          icon={<Footprints className="h-4 w-4" />}
          status="טוב"
        />
        <MetricCard
          title="רמת לחץ"
          value="נמוכה"
          unit=""
          icon={<Activity className="h-4 w-4" />}
          status="טוב"
        />
        <MetricCard
          title="קלוריות שנשרפו"
          value="3,400"
          unit="קק״ל"
          icon={<Flame className="h-4 w-4" />}
          status="בינוני"
        />
      </div>

      {/* רצף – ריבועים */}
      <Card className="border-none bg-surface">
        <CardContent className="space-y-4 py-5">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-sm font-semibold text-text-primary">רצף נוכחי</div>
              <div className="text-lg font-semibold text-[color:var(--primary)]">
                6 ימים
              </div>
            </div>
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
              <Flame className="h-4 w-4" />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[true, false, true, true, true, true, true].map((done, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex h-12 w-full items-center justify-center rounded-2xl border',
                  done
                    ? 'border-transparent bg-[color:var(--primary-25)]'
                    : 'border-white/10 bg-white/5',
                )}
              >
                {done && <Check className="h-4 w-4 text-[color:var(--primary)]" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* פעולות היום */}
      <Card className="border-none bg-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-text-primary">
            פעולות היום
          </CardTitle>
          <div className="mt-1 flex items-center justify-between text-[11px] text-text-secondary/80">
            <span>הושלמו {completedCount} מתוך {totalCount} היום</span>
            <span>{progressPct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[color:var(--primary)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {todayActions.map((action) => {
            const isActive = action.id === 'workout'
            const status = (action as { uiStatus?: 'ok' | 'fail' }).uiStatus ?? 'ok'
            const kind = (action as { kind?: string }).kind ?? action.id

            const Icon =
              kind === 'strength'
                ? Dumbbell
                : kind === 'cardio'
                  ? HeartPulse
                  : kind === 'nutrition'
                    ? Utensils
                    : CalendarCheck2

            return (
              <button
                key={action.id}
                type="button"
                onClick={() => navigate(action.to)}
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-right transition-colors',
                  isActive
                    ? 'border-[color:var(--primary)] bg-[color:var(--primary-15)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10',
                )}
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-text-primary">{action.title}</div>
                  <div className="text-[11px] text-text-secondary/80">{action.subtitle}</div>
                  {action.id === 'nutrition' && action.actionLabel && (
                    <div className="text-[11px] text-text-secondary/80">{action.actionLabel}</div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* ב־RTL האייקון צריך להיות בקצה הימני */}
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={cn(
                      'inline-flex h-[18px] w-[18px] items-center justify-center rounded-full',
                      status === 'fail'
                        ? 'bg-[#C96B6B] text-white'
                        : 'bg-[color:var(--primary)] text-bg',
                    )}
                  >
                    {status === 'fail' ? (
                      <X className="h-[11px] w-[11px]" />
                    ) : (
                      <Check className="h-[11px] w-[11px]" />
                    )}
                  </span>
                </div>
              </button>
            )
          })}
        </CardContent>
      </Card>

      <RightDrawer
        open={explainOpen}
        onClose={() => setExplainOpen(false)}
        title="איך ציון הלונג׳ביטי מחושב"
      >
        <div className="space-y-5">
          <div className="space-y-2">
            {[
              { label: 'אימונים', value: explainScoreBreakdown.workouts },
              { label: 'קרדיו', value: explainScoreBreakdown.cardio },
              { label: 'תזונה', value: explainScoreBreakdown.nutrition },
              { label: 'שינה', value: explainScoreBreakdown.sleep },
            ].map((row) => {
              const pill =
                row.value === 'טוב'
                  ? 'bg-[#8FAF9A] text-[#2F2626]'
                  : row.value === 'בינוני'
                    ? 'bg-[#D6A77A] text-[#2F2626]'
                    : 'bg-[#C96B6B] text-white'
              return (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3"
                >
                  <span className="text-sm text-text-primary">{row.label}</span>
                  <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', pill)}>
                    {row.value}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-surface-2 via-surface-2 to-surface px-4 py-4">
            <div className="text-sm font-semibold text-text-primary">המלצה</div>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {explainScoreBreakdown.recommendation}
            </p>
          </div>
        </div>
      </RightDrawer>
    </div>
  )
}

function MetricCard({
  title,
  value,
  unit,
  icon,
  status,
}: {
  title: string
  value: string
  unit: string
  icon: ReactNode
  status: 'טוב' | 'בינוני' | 'חלש'
}) {
  const pill =
    status === 'טוב'
      ? 'bg-[color:var(--primary)] text-bg'
      : status === 'בינוני'
        ? 'bg-[#D6A77A] text-bg'
        : 'bg-[#C96B6B] text-white'

  return (
    <Card className="border-none bg-surface">
      <CardContent className="relative min-h-[128px] py-5">
        <div className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
          {icon}
        </div>
        <div className="text-right">
          <div className="text-xs text-text-secondary/80">{title}</div>
          <div className="mt-2 text-3xl font-semibold text-text-primary">{value}</div>
          {unit ? <div className="text-xs text-text-secondary/80">{unit}</div> : null}
          <span
            className={cn(
              'absolute bottom-4 right-4 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold',
              pill,
            )}
          >
            {status}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

