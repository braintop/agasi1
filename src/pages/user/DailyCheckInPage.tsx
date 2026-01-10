import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Smile, SmilePlus, Meh, Frown, AlertTriangle, BatteryMedium, Brain, Moon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../app/ui/card'
import { Button } from '../../app/ui/button'
import { Textarea } from '../../app/ui/textarea'
import { Slider } from '../../app/ui/slider'
import { getJSON, setJSON } from '../../app/utils/storage'

type Mood = 'Great' | 'Good' | 'Okay' | 'Low' | 'Stressed'

interface Checkin {
  id: string
  dateISO: string
  mood: Mood
  energy: number
  stress: number
  sleepQuality: number
  notes?: string
}

const LOG_KEY = 'checkins.logs'
const DRAFT_KEY = 'checkins.draft'

const MOOD_OPTIONS: { id: Mood; label: Mood; icon: ReactNode }[] = [
  { id: 'Great', label: 'Great', icon: <SmilePlus className="h-4 w-4" /> },
  { id: 'Good', label: 'Good', icon: <Smile className="h-4 w-4" /> },
  { id: 'Okay', label: 'Okay', icon: <Meh className="h-4 w-4" /> },
  { id: 'Low', label: 'Low', icon: <Frown className="h-4 w-4" /> },
  { id: 'Stressed', label: 'Stressed', icon: <AlertTriangle className="h-4 w-4" /> },
]

function moodToScore(mood: Mood): number {
  switch (mood) {
    case 'Great':
      return 5
    case 'Good':
      return 4
    case 'Okay':
      return 3
    case 'Low':
      return 2
    case 'Stressed':
      return 1
    default:
      return 0
  }
}

export function DailyCheckInPage() {
  const [logs, setLogs] = useState<Checkin[]>(() =>
    getJSON<Checkin[]>(LOG_KEY, []),
  )

  const today = new Date()
  const todayKey = format(today, 'yyyy-MM-dd')

  const lastCheckin = useMemo(
    () =>
      [...logs].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))[0] ?? null,
    [logs],
  )

  const existingToday = logs.find(
    (c) => format(new Date(c.dateISO), 'yyyy-MM-dd') === todayKey,
  )

  const draft = getJSON<Partial<Checkin> | null>(DRAFT_KEY, null)

  const [mood, setMood] = useState<Mood | undefined>(
    (draft?.mood as Mood | undefined) ?? existingToday?.mood,
  )
  const [energy, setEnergy] = useState<number>(
    draft?.energy ?? existingToday?.energy ?? 5,
  )
  const [stress, setStress] = useState<number>(
    draft?.stress ?? existingToday?.stress ?? 5,
  )
  const [sleepQuality, setSleepQuality] = useState<number>(
    draft?.sleepQuality ?? existingToday?.sleepQuality ?? 5,
  )
  const [notes, setNotes] = useState<string>(
    draft?.notes ?? existingToday?.notes ?? '',
  )

  const [justSaved, setJustSaved] = useState(false)
  const [editingExisting, setEditingExisting] = useState(false)

  useEffect(() => {
    const draftData: Partial<Checkin> = {
      mood,
      energy,
      stress,
      sleepQuality,
      notes,
      dateISO: new Date().toISOString(),
    }
    setJSON(DRAFT_KEY, draftData)
  }, [mood, energy, stress, sleepQuality, notes])

  const sevenDaysAgo = useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() - 6)
    return d
  }, [today])

  const recentLogs = useMemo(
    () =>
      logs.filter((l) => {
        const d = new Date(l.dateISO)
        return d >= sevenDaysAgo && d <= today
      }),
    [logs, sevenDaysAgo, today],
  )

  const avgMood =
    recentLogs.length === 0
      ? 0
      : recentLogs.reduce((sum, c) => sum + moodToScore(c.mood), 0) /
        recentLogs.length
  const avgEnergy =
    recentLogs.length === 0
      ? 0
      : recentLogs.reduce((sum, c) => sum + c.energy, 0) / recentLogs.length
  const avgStress =
    recentLogs.length === 0
      ? 0
      : recentLogs.reduce((sum, c) => sum + c.stress, 0) / recentLogs.length
  const avgSleep =
    recentLogs.length === 0
      ? 0
      : recentLogs.reduce((sum, c) => sum + c.sleepQuality, 0) /
        recentLogs.length

  const handleSubmit = () => {
    if (!mood) return

    const base: Checkin = {
      id: existingToday?.id ?? `${Date.now()}`,
      dateISO: existingToday?.dateISO ?? new Date().toISOString(),
      mood,
      energy,
      stress,
      sleepQuality,
      notes: notes || undefined,
    }

    const withoutToday = logs.filter(
      (c) => format(new Date(c.dateISO), 'yyyy-MM-dd') !== todayKey,
    )
    const next = [...withoutToday, base]
    setLogs(next)
    setJSON(LOG_KEY, next)
    setJSON(DRAFT_KEY, null)
    setJustSaved(true)
    setEditingExisting(false)
  }

  const hasToday = !!existingToday

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-text-primary">
          Daily Check-in
        </h1>
        <p className="text-sm text-text-secondary">
          Track how you feel today.
        </p>
        <p className="text-xs text-text-secondary/80">
          Last check-in:{' '}
          {lastCheckin
            ? format(new Date(lastCheckin.dateISO), 'EEE, MMM d')
            : 'None yet'}
        </p>
      </div>

      {hasToday && !editingExisting && existingToday ? (
        <>
          <Card className="border border-[#10B981]/50 bg-surface shadow-card">
            <CardContent className="flex flex-col gap-5 py-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981]">
                  <SmilePlus className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    You&apos;ve checked in today!
                  </p>
                  <p className="text-xs text-text-secondary/80">
                    Great job tracking your wellness. See you tomorrow!
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <TodayTile
                  label="Mood"
                  value={moodToScore(existingToday.mood)}
                  icon={<SmilePlus className="h-4 w-4 text-emerald-400" />}
                />
                <TodayTile
                  label="Energy"
                  value={existingToday.energy}
                  icon={<BatteryMedium className="h-4 w-4 text-sky-400" />}
                />
                <TodayTile
                  label="Stress"
                  value={existingToday.stress}
                  icon={<Brain className="h-4 w-4 text-orange-300" />}
                />
                <TodayTile
                  label="Sleep Quality"
                  value={existingToday.sleepQuality}
                  icon={<Moon className="h-4 w-4 text-violet-300" />}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-surface-2">
            <CardHeader>
              <CardTitle className="text-base">7-Day Averages</CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                A soft snapshot of your recent trends.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-4">
              <AverageTile
                label="Mood"
                value={avgMood}
                icon={<SmilePlus className="h-4 w-4 text-emerald-400" />}
              />
              <AverageTile
                label="Energy"
                value={avgEnergy}
                icon={<BatteryMedium className="h-4 w-4 text-sky-400" />}
              />
              <AverageTile
                label="Stress"
                value={avgStress}
                icon={<Brain className="h-4 w-4 text-orange-300" />}
              />
              <AverageTile
                label="Sleep Quality"
                value={avgSleep}
                icon={<Moon className="h-4 w-4 text-violet-300" />}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Today form */}
          <Card className="border-none bg-surface">
            <CardHeader>
              <CardTitle className="text-base">Today</CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                How are you doing right now?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Mood */}
              <section className="space-y-2">
                <p className="text-xs font-medium text-text-primary/90">
                  Mood <span className="text-danger">*</span>
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {MOOD_OPTIONS.map((option) => {
                    const active = mood === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                          active
                            ? 'border-[#10B981] bg-[#052e21] text-[#10B981]'
                            : 'border-border bg-surface-2 text-text-secondary hover:text-text-primary'
                        }`}
                        onClick={() => setMood(option.id)}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Sliders */}
              <section className="space-y-4">
                <SliderRow
                  label="Energy"
                  icon={<BatteryMedium className="h-4 w-4 text-sky-400" />}
                  value={energy}
                  onChange={setEnergy}
                />
                <SliderRow
                  label="Stress"
                  icon={<Brain className="h-4 w-4 text-orange-300" />}
                  value={stress}
                  onChange={setStress}
                />
                <SliderRow
                  label="Sleep Quality"
                  icon={<Moon className="h-4 w-4 text-violet-300" />}
                  value={sleepQuality}
                  onChange={setSleepQuality}
                />
              </section>

              {/* Notes */}
              <section className="space-y-2">
                <p className="text-xs font-medium text-text-primary/90">Notes</p>
                <Textarea
                  rows={3}
                  placeholder="Anything else you want to remember about today..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </section>
            </CardContent>
          </Card>

          {/* 7-day averages */}
          <Card className="border-none bg-surface">
            <CardHeader>
              <CardTitle className="text-base">7-Day Averages</CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                A soft snapshot of your recent trends.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <AverageTile
                label="Mood"
                value={avgMood}
                icon={<SmilePlus className="h-4 w-4 text-emerald-400" />}
              />
              <AverageTile
                label="Energy"
                value={avgEnergy}
                icon={<BatteryMedium className="h-4 w-4 text-sky-400" />}
              />
              <AverageTile
                label="Stress"
                value={avgStress}
                icon={<Brain className="h-4 w-4 text-orange-300" />}
              />
              <AverageTile
                label="Sleep Quality"
                value={avgSleep}
                icon={<Moon className="h-4 w-4 text-violet-300" />}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {justSaved && (
        <div className="rounded-xl border border-[#10B981]/40 bg-[#052e21] px-4 py-2 text-xs text-[#10B981]">
          Check-in saved. Great job taking a moment to reflect.
        </div>
      )}

      {(!hasToday || editingExisting) && (
        <div className="sticky bottom-0 -mx-4 mt-6 border-t border-border bg-bg/95 px-4 py-4">
          <div className="mx-auto flex max-w-3xl justify-end">
            <Button
              size="lg"
              className="w-full max-w-md"
              disabled={!mood}
              onClick={handleSubmit}
            >
              Submit Check-in
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function SliderRow({
  label,
  icon,
  value,
  onChange,
}: {
  label: string
  icon: ReactNode
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-text-secondary/80">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-text-primary/90">{label}</span>
        </div>
        <span className="text-text-primary">{value}</span>
      </div>
      <Slider
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

function AverageTile({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: ReactNode
}) {
  const display = Number.isFinite(value) && value > 0 ? value.toFixed(1) : '–'
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-2 px-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-bg">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-text-secondary/80">{label}</span>
        <span className="text-sm font-semibold text-text-primary">
          {display}
        </span>
      </div>
    </div>
  )
}

function TodayTile({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-2 px-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-bg">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] text-text-secondary/80">{label}</span>
        <span className="text-base font-semibold text-text-primary">
          {value}
        </span>
      </div>
    </div>
  )
}

