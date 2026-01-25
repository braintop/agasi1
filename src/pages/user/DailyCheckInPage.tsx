import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Smile, SmilePlus, Meh, Frown, AlertTriangle, BatteryMedium, Brain, Moon, ArrowRight } from 'lucide-react'
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

const MOOD_OPTIONS: { id: Mood; label: string; icon: ReactNode }[] = [
  { id: 'Great', label: 'מצוין', icon: <SmilePlus className="h-4 w-4" /> },
  { id: 'Good', label: 'טוב', icon: <Smile className="h-4 w-4" /> },
  { id: 'Okay', label: 'סביר', icon: <Meh className="h-4 w-4" /> },
  { id: 'Low', label: 'נמוך', icon: <Frown className="h-4 w-4" /> },
  { id: 'Stressed', label: 'לחוץ', icon: <AlertTriangle className="h-4 w-4" /> },
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
  const navigate = useNavigate()
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
        <h1 className="text-2xl font-semibold text-text-primary">
          צ׳ק‑אין יומי
        </h1>
        <p className="text-sm text-text-secondary">
          לעקוב אחרי ההרגשה שלך היום.
        </p>
        <p className="text-xs text-text-secondary/80">
          צ׳ק‑אין אחרון:{' '}
          {lastCheckin
            ? format(new Date(lastCheckin.dateISO), 'EEE, MMM d')
            : 'עדיין לא בוצע'}
        </p>
      </div>

      {hasToday && !editingExisting && existingToday ? (
        <>
          <Card className="border border-white/15 bg-surface shadow-card">
            <CardContent className="flex flex-col gap-5 py-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--primary-15)] text-[color:var(--primary)]">
                  <SmilePlus className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    ביצעת צ׳ק‑אין היום!
                  </p>
                  <p className="text-xs text-text-secondary/80">
                    יפה מאוד, אתה עוקב אחרי ההרגשה שלך. נתראה מחר.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <TodayTile
                  label="מצב רוח"
                  value={moodToScore(existingToday.mood)}
                  icon={<SmilePlus className="h-4 w-4 text-emerald-400" />}
                />
                <TodayTile
                  label="אנרגיה"
                  value={existingToday.energy}
                  icon={<BatteryMedium className="h-4 w-4 text-sky-400" />}
                />
                <TodayTile
                  label="לחץ"
                  value={existingToday.stress}
                  icon={<Brain className="h-4 w-4 text-orange-300" />}
                />
                <TodayTile
                  label="איכות שינה"
                  value={existingToday.sleepQuality}
                  icon={<Moon className="h-4 w-4 text-violet-300" />}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-surface-2">
            <CardHeader>
              <CardTitle className="text-base">ממוצעים ל‑7 ימים</CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                תמונת מצב עדינה של המגמות האחרונות.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-4">
              <AverageTile
                label="מצב רוח"
                value={avgMood}
                icon={<SmilePlus className="h-4 w-4 text-emerald-400" />}
              />
              <AverageTile
                label="אנרגיה"
                value={avgEnergy}
                icon={<BatteryMedium className="h-4 w-4 text-sky-400" />}
              />
              <AverageTile
                label="לחץ"
                value={avgStress}
                icon={<Brain className="h-4 w-4 text-orange-300" />}
              />
              <AverageTile
                label="איכות שינה"
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
              <CardTitle className="text-base">היום</CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                איך אתה מרגיש כרגע?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Mood */}
              <section className="space-y-2">
                <p className="text-xs font-medium text-text-primary/90">
                  מצב רוח <span className="text-danger">*</span>
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {MOOD_OPTIONS.map((option) => {
                    const active = mood === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
                          active
                            ? 'bg-[#052e21] text-[#10B981]'
                            : 'bg-surface-2 text-text-secondary hover:text-text-primary'
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
                  label="אנרגיה"
                  icon={<BatteryMedium className="h-4 w-4 text-sky-400" />}
                  value={energy}
                  onChange={setEnergy}
                />
                <SliderRow
                  label="לחץ"
                  icon={<Brain className="h-4 w-4 text-orange-300" />}
                  value={stress}
                  onChange={setStress}
                />
                <SliderRow
                  label="איכות שינה"
                  icon={<Moon className="h-4 w-4 text-violet-300" />}
                  value={sleepQuality}
                  onChange={setSleepQuality}
                />
              </section>

              {/* Notes */}
              <section className="space-y-2">
                <p className="text-xs font-medium text-text-primary/90">הערות</p>
                <Textarea
                  rows={3}
                  placeholder="כל דבר נוסף שתרצה לזכור על היום..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </section>
            </CardContent>
          </Card>

          {/* 7-day averages */}
          <Card className="border-none bg-surface">
            <CardHeader>
              <CardTitle className="text-base">ממוצעים ל‑7 ימים</CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                תמונת מצב עדינה של המגמות האחרונות.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <AverageTile
                label="מצב רוח"
                value={avgMood}
                icon={<SmilePlus className="h-4 w-4 text-emerald-400" />}
              />
              <AverageTile
                label="אנרגיה"
                value={avgEnergy}
                icon={<BatteryMedium className="h-4 w-4 text-sky-400" />}
              />
              <AverageTile
                label="לחץ"
                value={avgStress}
                icon={<Brain className="h-4 w-4 text-orange-300" />}
              />
              <AverageTile
                label="איכות שינה"
                value={avgSleep}
                icon={<Moon className="h-4 w-4 text-violet-300" />}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {justSaved && (
        <div className="rounded-xl border border-white/15 bg-surface px-4 py-2 text-xs text-[color:var(--primary)]">
          הצ׳ק‑אין נשמר. כל הכבוד שלקחת רגע לעצור ולבדוק איך אתה מרגיש.
        </div>
      )}

      {(!hasToday || editingExisting) && (
        <div className="sticky bottom-0 -mx-4 mt-6 bg-bg/95 px-4 py-4">
          <div className="mx-auto flex max-w-3xl justify-end">
            <Button
              size="lg"
              className="w-full max-w-md"
              disabled={!mood}
              onClick={handleSubmit}
            >
              שמירת צ׳ק‑אין
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

