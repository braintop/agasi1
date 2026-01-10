import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Sparkles, ChevronRight, ArrowRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../app/ui/card'
import { Button } from '../../app/ui/button'
import { Modal } from '../../app/ui/modal'
import { getJSON, setJSON } from '../../app/utils/storage'
import {
  buildInsightFromLogs,
  getWeekStartISO,
  type AiInsight,
} from '../../app/utils/insights'

interface WorkoutLogLike {
  dateISO: string
}

interface CardioLogLike {
  dateISO: string
  durationMin: number
}

interface CheckinLogLike {
  dateISO: string
  sleepQuality: number
}

const INSIGHTS_KEY = 'ai.insights'

export function AIInsightsPage() {
  const navigate = useNavigate()
  const [insights, setInsights] = useState<AiInsight[]>(() =>
    getJSON<AiInsight[]>(INSIGHTS_KEY, []),
  )
  const [detail, setDetail] = useState<AiInsight | null>(null)

  const today = new Date()
  const currentWeekStartISO = getWeekStartISO(today)

  const thisWeekInsight = insights.find(
    (i) => i.weekStartISO.slice(0, 10) === currentWeekStartISO.slice(0, 10),
  )

  const sortedInsights = useMemo(
    () => [...insights].sort((a, b) => (a.createdAtISO < b.createdAtISO ? 1 : -1)),
    [insights],
  )

  const handleGenerate = () => {
    const workouts = getJSON<WorkoutLogLike[]>('workout.logs', [])
    const cardio = getJSON<CardioLogLike[]>('cardio.logs', [])
    const checkins = getJSON<CheckinLogLike[]>('checkins.logs', [])

    const base = buildInsightFromLogs({ workouts, cardio, checkins })
    const insight: AiInsight = {
      id: `${Date.now()}`,
      weekStartISO: currentWeekStartISO,
      createdAtISO: new Date().toISOString(),
      ...base,
    }

    const withoutThisWeek = insights.filter(
      (i) => i.weekStartISO.slice(0, 10) !== currentWeekStartISO.slice(0, 10),
    )
    const next = [insight, ...withoutThisWeek]
    setInsights(next)
    setJSON(INSIGHTS_KEY, next)
    setDetail(insight)
  }

  const handleDelete = (id: string) => {
    const next = insights.filter((i) => i.id !== id)
    setInsights(next)
    setJSON(INSIGHTS_KEY, next)
    setDetail(null)
  }

  const hasThisWeek = !!thisWeekInsight

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
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-text-primary">
              תובנות AI
            </h1>
            <p className="text-xs text-text-secondary">
              המלצות מותאמות אישית לפי האימונים, הקרדיו והצ׳ק‑אינים שלך.
            </p>
          </div>
        </div>
        <Button size="sm" onClick={handleGenerate}>
          <Sparkles className="mr-1 h-4 w-4" />
          הפקת תובנה לשבוע הזה
        </Button>
      </div>

      {/* Hero card – Get AI-Powered Insights */}
      <Card className="border-none bg-gradient-to-r from-[#2F2626] via-[#3a2b27] to-[#4a3730] shadow-card">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#C98A6B] text-white shadow-card">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-text-primary">
              קבל תובנות חכמות מ‑AI
            </h2>
            <p className="max-w-xl text-sm text-text-secondary">
              ה‑AI ינתח את האימונים, הקרדיו והצ׳ק‑אינים האחרונים שלך
              וייתן המלצות אישיות לתוצאות מיטביות.
            </p>
          </div>
          <Button
            size="sm"
            className="mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#C98A6B] border-none text-white hover:brightness-110"
            onClick={handleGenerate}
          >
            <Sparkles className="mr-1 h-4 w-4" />
            ניתוח הנתונים שלי
          </Button>
          {hasThisWeek && thisWeekInsight && (
            <p className="mt-1 text-[11px] text-text-secondary/80">
              תובנה אחרונה: שבוע של{' '}
              {format(new Date(thisWeekInsight.weekStartISO), 'MMM d, yyyy')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card className="border-none bg-surface">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm">היסטוריה</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              תובנות שבועיות קודמות.
            </CardDescription>
          </div>
          <span className="text-[11px] text-text-secondary/80">
            {sortedInsights.length} סה״כ
          </span>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {sortedInsights.length === 0 ? (
            <p className="text-xs text-text-secondary">
              עדיין אין תובנות. אפשר להתחיל בהפקת תובנה לשבוע הנוכחי.
            </p>
          ) : (
            sortedInsights.map((insight) => (
              <button
                key={insight.id}
                type="button"
                onClick={() => setDetail(insight)}
                className="flex w-full items-center justify-between rounded-2xl bg-surface-2 px-4 py-3 text-left transition-colors hover:bg-surface"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-text-secondary/80">
                    שבוע של{' '}
                    {format(new Date(insight.weekStartISO), 'MMM d, yyyy')}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {insight.title}
                  </span>
                  <span className="text-[11px] text-text-secondary/80 line-clamp-2">
                    {insight.summary}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-text-secondary/70" />
              </button>
            ))
          )}
        </CardContent>
      </Card>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.title ?? 'פרטי תובנה'}
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <p className="text-xs text-text-secondary/80">
              הופקה{' '}
              {format(new Date(detail.createdAtISO), 'PPP p')}
            </p>
            <p className="text-sm text-text-secondary">{detail.summary}</p>
            <ul className="mt-2 space-y-1 text-sm text-text-secondary">
              {detail.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1 h-[3px] w-[3px] rounded-full bg-[#8B5CF6]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 rounded-xl bg-surface-2 px-3 py-2 text-xs text-text-secondary">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8B5CF6]">
                פוקוס
              </span>
              <p className="mt-1 text-sm text-text-primary">
                {detail.focus}
              </p>
            </div>
            <div className="mt-4 flex justify-end gap-2 text-xs">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setDetail(null)}
              >
                סגירה
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-danger hover:bg-danger/80"
                onClick={() => handleDelete(detail.id)}
              >
                מחיקה
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
