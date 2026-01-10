import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../app/ui/card'
import { Button } from '../../app/ui/button'
import { Textarea } from '../../app/ui/textarea'
import { SelectableCard } from '../../app/ui/selectable-card'
import {
  type FitnessInfo,
  emptyFitnessInfo,
  type FitnessExperience,
  type FitnessLocation,
  type FitnessFocus,
} from '../../app/types/onboarding'
import { getJSON, setJSON } from '../../app/utils/storage'
import { cn } from '../../app/utils/cn'

const STORAGE_KEY = 'onboarding.fitness'

const EXPERIENCE_OPTIONS: { id: FitnessExperience; label: string; helper: string }[] =
  [
    {
      id: 'beginner',
      label: 'Beginner',
      helper: 'New to training or returning after a break',
    },
    {
      id: 'intermediate',
      label: 'Intermediate',
      helper: '1–3 years of consistent training',
    },
    {
      id: 'advanced',
      label: 'Advanced',
      helper: '3+ years of serious training',
    },
  ]

const LOCATION_OPTIONS: { id: FitnessLocation; label: string }[] = [
  { id: 'gym', label: 'Gym' },
  { id: 'home', label: 'Home' },
  { id: 'both', label: 'Both' },
]

const FOCUS_OPTIONS: { id: FitnessFocus; label: string }[] = [
  { id: 'strength', label: 'Strength' },
  { id: 'hypertrophy', label: 'Hypertrophy' },
  { id: 'endurance', label: 'Endurance' },
  { id: 'mixed', label: 'Mixed' },
]

const DAYS = [1, 2, 3, 4, 5, 6, 7]

export function FitnessPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<FitnessInfo>(() =>
    getJSON<FitnessInfo>(STORAGE_KEY, emptyFitnessInfo),
  )

  useEffect(() => {
    setJSON(STORAGE_KEY, state)
  }, [state])

  const isValid = useMemo(
    () => !!state.experience && !!state.daysPerWeek,
    [state.experience, state.daysPerWeek],
  )

  const handleContinue = () => {
    if (!isValid) return
    navigate('/lifestyle')
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Fitness</CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            Help us understand your current level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Experience */}
          <section className="space-y-2 border-b border-border/60 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                Training Experience
              </h3>
              <p className="text-xs text-text-secondary/80">
                Choose the option that best describes you.
              </p>
            </div>
            <div className="space-y-2">
              {EXPERIENCE_OPTIONS.map((option) => {
                const selected = state.experience === option.id
                return (
                  <SelectableCard
                    key={option.id}
                    selected={selected}
                    onClick={() =>
                      setState((prev) => ({ ...prev, experience: option.id }))
                    }
                    className="flex-col items-start gap-1 text-left"
                  >
                    <span>{option.label}</span>
                    <span className="text-xs font-normal text-text-secondary/80">
                      {option.helper}
                    </span>
                  </SelectableCard>
                )
              })}
            </div>
          </section>

          {/* Location */}
          <section className="space-y-2 border-b border-border/60 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                Where do you train?
              </h3>
              <p className="text-xs text-text-secondary/80">
                We&apos;ll match your program to your environment.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {LOCATION_OPTIONS.map((option) => {
                const selected = state.location === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setState((prev) => ({ ...prev, location: option.id }))
                    }
                    className={cn(
                      'rounded-xl border px-4 py-2 text-sm transition-colors',
                      'border-border bg-surface-2 text-text-secondary hover:bg-surface',
                      selected &&
                        'border-[#10B981] bg-surface text-text-primary shadow-card',
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Days per week */}
          <section className="space-y-2 border-b border-border/60 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                Weekly training days
              </h3>
              <p className="text-xs text-text-secondary/80">
                How many days can you realistically commit?
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const selected = state.daysPerWeek === day
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() =>
                      setState((prev) => ({ ...prev, daysPerWeek: day }))
                    }
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl border text-sm transition-colors',
                      'border-border bg-surface-2 text-text-secondary hover:bg-surface',
                      selected &&
                        'border-[#10B981] bg-surface text-text-primary shadow-card',
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Focus */}
          <section className="space-y-2 border-b border-border/60 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                Primary focus
              </h3>
              <p className="text-xs text-text-secondary/80">
                What&apos;s the main outcome you care about?
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {FOCUS_OPTIONS.map((option) => {
                const selected = state.focus === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setState((prev) => ({ ...prev, focus: option.id }))
                    }
                    className={cn(
                      'rounded-xl border px-4 py-2 text-sm transition-colors',
                      'border-border bg-surface-2 text-text-secondary hover:bg-surface',
                      selected &&
                        'border-[#10B981] bg-surface text-text-primary shadow-card',
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Limitations */}
          <section className="space-y-2">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                Injuries or limitations
              </h3>
              <p className="text-xs text-text-secondary/80">
                Optional. Anything we should keep in mind when building your
                plan.
              </p>
            </div>
            <Textarea
              placeholder="e.g., knee pain, lower back sensitivity..."
              value={state.limitations ?? ''}
              onChange={(e) =>
                setState((prev) => ({ ...prev, limitations: e.target.value }))
              }
              rows={3}
            />
          </section>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 -mx-4 mt-8 border-t border-border bg-bg/95 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full max-w-[160px]"
            onClick={() => navigate('/goals')}
          >
            Back
          </Button>
          <Button
            size="lg"
            className="w-full max-w-[220px]"
            onClick={handleContinue}
            disabled={!isValid}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

