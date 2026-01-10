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
import { Slider } from '../../app/ui/slider'
import {
  type LifestyleInfo,
  emptyLifestyleInfo,
  type LifestyleSleep,
  type LifestyleSteps,
  type LifestyleNutrition,
} from '../../app/types/onboarding'
import { getJSON, setJSON } from '../../app/utils/storage'
import { cn } from '../../app/utils/cn'

const STORAGE_KEY = 'onboarding.lifestyle'

const SLEEP_OPTIONS: { id: LifestyleSleep; label: string; helper: string }[] = [
  { id: 'poor', label: 'Poor', helper: '0–5 hours / night' },
  { id: 'average', label: 'Average', helper: '5–7 hours / night' },
  { id: 'good', label: 'Good', helper: '7–9 hours / night' },
]

const STEP_OPTIONS: { id: LifestyleSteps; label: string }[] = [
  { id: '<3k', label: '< 3k' },
  { id: '3-6k', label: '3k–6k' },
  { id: '6-10k', label: '6k–10k' },
  { id: '10k+', label: '10k+' },
]

const NUTRITION_OPTIONS: { id: LifestyleNutrition; label: string }[] = [
  { id: 'not', label: 'Not consistent' },
  { id: 'somewhat', label: 'Somewhat' },
  { id: 'very', label: 'Very consistent' },
]

export function LifestylePage() {
  const navigate = useNavigate()
  const [state, setState] = useState<LifestyleInfo>(() =>
    getJSON<LifestyleInfo>(STORAGE_KEY, emptyLifestyleInfo),
  )

  useEffect(() => {
    setJSON(STORAGE_KEY, state)
  }, [state])

  const isValid = useMemo(
    () => !!state.sleep && !!state.nutrition,
    [state.sleep, state.nutrition],
  )

  const handleContinue = () => {
    if (!isValid) return
    navigate('/complete')
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Lifestyle</CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            A few habits that affect your results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sleep */}
          <section className="space-y-2 border-b border-border/60 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                Sleep quality
              </h3>
              <p className="text-xs text-text-secondary/80">
                How would you describe your typical night&apos;s sleep?
              </p>
            </div>
            <div className="space-y-2">
              {SLEEP_OPTIONS.map((option) => {
                const selected = state.sleep === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setState((prev) => ({ ...prev, sleep: option.id }))
                    }
                    className={cn(
                      'flex w-full flex-col items-start gap-1 rounded-xl border px-4 py-2 text-left text-sm transition-colors',
                      'border-border bg-surface-2 text-text-secondary hover:bg-surface',
                      selected &&
                        'border-[#10B981] bg-surface text-text-primary shadow-card',
                    )}
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-text-secondary/80">
                      {option.helper}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Stress */}
          <section className="space-y-3 border-b border-border/60 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                Stress level
              </h3>
              <p className="text-xs text-text-secondary/80">
                Overall, how stressed do you feel day to day?
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-text-secondary/80">
                <span>Low</span>
                <span className="text-text-primary/90">
                  {state.stress ?? 5}/10
                </span>
                <span>High</span>
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={state.stress ?? 5}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    stress: Number(e.target.value),
                  }))
                }
              />
            </div>
          </section>

          {/* Steps */}
          <section className="space-y-2 border-b border-border/60 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                Daily steps
              </h3>
              <p className="text-xs text-text-secondary/80">
                Roughly how many steps do you get on a typical day?
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {STEP_OPTIONS.map((option) => {
                const selected = state.steps === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setState((prev) => ({ ...prev, steps: option.id }))
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

          {/* Nutrition */}
          <section className="space-y-2 border-b border-border/60 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                Nutrition consistency
              </h3>
              <p className="text-xs text-text-secondary/80">
                How consistently do you follow a nutrition plan or general
                guidelines?
              </p>
            </div>
            <div className="space-y-2">
              {NUTRITION_OPTIONS.map((option) => {
                const selected = state.nutrition === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setState((prev) => ({ ...prev, nutrition: option.id }))
                    }
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl border px-4 py-2 text-left text-sm transition-colors',
                      'border-border bg-surface-2 text-text-secondary hover:bg-surface',
                      selected &&
                        'border-[#10B981] bg-surface text-text-primary shadow-card',
                    )}
                  >
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-2">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                Notes
              </h3>
              <p className="text-xs text-text-secondary/80">
                Optional. Anything else we should know?
              </p>
            </div>
            <Textarea
              placeholder="Anything else we should know?"
              value={state.notes ?? ''}
              onChange={(e) =>
                setState((prev) => ({ ...prev, notes: e.target.value }))
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
            onClick={() => navigate('/fitness')}
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

