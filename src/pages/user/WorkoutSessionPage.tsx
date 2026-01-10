import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ExternalLink, ArrowLeft, Dumbbell } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../app/ui/card'
import { Button } from '../../app/ui/button'
import { Input } from '../../app/ui/input'
import { Badge } from '../../app/ui/badge'
import { getJSON, setJSON } from '../../app/utils/storage'
import { exercises, workoutDetails, type WorkoutLog } from '../../app/mock/workouts'
import { createId } from '../../app/utils/id'

interface SetLog {
  weight?: number
  reps?: number
}

interface ExerciseLog {
  exerciseId: string
  sets: SetLog[]
  done: boolean
}

interface WorkoutSessionLog {
  id: string
  workoutId: string
  dateISO: string
  completed: boolean
  exerciseLogs: ExerciseLog[]
}

export function WorkoutSessionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const detail = id ? workoutDetails[id] : undefined

  const exerciseMetaById = useMemo(
    () => new Map(exercises.map((e) => [e.id, e] as const)),
    [],
  )

  const storageKey = id ? `workout.session.${id}` : ''

  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(() => {
    if (!detail || !storageKey) return []

    const saved = getJSON<WorkoutSessionLog | null>(storageKey, null)
    if (saved) {
      return saved.exerciseLogs
    }

    // init from config
    return detail.exercises.map((cfg) => ({
      exerciseId: cfg.exerciseId,
      done: false,
      sets: Array.from<unknown, SetLog>({ length: cfg.sets }, () => ({})),
    }))
  })

  useEffect(() => {
    if (!detail || !storageKey || exerciseLogs.length === 0) return
    const session: WorkoutSessionLog = {
      id: storageKey,
      workoutId: detail.id,
      dateISO: new Date().toISOString(),
      completed: false,
      exerciseLogs,
    }
    setJSON(storageKey, session)
  }, [detail, exerciseLogs, storageKey])

  if (!detail) {
    return (
      <div className="space-y-4">
        <Button variant="secondary" size="sm" onClick={() => navigate('/workouts')}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          חזרה לאימונים
        </Button>
        <p className="text-sm text-danger">האימון לא נמצא.</p>
      </div>
    )
  }

  const totalExercises = detail.exercises.length
  const completedExercises = exerciseLogs.filter((e) => e.done).length
  const allDone = totalExercises > 0 && completedExercises === totalExercises

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof SetLog,
    value: string,
  ) => {
    setExerciseLogs((prev) =>
      prev.map((log, i) => {
        if (i !== exerciseIndex) return log
        const sets = [...log.sets]
        const updated: SetLog = {
          ...sets[setIndex],
          [field]: value === '' ? undefined : Number(value),
        }
        sets[setIndex] = updated
        return { ...log, sets }
      }),
    )
  }

  const handleToggleDone = (exerciseIndex: number) => {
    setExerciseLogs((prev) =>
      prev.map((log, i) =>
        i === exerciseIndex ? { ...log, done: !log.done } : log,
      ),
    )
  }

  const handleSaveAndExit = () => {
    navigate('/workouts')
  }

  const handleCompleteWorkout = () => {
    if (!allDone) return

    const logs = getJSON<WorkoutLog[]>('workout.logs', [])
    const newLog: WorkoutLog = {
      id: createId('log'),
      workoutId: detail.id,
      dateISO: new Date().toISOString(),
      durationMin: detail.durationMin,
      completed: true,
      highlight: 'Workout completed',
    }
    setJSON('workout.logs', [...logs, newLog])

    if (storageKey) {
      setJSON(storageKey, null)
    }

    navigate('/workouts')
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/workouts')}
          className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          חזרה לאימונים
        </button>
        <Badge className="text-[11px]">סשן אימון</Badge>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981]">
            <Dumbbell className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">
              {detail.name}
            </h1>
            <p className="text-xs text-text-secondary">
              {detail.tag} • {detail.durationMin} דק׳
            </p>
          </div>
        </div>
        <p className="text-xs text-text-secondary/80">
          תרגילים שהושלמו{' '}
          <span className="font-semibold text-text-primary">
            {completedExercises}/{totalExercises}
          </span>
        </p>
      </div>

      <div className="space-y-4">
        {detail.exercises.map((cfg, idx) => {
          const log = exerciseLogs[idx]
          const meta = exerciseMetaById.get(cfg.exerciseId)
          if (!log || !meta) return null

          return (
            <Card key={cfg.exerciseId} className="border-none bg-surface-2">
              <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-semibold">
                    {meta.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-text-secondary/80">
                    {meta.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] text-text-secondary/80">
                    {cfg.sets} סטים • {cfg.targetReps} חזרות • {cfg.restSec} שניות מנוחה
                  </span>
                  <label className="inline-flex items-center gap-2 text-[11px] text-text-secondary">
                    <input
                      type="checkbox"
                      className="h-3 w-3 rounded border-border bg-bg accent-[#10B981]"
                      checked={log.done}
                      onChange={() => handleToggleDone(idx)}
                    />
                    סמן כהושלם
                  </label>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-3 text-[11px] text-text-secondary">
                  <span>סטים</span>
                  <Button
                    type="button"
                    size="sm"
                    variant={meta.videoUrl ? 'secondary' : 'ghost'}
                    className="h-7 px-2 text-[11px]"
                    disabled={!meta.videoUrl}
                    onClick={() => {
                      if (meta.videoUrl) {
                        window.open(meta.videoUrl, '_blank', 'noopener')
                      }
                    }}
                  >
                    צפייה בדמו
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {log.sets.map((set, setIdx) => (
                    <div
                      key={setIdx}
                      className="grid grid-cols-[auto,1fr,1fr] items-center gap-3 rounded-xl bg-surface px-3 py-2"
                    >
                      <span className="text-xs text-text-secondary/80">
                        סט {setIdx + 1}
                      </span>
                      <Input
                        type="number"
                        placeholder="משקל (ק״ג)"
                        className="h-8 text-xs"
                        value={set.weight ?? ''}
                        onChange={(e) =>
                          handleSetChange(idx, setIdx, 'weight', e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="חזרות"
                        className="h-8 text-xs"
                        value={set.reps ?? ''}
                        onChange={(e) =>
                          handleSetChange(idx, setIdx, 'reps', e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="sticky bottom-0 -mx-4 mt-6 border-t border-border bg-bg/95 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full max-w-[180px]"
            onClick={handleSaveAndExit}
          >
            שמירה ויציאה
          </Button>
          <Button
            size="lg"
            className="w-full max-w-[220px]"
            onClick={handleCompleteWorkout}
            disabled={!allDone}
          >
            סיום האימון
          </Button>
        </div>
      </div>
    </div>
  )
}

