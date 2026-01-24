import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Brain,
  Flame,
  ChevronLeft,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
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
import { Modal } from '../../app/ui/modal'
import { getJSON, setJSON } from '../../app/utils/storage'

export function DashboardPage() {
  const navigate = useNavigate()
  const [explainOpen, setExplainOpen] = useState(false)

  const completedCount = useMemo(
    () => todayActions.filter((a) => a.completed).length,
    [],
  )
  const totalCount = todayActions.length
  const progressPct = Math.round((completedCount / totalCount) * 100)

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

  return (
    <div className="space-y-8 pb-10">
      {/* SECTION 1: Longevity Core */}
      <Card className="relative overflow-hidden border-none bg-gradient-to-r from-[#2F2626] via-[#2F2626] to-[#4a3730] shadow-card">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#C98A6B]/25 via-transparent to-transparent" />
        <CardHeader className="relative pb-2">
          <CardTitle className="text-base text-text-primary">
            Longevity Score
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-3 pb-6">
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-semibold tracking-tight text-text-primary">
                {longevityScore.value}
              </span>
              <span className="text-sm text-[#8FAF9A]">
                ↑ {longevityScore.trend}
              </span>
            </div>
          </div>

          <p className="text-sm text-text-secondary">{longevityScore.explanation}</p>

          <Button size="sm" className="mt-2" onClick={() => setExplainOpen(true)}>
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
              רצף נוכחי: <span className="font-semibold">{streaks.current} ימים</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {streaks.last7Days.map((done, idx) => (
              <span
                key={idx}
                className={cn(
                  'h-3.5 w-3.5 rounded-full border',
                  done
                    ? 'border-[#10B981]/50 bg-[#10B981]'
                    : 'border-white/20 bg-white/5',
                )}
              />
            ))}
          </div>

          <p className="text-xs text-text-secondary/80">
            שמור על רצף יומי לשיפור ארוך טווח.
          </p>
        </CardContent>
      </Card>

      {/* SECTION 3: Daily Actions */}
      <Card className="border-none bg-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">הפעולות שלך להיום</CardTitle>
          <CardDescription className="text-xs text-text-secondary">
            הושלמו {completedCount} מתוך {totalCount} היום
          </CardDescription>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#C98A6B]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {todayActions.map((action) => {
            const isNutrition = action.id === 'nutrition'
            const isCompleted = action.completed
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => navigate(action.to)}
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors',
                  isCompleted
                    ? 'border-transparent bg-[#C98A6B] text-text-primary'
                    : 'border-white/15 bg-bg/30 text-text-primary hover:bg-white/5',
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{action.title}</span>
                  <span className={cn('text-xs', isCompleted ? 'text-text-primary/90' : 'text-text-secondary/80')}>
                    {action.subtitle}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm">{action.status}</span>
                  {isNutrition && action.actionLabel && (
                    <span className="text-xs font-medium text-text-primary">
                      {action.actionLabel}
                    </span>
                  )}
                  {!isNutrition && (
                    <ChevronLeft className={cn('h-4 w-4', isCompleted ? 'text-text-primary' : 'text-text-secondary/70')} />
                  )}
                </div>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* SECTION 4: Daily AI Insight */}
      <Card className="border-none bg-gradient-to-r from-surface-2 via-surface-2 to-surface">
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6]">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">התובנה היומית שלך</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              תובנה אחת ביום, קצרה ומעשית.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-end justify-between gap-4">
          <p className="text-sm text-text-secondary line-clamp-2">
            {dailyInsight.user_message}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/aiinsights')}
          >
            קרא עוד
          </Button>
        </CardContent>
      </Card>

      {/* SECTION 5: Streaks & Progress Summary */}
      <Card className="border-none bg-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">סיכום רצפים</CardTitle>
          <CardDescription className="text-xs text-text-secondary">
            עקביות היא המפתח ללונג׳ביטי.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2">
            <span className="text-text-primary">רצף אימונים</span>
            <span className="font-semibold text-text-primary">{streaks.workouts} ימים</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2">
            <span className="text-text-primary">רצף קרדיו</span>
            <span className="font-semibold text-text-primary">{streaks.cardio} ימים</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2">
            <span className="text-text-primary">רצף צ׳ק‑אין</span>
            <span className="font-semibold text-text-primary">{streaks.checkIn} ימים</span>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={explainOpen}
        onClose={() => setExplainOpen(false)}
        title="איך הציון מחושב?"
      >
        <div className="space-y-3 text-sm">
          <div className="space-y-2">
            {[
              { label: 'אימונים', value: explainScoreBreakdown.workouts },
              { label: 'קרדיו', value: explainScoreBreakdown.cardio },
              { label: 'תזונה', value: explainScoreBreakdown.nutrition },
              { label: 'שינה', value: explainScoreBreakdown.sleep },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2"
              >
                <span className="text-sm text-text-primary">{row.label}</span>
                <span className="text-sm font-semibold text-text-primary">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border/70 bg-surface px-3 py-2 text-sm text-text-secondary">
            {explainScoreBreakdown.recommendation}
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={() => setExplainOpen(false)}>
              סגירה
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

