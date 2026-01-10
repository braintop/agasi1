import { useNavigate } from 'react-router-dom'
import {
  Activity,
  Brain,
  CheckCircle2,
  Flame,
  HeartPulse,
  Timer,
  Weight,
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
  aiInsightPreview,
  dailyScore,
  streaks,
  todayActions,
} from '../../app/mock/dashboard'

export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-text-primary">דאשבורד</h1>
        <p className="text-sm text-text-secondary">
          תמונת מצב יומית של אימונים, התאוששות והרגלים.
        </p>
      </div>

      {/* Daily score */}
      <Card className="relative overflow-hidden border-none bg-gradient-to-r from-[#2F2626] via-[#2F2626] to-[#4a3730]">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#C98A6B]/25 via-transparent to-transparent" />
        <CardContent className="relative flex items-center justify-between gap-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C98A6B]/20 text-[#C98A6B]">
              <Activity className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs tracking-wide text-text-secondary/80">
                {dailyScore.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-text-primary">
                  {dailyScore.value}
                </span>
                <span className="text-xs" style={{ color: '#8FAF9A' }}>
                  ↑ {dailyScore.trend}
                </span>
              </div>
              <p className="mt-1 text-xs text-text-secondary/80">
                שילוב רגוע של נתוני אימון, התאוששות ואורח חיים.
              </p>
            </div>
          </div>
          <div className="hidden flex-col items-end gap-2 text-xs text-text-secondary/80 sm:flex">
            <span>פוקוס להיום: התאוששות ושינה איכותית</span>
            <span>מחר: אימון פלג גוף עליון</span>
          </div>
        </CardContent>
      </Card>

      {/* Today actions + streaks */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="border-none bg-surface">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">הפעולות להיום</CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                רשימה קצרה של הדברים הכי חשובים לעשות היום.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => navigate(action.to)}
                className="flex w-full items-center justify-between rounded-2xl border border-border/80 bg-surface-2 px-4 py-3 text-left text-sm transition-colors hover:border-[#10B981] hover:bg-surface"
              >
                <div className="flex items-center gap-3">
                  <ActionIcon id={action.id} />
                  <div className="flex flex-col">
                    <span className="font-medium text-text-primary">
                      {action.title}
                    </span>
                    <span className="text-xs text-text-secondary/80">
                      {action.subtitle}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge tone={action.statusTone}>
                    {action.status}
                  </StatusBadge>
                  <span className="text-xs font-medium text-[#10B981]">
                    {action.cta}
                  </span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-none bg-surface">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">רצפים</CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                ניצחונות קטנים שמצטברים לאורך הזמן.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4" style={{ color: '#D6A77A' }} />
                  <span className="text-text-primary">
                    רצף אימונים:{' '}
                    <span className="font-semibold">
                      {streaks.workoutDays} ימים
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" style={{ color: '#8FAF9A' }} />
                  <span className="text-text-primary">
                    רצף צ׳ק‑אין:{' '}
                    <span className="font-semibold">
                      {streaks.checkInDays} ימים
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI insight */}
      <Card className="border-none bg-gradient-to-r from-surface-2 via-surface-2 to-surface">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6]">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">תובנת AI</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              אות מהיר המבוסס על הפעילות האחרונה שלך.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-text-secondary">
          <p>{aiInsightPreview}</p>
          <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-text-secondary/80">
                מתעדכן לאחר שתסיים את הפעולות של היום.
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/aiinsights')}
              >
                צפייה בתובנות
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ActionIcon({ id }: { id: string }) {
  if (id === 'workout') {
    return <Weight className="h-5 w-5 text-[#10B981]" />
  }
  if (id === 'cardio') {
    return <HeartPulse className="h-5 w-5 text-sky-400" />
  }
  if (id === 'checkin') {
    return <Timer className="h-5 w-5 text-amber-300" />
  }
  return <Activity className="h-5 w-5 text-text-secondary" />
}

type StatusTone = 'primary' | 'info' | 'success'

function StatusBadge({
  tone,
  children,
}: {
  tone: StatusTone
  children: React.ReactNode
}) {
  const base =
    'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium'

  const toneClass =
    tone === 'primary'
      ? 'border-[#C98A6B]/60 bg-[#C98A6B]/10 text-[#C98A6B]'
      : tone === 'info'
        ? 'border-sky-400/60 bg-sky-400/10 text-sky-300'
        : 'border-[#8FAF9A]/60 bg-[#8FAF9A]/10 text-[#8FAF9A]'

  return <span className={cn(base, toneClass)}>{children}</span>
}

