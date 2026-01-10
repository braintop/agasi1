import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Activity, BarChart3, CheckCircle2, Dumbbell, HeartPulse, ArrowRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../app/ui/card'
import { Button } from '../../app/ui/button'
import { getJSON } from '../../app/utils/storage'
import { weightSeries } from '../../app/mock/weight'
import { getLastNDays, computeStreak, isWithinRange, parseISODate } from '../../app/utils/metrics'

type Range = 'week' | 'month'

interface WorkoutLog {
  id: string
  workoutId: string
  dateISO: string
  durationMin: number
  completed: boolean
  highlight: string
}

interface CardioLog {
  id: string
  dateISO: string
  type: string
  durationMin: number
  distanceKm?: number
}

interface CheckinLog {
  id: string
  dateISO: string
  mood: string
  energy: number
  stress: number
  sleepQuality: number
}

const WORKOUT_TARGETS = {
  week: 4,
  month: 16,
}

const CARDIO_MIN_TARGETS = {
  week: 90,
  month: 360,
}

const CHECKIN_TARGETS = {
  week: 7,
  month: 30,
}

export function ProgressPage() {
  const navigate = useNavigate()
  const [range, setRange] = useState<Range>('week')

  const workoutLogs = getJSON<WorkoutLog[]>('workout.logs', [])
  const cardioLogs = getJSON<CardioLog[]>('cardio.logs', [])
  const checkins = getJSON<CheckinLog[]>('checkins.logs', [])

  const { start, end, days } = useMemo(() => {
    const now = new Date()
    if (range === 'week') {
      const d = new Date(now)
      d.setDate(now.getDate() - 6)
      return { start: d, end: now, days: getLastNDays(7) }
    }
    const d = new Date(now)
    d.setDate(now.getDate() - 29)
    return { start: d, end: now, days: getLastNDays(30) }
  }, [range])

  const workoutsInRange = workoutLogs.filter((w) =>
    isWithinRange(parseISODate(w.dateISO), start, end),
  )
  const cardioInRange = cardioLogs.filter((c) =>
    isWithinRange(parseISODate(c.dateISO), start, end),
  )
  const checkinsInRange = checkins.filter((c) =>
    isWithinRange(parseISODate(c.dateISO), start, end),
  )

  const workoutsCompleted = workoutsInRange.length
  const cardioMinutes = cardioInRange.reduce(
    (sum, l) => sum + l.durationMin,
    0,
  )
  const streak = computeStreak(checkins)

  const workoutsScore = Math.min(
    (workoutsCompleted / WORKOUT_TARGETS[range]) * 100,
    100,
  )
  const cardioScore = Math.min(
    (cardioMinutes / CARDIO_MIN_TARGETS[range]) * 100,
    100,
  )
  const checkinScore = Math.min(
    (checkinsInRange.length / CHECKIN_TARGETS[range]) * 100,
    100,
  )
  const consistency = Math.round(
    (workoutsScore + cardioScore + checkinScore) / 3 || 0,
  )

  const cardioPerDay = days.map((d) => {
    const key = d.toISOString().slice(0, 10)
    const minutes = cardioInRange
      .filter((l) => l.dateISO.slice(0, 10) === key)
      .reduce((sum, l) => sum + l.durationMin, 0)
    return {
      date: d,
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
      minutes,
    }
  })

  const workoutsPerDay = days.map((d) => {
    const key = d.toISOString().slice(0, 10)
    const count = workoutsInRange.filter(
      (w) => w.dateISO.slice(0, 10) === key,
    ).length
    return {
      date: d,
      label:
        range === 'week'
          ? d.toLocaleDateString(undefined, { weekday: 'short' })
          : d.getDate().toString(),
      count,
    }
  })

  const weightData = weightSeries.map((p) => ({
    label: new Date(p.dateISO).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
    kg: p.kg,
  }))

  const summaryItems = buildSummary({
    workoutsCompleted,
    cardioMinutes,
    checkinCount: checkinsInRange.length,
    avgSleep:
      checkinsInRange.length === 0
        ? 0
        : checkinsInRange.reduce((s, c) => s + c.sleepQuality, 0) /
          checkinsInRange.length,
    range,
  })

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="px-0 text-xs text-text-secondary hover:text-text-primary"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowRight className="ml-1 h-4 w-4" />
          חזרה לדאשבורד
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-text-primary">
            התקדמות
          </h1>
          <p className="text-sm text-text-secondary">
            לראות מגמות ורמת עקביות.
          </p>
        </div>
        <div className="inline-flex rounded-full bg-surface-2 p-1 text-xs">
          <button
            type="button"
            onClick={() => setRange('week')}
            className={`rounded-full px-3 py-1.5 font-medium ${
              range === 'week'
                ? 'bg-bg text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            שבוע
          </button>
          <button
            type="button"
            onClick={() => setRange('month')}
            className={`rounded-full px-3 py-1.5 font-medium ${
              range === 'month'
                ? 'bg-bg text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            חודש
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard
          label="אימונים"
          value={workoutsCompleted.toString()}
          helper={range === 'week' ? 'הושלמו השבוע' : 'הושלמו החודש'}
          icon={<Dumbbell className="h-4 w-4 text-emerald-400" />}
        />
        <KpiCard
          label="דקות קרדיו"
          value={cardioMinutes.toString()}
          helper="בטווח הנבחר"
          icon={<HeartPulse className="h-4 w-4 text-sky-400" />}
        />
        <KpiCard
          label="רצף צ׳ק‑אין"
          value={streak.toString()}
          helper="ימים רצופים"
          icon={<CheckCircle2 className="h-4 w-4 text-amber-300" />}
        />
        <KpiCard
          label="עקביות"
          value={`${consistency}%`}
          helper="ציון משוקלל"
          icon={<Activity className="h-4 w-4 text-[#10B981]" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-none bg-surface">
          <CardHeader>
            <CardTitle className="text-sm">דקות קרדיו ליום</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              {range === 'week' ? '7 הימים האחרונים' : '30 הימים האחרונים'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-48">
            {cardioInRange.length === 0 ? (
              <EmptyChartMessage target="cardio" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cardioPerDay}>
                  <defs>
                    <linearGradient id="cardioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" />
                  <XAxis dataKey="label" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: '#374151',
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="#10B981"
                    fill="url(#cardioGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-none bg-surface">
          <CardHeader>
            <CardTitle className="text-sm">אימונים שהושלמו</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              {range === 'week'
                ? 'לפי ימים השבוע'
                : 'לפי ימים החודש (תצוגה מהירה)'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-48">
            {workoutsInRange.length === 0 ? (
              <EmptyChartMessage target="workouts" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workoutsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" />
                  <XAxis dataKey="label" stroke="#6b7280" />
                  <YAxis allowDecimals={false} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: '#374151',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-none bg-surface">
          <CardHeader>
            <CardTitle className="text-sm">מגמת משקל</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              נתונים לדוגמה – בעתיד יסונכרנו עם המשקל שלך.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" />
                <XAxis dataKey="label" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="kg"
                  stroke="#6366F1"
                  fill="url(#weightGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="border-none bg-surface">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm">סיכום</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              נקודות עיקריות מה{range === 'week' ? 'שבוע' : 'חודש'} האחרון.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="text-xs"
            onClick={() => (window.location.href = '/aiinsights')}
          >
            <BarChart3 className="mr-1 h-3 w-3" />
            צפייה בתובנות AI
          </Button>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-text-secondary">
          {summaryItems.length === 0 ? (
            <p>
              עדיין אין נתונים. התחל מסיום אימון, רישום קרדיו או צ׳ק‑אין יומי.
            </p>
          ) : (
            <ul className="list-disc space-y-1 pl-4">
              {summaryItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function KpiCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string
  value: string
  helper: string
  icon: React.ReactNode
}) {
  return (
    <Card className="border-none bg-surface-2">
      <CardContent className="flex items-center gap-3 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-bg">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary/80">
            {label}
          </p>
          <p className="mt-0.5 text-lg font-semibold text-text-primary">
            {value}
          </p>
          <p className="text-[11px] text-text-secondary/80">{helper}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyChartMessage({ target }: { target: 'workouts' | 'cardio' }) {
  const label =
    target === 'cardio'
      ? 'עדיין אין נתוני קרדיו. רשום סשן כדי לראות את הגרף.'
      : 'עדיין אין נתוני אימונים. השלם אימון כדי לראות את הגרף.'
  return (
    <div className="flex h-full items-center justify-center text-xs text-text-secondary/80">
      {label}
    </div>
  )
}

function buildSummary({
  workoutsCompleted,
  cardioMinutes,
  checkinCount,
  avgSleep,
  range,
}: {
  workoutsCompleted: number
  cardioMinutes: number
  checkinCount: number
  avgSleep: number
  range: Range
}): string[] {
  const items: string[] = []

  const workoutTarget = WORKOUT_TARGETS[range]
  const cardioTarget = CARDIO_MIN_TARGETS[range]
  const checkinTarget = CHECKIN_TARGETS[range]

  if (workoutsCompleted >= workoutTarget) {
    items.push('עקבית אימונים מצוינת בתקופה הזו – עמדת ביעד האימונים שלך.')
  } else if (workoutsCompleted > 0) {
    items.push(
      `השלמת ${workoutsCompleted} אימונים. נסה להגיע ל‑${workoutTarget} כדי לעמוד ביעד המלא.`,
    )
  } else {
    items.push('עדיין לא נרשמו אימוני כוח בטווח הזה.')
  }

  if (cardioMinutes >= cardioTarget) {
    items.push('נפח הקרדיו שלך על המסלול – בסיס אירובי יפה מאוד.')
  } else if (cardioMinutes > 0) {
    items.push(
      `רשמת ${cardioMinutes} דקות קרדיו; כדאי לשקול להוסיף עוד סשן Zone 2 כדי להגיע ל‑${cardioTarget} דקות.`,
    )
  } else {
    items.push('נפח הקרדיו נמוך – אפילו סשן Zone 2 קצר יכול לעזור.')
  }

  if (checkinCount >= checkinTarget * 0.7) {
    items.push('הצ׳ק‑אינים היומיים עקביים – מעולה לזיהוי מגמות מוקדם.')
  } else if (checkinCount > 0) {
    items.push('הצ׳ק‑אינים קצת מפוזרים – נסה לרשום ברוב הימים כדי לקבל תובנות טובות יותר.')
  } else {
    items.push('עדיין לא היו צ׳ק‑אינים יומיים בתקופה הזו. אפשר להתחיל בצ׳ק‑אין קצר של 30 שניות.')
  }

  if (avgSleep && avgSleep < 5) {
    items.push(
      'איכות השינה נראית נמוכה מהאידיאל – לתת עדיפות לשגרת ערב ושעת שינה קבועה יכול לשפר את ההתאוששות.',
    )
  }

  return items.slice(0, 3)
}

