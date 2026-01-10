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
  { id: 'poor', label: 'חלשה', helper: '0–5 שעות בלילה' },
  { id: 'average', label: 'בינונית', helper: '5–7 שעות בלילה' },
  { id: 'good', label: 'טובה', helper: '7–9 שעות בלילה' },
]

const STEP_OPTIONS: { id: LifestyleSteps; label: string }[] = [
  { id: '<3k', label: 'פחות מ‑3,000' },
  { id: '3-6k', label: '3,000–6,000' },
  { id: '6-10k', label: '6,000–10,000' },
  { id: '10k+', label: '10,000+' },
]

const NUTRITION_OPTIONS: { id: LifestyleNutrition; label: string }[] = [
  { id: 'not', label: 'לא עקבית' },
  { id: 'somewhat', label: 'די עקבית' },
  { id: 'very', label: 'עקבית מאוד' },
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
      <Card className="mx-auto w-full max-w-3xl border-none">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">אורח חיים</CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            כמה הרגלים שמשפיעים ישירות על התוצאות שלך
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sleep */}
          <section className="space-y-2 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                איכות שינה
              </h3>
              <p className="text-xs text-text-secondary/80">
                איך היית מתאר את איכות השינה הממוצעת שלך?
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
                      'flex w-full flex-col items-start gap-1 rounded-xl px-4 py-2 text-left text-sm transition-colors',
                      'bg-surface-2 text-text-secondary hover:bg-surface',
                      selected &&
                        'bg-[#A96D51] text-[#2F2626] shadow-card',
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
          <section className="space-y-3 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                רמת סטרס
              </h3>
              <p className="text-xs text-text-secondary/80">
                באופן כללי, כמה לחוץ אתה מרגיש ביום‑יום?
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-text-secondary/80">
                  <span>נמוך</span>
                <span className="text-text-primary/90">
                  {state.stress ?? 5}/10
                </span>
                  <span>גבוה</span>
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
          <section className="space-y-2 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                צעדים ביום
              </h3>
              <p className="text-xs text-text-secondary/80">
                בערך כמה צעדים אתה עושה ביום ממוצע?
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
                      'rounded-xl px-4 py-2 text-sm transition-colors',
                      'bg-surface-2 text-text-secondary hover:bg-surface',
                      selected &&
                        'bg-[#A96D51] text-[#2F2626] shadow-card',
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Nutrition */}
          <section className="space-y-2 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                עקביות תזונתית
              </h3>
              <p className="text-xs text-text-secondary/80">
                עד כמה אתה מצליח לעמוד בקווים מנחים או בתוכנית תזונה?
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
                      'flex w-full items-center justify-between rounded-xl px-4 py-2 text-left text-sm transition-colors',
                      'bg-surface-2 text-text-secondary hover:bg-surface',
                      selected &&
                        'bg-[#A96D51] text-[#2F2626] shadow-card',
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
                הערות
              </h3>
              <p className="text-xs text-text-secondary/80">
                לא חובה. כל דבר נוסף שחשוב שנדע.
              </p>
            </div>
            <Textarea
              placeholder="כל דבר נוסף שחשוב שנדע..."
              value={state.notes ?? ''}
              onChange={(e) =>
                setState((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
            />
          </section>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 -mx-4 mt-8 bg-bg/95 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full max-w-[160px]"
            onClick={() => navigate('/fitness')}
          >
            חזרה
          </Button>
          <Button
            size="lg"
            className="w-full max-w-[220px]"
            onClick={handleContinue}
            disabled={!isValid}
          >
            המשך
          </Button>
        </div>
      </div>
    </div>
  )
}

