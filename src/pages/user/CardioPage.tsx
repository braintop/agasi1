import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Activity, Flame, MapPin, Timer } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../app/ui/card'
import { Button } from '../../app/ui/button'
import { Badge } from '../../app/ui/badge'
import { Input } from '../../app/ui/input'
import { Modal } from '../../app/ui/modal'
import { cardioPlan, type CardioLog, type CardioType } from '../../app/mock/cardio'
import { getJSON, setJSON } from '../../app/utils/storage'

const LOG_KEY = 'cardio.logs'

const TYPE_OPTIONS: CardioType[] = ['Zone 2', 'Intervals', 'Easy', 'Other']

export function CardioPage() {
  const [logs, setLogs] = useState<CardioLog[]>(() =>
    getJSON<CardioLog[]>(LOG_KEY, []),
  )
  const [isLogOpen, setIsLogOpen] = useState(false)
  const [detailLog, setDetailLog] = useState<CardioLog | null>(null)

  const [form, setForm] = useState<Partial<CardioLog>>({
    dateISO: new Date().toISOString(),
    type: 'Zone 2',
  })

  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 6)

  const recentLogs = useMemo(
    () =>
      logs.filter((l) => {
        const d = new Date(l.dateISO)
        return d >= sevenDaysAgo && d <= now
      }),
    [logs, now, sevenDaysAgo],
  )

  const kpiMinutes = recentLogs.reduce((sum, l) => sum + l.durationMin, 0)
  const kpiSessions = recentLogs.length
  const kpiDistance = recentLogs.reduce(
    (sum, l) => sum + (l.distanceKm ?? 0),
    0,
  )
  const kpiCalories = Math.round(kpiMinutes * 8) // simple mock estimate

  const sortedLogs = useMemo(
    () =>
      [...logs].sort((a, b) =>
        a.dateISO < b.dateISO ? 1 : -1,
      ),
    [logs],
  )

  const handleOpenLogModal = () => {
    setForm({
      dateISO: new Date().toISOString(),
      type: 'Zone 2',
    })
    setIsLogOpen(true)
  }

  const handleSaveLog = () => {
    if (!form.durationMin || form.durationMin <= 0) return

    const newLog: CardioLog = {
      id: `${Date.now()}`,
      dateISO: form.dateISO ?? new Date().toISOString(),
      type: (form.type as CardioType) ?? 'Zone 2',
      durationMin: form.durationMin,
      distanceKm: form.distanceKm,
      avgHr: form.avgHr,
      notes: form.notes,
    }

    const next = [...logs, newLog]
    setLogs(next)
    setJSON(LOG_KEY, next)
    setIsLogOpen(false)
  }

  const handleDeleteLog = (id: string) => {
    const next = logs.filter((l) => l.id !== id)
    setLogs(next)
    setJSON(LOG_KEY, next)
    setDetailLog(null)
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-text-primary">Cardio</h1>
          <p className="text-sm text-text-secondary">
            Build heart health and endurance.
          </p>
        </div>
        <Button size="sm" onClick={handleOpenLogModal}>
          + Log Session
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard
          label="This Week"
          value={`${kpiSessions}`}
          helper="Sessions"
          icon={<Activity className="h-4 w-4" />}
          accent="emerald"
        />
        <MetricCard
          label="Minutes"
          value={`${kpiMinutes}`}
          helper="This week"
          icon={<Timer className="h-4 w-4" />}
          accent="sky"
        />
        <MetricCard
          label="Distance"
          value={kpiDistance.toFixed(1)}
          helper="Total km"
          icon={<MapPin className="h-4 w-4" />}
          accent="violet"
        />
        <MetricCard
          label="Calories"
          value={`${kpiCalories}`}
          helper="Estimated"
          icon={<Flame className="h-4 w-4" />}
          accent="orange"
        />
      </div>

      {/* Plan card */}
      <Card className="border-none bg-surface">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">{cardioPlan.title}</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              {cardioPlan.notes}
            </CardDescription>
          </div>
          <Badge className="text-[11px]">
            {cardioPlan.weeklyTargetSessions} x {cardioPlan.targetMinutesPerSession}
            &nbsp;min
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-2 text-xs">
            {cardioPlan.sessionTypes.map((t) => (
              <Badge key={t.type} variant="outline">
                {t.type}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-surface-2 px-4 py-3 text-xs text-text-secondary">
            <div>
              <p className="font-medium text-text-primary">
                Connect Health App (coming soon)
              </p>
              <p className="text-[11px] text-text-secondary/80">
                Sync Apple Health / wearables to auto-log cardio sessions.
              </p>
            </div>
            <div className="flex h-6 w-10 items-center rounded-full bg-surface border border-border/70">
              <div className="ml-[2px] h-5 w-5 rounded-full bg-surface-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-text-primary">History</h2>
          <span className="text-[11px] text-text-secondary/80">
            Most recent first
          </span>
        </div>
        {sortedLogs.length === 0 ? (
          <p className="text-xs text-text-secondary">
            No cardio sessions logged yet. Start by logging your first session.
          </p>
        ) : (
          <div className="space-y-2 text-sm">
            {sortedLogs.map((log) => {
              const dateLabel = format(new Date(log.dateISO), 'EEE, MMM d')
              return (
                <button
                  key={log.id}
                  type="button"
                  onClick={() => setDetailLog(log)}
                  className="flex w-full items-center justify-between rounded-2xl bg-surface-2 px-4 py-3 text-left transition-colors hover:bg-surface"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-text-secondary/80">
                      {dateLabel}
                    </span>
                    <span className="font-medium text-text-primary">
                      {log.type} • {log.durationMin} min
                    </span>
                    <span className="text-[11px] text-text-secondary/80">
                      {log.distanceKm ? `${log.distanceKm.toFixed(1)} km` : 'No distance'}
                      {log.avgHr ? ` • Avg HR ${log.avgHr}` : ''}
                    </span>
                  </div>
                  <Badge variant="success" className="text-[11px]">
                    Logged
                  </Badge>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Log session modal */}
      <Modal
        open={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        title="Log cardio session"
        description="Capture a quick summary of your cardio work."
      >
        <form
          className="space-y-3 text-sm"
          onSubmit={(e) => {
            e.preventDefault()
            handleSaveLog()
          }}
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-primary/90">
              Date
            </label>
            <Input
              type="date"
              value={format(
                new Date(form.dateISO ?? new Date().toISOString()),
                'yyyy-MM-dd',
              )}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  dateISO: new Date(e.target.value).toISOString(),
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-primary/90">
              Type
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`rounded-full border px-3 py-1 ${
                    form.type === t
                      ? 'border-[#10B981] bg-surface text-text-primary'
                      : 'border-border bg-surface-2 text-text-secondary'
                  }`}
                  onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-primary/90">
                Duration (min)
              </label>
              <Input
                type="number"
                min={1}
                value={form.durationMin ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    durationMin:
                      e.target.value === '' ? undefined : Number(e.target.value),
                  }))
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-primary/90">
                Distance (km)
              </label>
              <Input
                type="number"
                min={0}
                step="0.1"
                value={form.distanceKm ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    distanceKm:
                      e.target.value === '' ? undefined : Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-primary/90">
              Avg HR
            </label>
            <Input
              type="number"
              min={0}
              value={form.avgHr ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  avgHr:
                    e.target.value === '' ? undefined : Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-primary/90">
              Notes
            </label>
            <Input
              type="text"
              placeholder="How did it feel?"
              value={form.notes ?? ''}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsLogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!form.durationMin}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail modal */}
      <Modal
        open={!!detailLog}
        onClose={() => setDetailLog(null)}
        title="Session details"
      >
        {detailLog && (
          <div className="space-y-2 text-sm">
            <p className="text-xs text-text-secondary/80">
              {format(new Date(detailLog.dateISO), 'PPP')}
            </p>
            <p className="font-medium text-text-primary">
              {detailLog.type} • {detailLog.durationMin} min
            </p>
            <p className="text-xs text-text-secondary/80">
              {detailLog.distanceKm
                ? `${detailLog.distanceKm.toFixed(1)} km`
                : 'No distance logged'}
              {detailLog.avgHr ? ` • Avg HR ${detailLog.avgHr}` : ''}
            </p>
            {detailLog.notes && (
              <p className="text-xs text-text-secondary/80">
                Notes: {detailLog.notes}
              </p>
            )}
            <div className="mt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setDetailLog(null)}
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-danger hover:bg-danger/80"
                onClick={() => handleDeleteLog(detailLog.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

type MetricAccent = 'emerald' | 'sky' | 'violet' | 'orange'

function MetricCard({
  label,
  value,
  helper,
  icon,
  accent,
}: {
  label: string
  value: string
  helper: string
  icon: React.ReactNode
  accent: MetricAccent
}) {
  const accentClasses: Record<MetricAccent, string> = {
    emerald: 'bg-[#022c22] text-[#10B981]',
    sky: 'bg-[#021f33] text-[#38bdf8]',
    violet: 'bg-[#1e1633] text-[#8B5CF6]',
    orange: 'bg-[#2b1705] text-[#f97316]',
  }

  return (
    <Card className="border-none bg-surface-2">
      <CardContent className="flex items-center gap-3 py-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs ${accentClasses[accent]}`}
        >
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

