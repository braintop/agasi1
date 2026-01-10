import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../app/ui/card'
import { Button } from '../../app/ui/button'
import { Badge } from '../../app/ui/badge'
import { cn } from '../../app/utils/cn'
import {
  workouts,
  weeklySchedule,
  workoutLogs,
  type WorkoutLog,
} from '../../app/mock/workouts'
import { getJSON } from '../../app/utils/storage'

type TabId = 'schedule' | 'history'

const DAYS: { id: keyof typeof weeklySchedule; label: string }[] = [
  { id: 'mon', label: 'ב׳' },
  { id: 'tue', label: 'ג׳' },
  { id: 'wed', label: 'ד׳' },
  { id: 'thu', label: 'ה׳' },
  { id: 'fri', label: 'ו׳' },
  { id: 'sat', label: 'ש׳' },
  { id: 'sun', label: 'א׳' },
]

export function WorkoutsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabId>('schedule')
  const [selectedDay, setSelectedDay] = useState<keyof typeof weeklySchedule>(
    'mon',
  )

  const workoutsById = useMemo(
    () => new Map(workouts.map((w) => [w.id, w] as const)),
    [],
  )

  const dayWorkoutIds = weeklySchedule[selectedDay]
  const dayWorkouts = dayWorkoutIds
    .map((id) => workoutsById.get(id))
    .filter(Boolean)

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

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-text-primary">אימונים</h1>
        <p className="text-sm text-text-secondary">תוכנית האימונים שלך</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="השבוע" value="4" helper="אימונים מתוכננים" />
        <MetricCard label="בוצעו" value="2" helper="עד כה" />
        <MetricCard label="האימון הבא" value="פלג גוף עליון" helper="מחר" />
      </div>

      <Card className="border-none bg-surface">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">לוח אימונים</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              לראות מה מחכה לך השבוע או לעבור על אימונים קודמים.
            </CardDescription>
          </div>
          <div className="inline-flex rounded-full border border-border/70 bg-surface-2 p-1 text-xs">
            <button
              type="button"
              onClick={() => setTab('schedule')}
              className={cn(
                'rounded-full px-3 py-1.5 font-medium transition-colors',
                tab === 'schedule'
                  ? 'bg-bg text-text-primary'
                  : 'text-text-secondary hover:text-text-primary',
              )}
              >
              לוח
            </button>
            <button
              type="button"
              onClick={() => setTab('history')}
              className={cn(
                'rounded-full px-3 py-1.5 font-medium transition-colors',
                tab === 'history'
                  ? 'bg-bg text-text-primary'
                  : 'text-text-secondary hover:text-text-primary',
              )}
              >
              היסטוריה
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {tab === 'schedule' ? (
            <>
              <WeekStrip
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
              />
              <div className="space-y-3">
                {dayWorkouts.length === 0 ? (
                  <RestDayCard />
                ) : (
                  dayWorkouts.map((workout) => (
                    <WorkoutCard
                      key={workout!.id}
                      workout={workout!}
                      status="Planned"
                      onOpen={() => navigate(`/workouts/${workout!.id}`)}
                    />
                  ))
                )}
              </div>
            </>
          ) : (
            <HistoryList
              onOpen={(workoutId) => navigate(`/workouts/${workoutId}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string
  value: string
  helper: string
}) {
  return (
    <Card className="border-none bg-surface-2">
      <CardContent className="py-3">
        <p className="text-xs text-text-secondary/80">{label}</p>
        <p className="mt-1 text-xl font-semibold text-text-primary">{value}</p>
        <p className="mt-0.5 text-[11px] text-text-secondary/80">{helper}</p>
      </CardContent>
    </Card>
  )
}

function WeekStrip({
  selectedDay,
  onSelectDay,
}: {
  selectedDay: keyof typeof weeklySchedule
  onSelectDay: (day: keyof typeof weeklySchedule) => void
}) {
  return (
    <div className="inline-flex rounded-full bg-surface-2 px-1 py-1 text-xs">
      {DAYS.map((day) => {
        const isActive = day.id === selectedDay
        return (
          <button
            key={day.id}
            type="button"
            onClick={() => onSelectDay(day.id)}
            className={cn(
              'min-w-[44px] rounded-full px-3 py-1 font-medium transition-colors',
              'text-text-secondary',
              isActive && 'bg-bg text-text-primary',
            )}
          >
            {day.label}
          </button>
        )
      })}
    </div>
  )
}

function RestDayCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-2 px-6 py-10 text-center text-sm text-text-secondary">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-bg text-text-secondary">
        <span className="text-lg">🗓</span>
      </div>
      <p className="mb-1 text-base font-medium text-text-primary">יום מנוחה</p>
      <p className="text-xs text-text-secondary/80">
        אין אימונים מתוכננים להיום. זה זמן מצוין להתאוששות.
      </p>
    </div>
  )
}

function WorkoutCard({
  workout,
  status,
  onOpen,
}: {
  workout: (typeof workouts)[number]
  status: 'Planned' | 'Completed'
  onOpen: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-surface-2 px-4 py-3 text-sm">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-primary">{workout.name}</span>
          <Badge variant="outline" className="text-[11px]">
            {workout.tag}
          </Badge>
        </div>
        <p className="text-xs text-text-secondary/80">
          {workout.durationMin} דק׳ • {status === 'Planned' ? 'מתוכנן' : 'הושלם'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          variant={status === 'Completed' ? 'success' : 'outline'}
          className="text-[11px]"
        >
          {status === 'Completed' ? 'הושלם' : 'מתוכנן'}
        </Badge>
        <Button size="sm" variant="secondary" onClick={onOpen}>
          פתיחה
        </Button>
      </div>
    </div>
  )
}

function HistoryList({
  onOpen,
}: {
  onOpen: (workoutId: string) => void
}) {
  const localLogs = getJSON<WorkoutLog[]>('workout.logs', [])
  const allLogs = [...workoutLogs, ...localLogs].sort((a, b) =>
    a.dateISO < b.dateISO ? 1 : -1,
  )

  if (allLogs.length === 0) {
    return (
      <p className="text-xs text-text-secondary">
        עדיין לא נרשמו אימונים.
      </p>
    )
  }

  return (
    <div className="space-y-2 text-sm">
      {allLogs.map((log) => {
        const workout = workouts.find((w) => w.id === log.workoutId)
        if (!workout) return null
        const date = new Date(log.dateISO)
        const dateLabel = date.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })

        return (
          <button
            key={log.id}
            type="button"
            onClick={() => onOpen(log.workoutId)}
            className="flex w-full items-center justify-between rounded-2xl bg-surface-2 px-4 py-3 text-left transition-colors hover:bg-surface"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-secondary/80">
                {dateLabel}
              </span>
              <span className="font-medium text-text-primary">
                {workout.name}
              </span>
              <span className="text-[11px] text-text-secondary/80">
                {log.durationMin} דק׳ • {log.highlight}
              </span>
            </div>
            <Badge variant="success" className="text-[11px]">
              הושלם
            </Badge>
          </button>
        )
      })}
    </div>
  )
}

