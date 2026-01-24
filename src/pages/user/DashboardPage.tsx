import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarCheck2,
  Check,
  Dumbbell,
  Flame,
  HeartPulse,
  Sparkles,
  TrendingUp,
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
  aiDailyInsightPreview,
  explainScoreBreakdown,
  longevityScore,
  streaks,
  todayActions,
} from '../../app/mock/dashboard'
import { RightDrawer } from '../../app/ui/right-drawer'
import { getJSON, setJSON } from '../../app/utils/storage'

export function DashboardPage() {
  const navigate = useNavigate()
  const [explainOpen, setExplainOpen] = useState(false)

  // The Figma shows "Completed 1 of 4 today" + 25%
  // (even though action tiles show multiple status icons).
  // We mirror the screenshot exactly for now.
  const completedCount = 1
  const totalCount = 4
  const progressPct = 25

  const dailyInsight = useMemo(() => {
    const key = 'ai.dailyInsight'
    const todayISO = new Date().toISOString().slice(0, 10)
    const existing = getJSON<{ dateISO: string; user_message: string; coach_message: string } | null>(
      key,
      null,
    )

    if (existing && existing.dateISO === todayISO) return existing

    const next = {
      dateISO: todayISO,
      user_message: aiDailyInsightPreview.user_message,
      coach_message: aiDailyInsightPreview.coach_message,
    }
    setJSON(key, next)
    return next
  }, [])

  const actionIconStyle = (kind: string) => {
    if (kind === 'strength') {
      return {
        wrap: 'bg-[#8FAF9A]/25',
        icon: 'text-[#8FAF9A]',
      }
    }
    return {
      wrap: 'bg-[#C98A6B]/18',
      icon: 'text-[#C98A6B]',
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-10">
      {/* SECTION 1: Longevity Core */}
      <Card className="border-none bg-[#C98A6B] shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#2F2626]">
            ציון לונג׳ביטי
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pb-6">
          <div className="flex items-end gap-3">
            <span className="text-5xl font-semibold tracking-tight text-[#2F2626]">
              {longevityScore.value}
            </span>
            <span className="text-xs font-medium text-[#2F2626]/80">
              ↗ {longevityScore.trend}
            </span>
          </div>
          <p className="text-xs text-[#2F2626]/80">{longevityScore.explanation}</p>
          <Button
            size="sm"
            className="mt-2 h-7 rounded-full bg-[#0b0b0b] px-4 text-[11px] text-white hover:bg-[#0b0b0b]/90"
            onClick={() => setExplainOpen(true)}
          >
            הסבר את הציון שלי
          </Button>
        </CardContent>
      </Card>

      {/* SECTION 2: Streak & Consistency */}
      <Card className="border-none bg-surface">
        <CardContent className="flex flex-col gap-3 py-4">
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <Flame className="h-4 w-4" style={{ color: '#D6A77A' }} />
            <span>
              רצף נוכחי{' '}
              <span className="font-semibold">{streaks.current} ימים</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {streaks.last7Days.map((done, idx) => {
              const isOff = !done
              return (
                <span
                  key={idx}
                  className={cn(
                    'inline-flex h-5 w-5 items-center justify-center rounded-full',
                    done ? 'bg-[#8FAF9A]' : 'bg-white/10',
                  )}
                >
                  {!isOff && <Check className="h-3 w-3 text-[#2F2626]" />}
                </span>
              )
            })}
          </div>

          <p className="text-xs text-text-secondary/80">עקביות בונה לונג׳ביטי.</p>
        </CardContent>
      </Card>

      {/* SECTION 3: Daily Actions */}
      <Card className="border-none bg-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-text-primary">
            הפעולות שלך להיום
          </CardTitle>
          <div className="mt-1 flex items-center justify-between text-[11px] text-text-secondary/80">
            <span>
              הושלמו {completedCount} מתוך {totalCount} היום
            </span>
            <span>{progressPct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#C98A6B]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {todayActions.map((action) => {
            const isActive = action.id === 'workout' // matches screenshot highlight
            const status = (action as { uiStatus?: 'ok' | 'fail' }).uiStatus ?? 'ok'
            const kind = (action as { kind?: string }).kind ?? action.id

            const LeftIcon =
              kind === 'strength'
                ? Dumbbell
                : kind === 'cardio'
                  ? HeartPulse
                  : kind === 'nutrition'
                    ? Utensils
                    : CalendarCheck2

            const iconTone = actionIconStyle(kind)

            return (
              <button
                key={action.id}
                type="button"
                onClick={() => navigate(action.to)}
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors',
                  isActive
                    ? 'border-[#8FAF9A] bg-[#3f4540] text-text-primary'
                    : 'border-white/15 bg-surface-2 text-text-primary hover:bg-white/5',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-full',
                      iconTone.wrap,
                    )}
                  >
                    <LeftIcon className={cn('h-4 w-4', iconTone.icon)} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">{action.title}</span>
                    <span className="text-[11px] text-text-secondary/80">
                      {action.subtitle}
                    </span>
                    {action.id === 'nutrition' && action.actionLabel && (
                      <span className="text-[11px] text-text-secondary/80">
                        {action.actionLabel}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={cn(
                    'inline-flex h-6 w-6 items-center justify-center rounded-full',
                    status === 'fail'
                      ? 'bg-[#C96B6B] text-white'
                      : 'bg-[#8FAF9A] text-[#2F2626]',
                  )}
                  aria-label={status === 'fail' ? 'Not completed' : 'Completed'}
                >
                  {status === 'fail' ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </span>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* SECTION 4: Daily AI Insight */}
      <Card className="border-none bg-gradient-to-br from-surface-2 via-surface-2 to-surface">
        <CardContent className="space-y-2 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Sparkles className="h-4 w-4 text-[#C98A6B]" />
            <span>התובנה היומית שלך</span>
          </div>
          <p className="text-xs text-text-secondary/80">{dailyInsight.user_message}</p>
          <button
            type="button"
            className="text-xs font-medium text-[#C98A6B] hover:underline"
            onClick={() => navigate('/aiinsights')}
          >
            קרא עוד →
          </button>
        </CardContent>
      </Card>

      {/* SECTION 5: Streaks & Progress Summary */}
      <Card className="border-none bg-surface">
        <CardContent className="space-y-3 py-4">
          <div className="text-sm font-semibold text-text-primary">רצפים</div>
          <div className="space-y-2 text-sm">
            {[
              {
                label: 'רצף אימונים',
                value: `${streaks.workouts} ימים`,
                icon: <TrendingUp className="h-3.5 w-3.5" />,
              },
              {
                label: 'רצף קרדיו',
                value: `${streaks.cardio} ימים`,
                icon: <HeartPulse className="h-3.5 w-3.5" />,
              },
              {
                label: 'רצף צ׳ק‑אין',
                value: `${streaks.checkIn} ימים`,
                icon: <CalendarCheck2 className="h-3.5 w-3.5" />,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#C98A6B]/15 text-[#C98A6B]">
                    {row.icon}
                  </span>
                  <span className="text-xs font-medium text-text-primary/90">
                    {row.label}
                  </span>
                </div>
                <span className="text-xs font-semibold text-text-primary">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary/80">
            עקביות היא המנוע החזק ביותר ללונג׳ביטי.
          </p>
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

