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
import { SelectableCard } from '../../app/ui/selectable-card'
import {
  type LifestyleInfo,
  emptyLifestyleInfo,
  type LifestyleSleep,
  type LifestyleNutrition,
  type LifestyleFrequency3,
  type SaunaPerWeek,
  type ColdExposureType,
  type DailyMovement,
  type AlcoholFrequency,
  type SmokingFrequency,
  type SupplementsFrequency,
} from '../../app/types/onboarding'
import { getJSON, setJSON } from '../../app/utils/storage'
import { cn } from '../../app/utils/cn'

const STORAGE_KEY = 'onboarding.lifestyle'

const SLEEP_OPTIONS: { id: LifestyleSleep; label: string; helper: string }[] = [
  { id: 'poor', label: 'חלשה', helper: '0–5 שעות בלילה' },
  { id: 'average', label: 'בינונית', helper: '5–7 שעות בלילה' },
  { id: 'good', label: 'טובה', helper: '7–9 שעות בלילה' },
]

const NUTRITION_OPTIONS: { id: LifestyleNutrition; label: string }[] = [
  { id: 'not', label: 'לא עקבית' },
  { id: 'somewhat', label: 'די עקבית' },
  { id: 'very', label: 'עקבית מאוד' },
]

const FREQUENCY_3_OPTIONS: { id: LifestyleFrequency3; label: string }[] = [
  { id: 'no', label: 'לא' },
  { id: 'sometimes', label: 'לפעמים' },
  { id: 'regular', label: 'כן, באופן קבוע' },
]

const SAUNA_TIMES_OPTIONS: { id: SaunaPerWeek; label: string }[] = [
  { id: 1, label: '1' },
  { id: 2, label: '2' },
  { id: 3, label: '3+' },
  { id: 'unknown', label: 'לא בטוח' },
]

const COLD_TYPES: { id: ColdExposureType; label: string }[] = [
  { id: 'iceBath', label: 'אמבטיית קרח' },
  { id: 'coldShowers', label: 'מקלחות קרות' },
  { id: 'seaNature', label: 'ים / טבע' },
  { id: 'other', label: 'אחר' },
]

const DAILY_MOVEMENT_OPTIONS: { id: DailyMovement; label: string }[] = [
  { id: 'mostlySitting', label: 'רוב היום בישיבה' },
  { id: 'mixed', label: 'שילוב של ישיבה ותנועה' },
  { id: 'mostlyMoving', label: 'רוב היום בתנועה' },
]

const ALCOHOL_OPTIONS: { id: AlcoholFrequency; label: string }[] = [
  { id: 'none', label: 'לא שותה' },
  { id: '1-2', label: '1–2 פעמים בשבוע' },
  { id: '3+', label: '3+ פעמים בשבוע' },
]

const SMOKING_OPTIONS: { id: SmokingFrequency; label: string }[] = [
  { id: 'no', label: 'לא' },
  { id: 'sometimes', label: 'לפעמים' },
  { id: 'yes', label: 'כן' },
]

const SUPPLEMENTS_OPTIONS: { id: SupplementsFrequency; label: string }[] = [
  { id: 'no', label: 'לא' },
  { id: 'yes', label: 'כן' },
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

  const sauna = state.sauna ?? {}
  const cold = state.coldExposure ?? {}
  const showSaunaDetails = sauna.currently === 'sometimes' || sauna.currently === 'regular'
  const showColdDetails = cold.currently === 'sometimes' || cold.currently === 'regular'

  const extendedValid = useMemo(() => {
    if (!isValid) return false
    if (showSaunaDetails && !sauna.timesPerWeek) return false
    if (showColdDetails && (!cold.types || cold.types.length === 0)) return false
    return true
  }, [isValid, showSaunaDetails, sauna.timesPerWeek, showColdDetails, cold.types])

  const handleContinue = () => {
    if (!extendedValid) return
    navigate('/onboarding/nutrition')
  }

  const setSauna = (patch: Partial<NonNullable<LifestyleInfo['sauna']>>) => {
    setState((prev) => ({
      ...prev,
      sauna: {
        ...(prev.sauna ?? {}),
        ...patch,
      },
    }))
  }

  const setCold = (patch: Partial<NonNullable<LifestyleInfo['coldExposure']>>) => {
    setState((prev) => ({
      ...prev,
      coldExposure: {
        ...(prev.coldExposure ?? {}),
        ...patch,
      },
    }))
  }

  const toggleColdType = (t: ColdExposureType) => {
    const current = cold.types ?? []
    const exists = current.includes(t)
    setCold({ types: exists ? current.filter((x) => x !== t) : [...current, t] })
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      {/* ניווט – המשך + חזור באותה שורה (מיושר לימין) */}
      <div className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-between gap-2 px-1">
        <Button
          variant="primary"
          size="sm"
          className="min-w-[90px]"
          onClick={() => navigate('/fitness')}
        >
          חזור
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="min-w-[90px]"
          onClick={handleContinue}
          disabled={!isValid}
        >
          המשך
        </Button>
      </div>

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
                      'border border-white/15 bg-surface-2 text-text-secondary hover:bg-surface',
                      selected &&
                        'bg-[#C98A6B] text-text-primary shadow-card hover:bg-[#A96D51]',
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
              <div className="flex h-10 items-center rounded-full border border-white/15 bg-white/5 px-3">
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
                  className="bg-transparent"
                />
              </div>
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
                      'border border-white/15 bg-surface-2 text-text-secondary hover:bg-surface',
                      selected &&
                        'bg-[#C98A6B] text-text-primary shadow-card hover:bg-[#A96D51]',
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

      {/* תוספות (בלי למחוק את הקיים) */}
      <div className="mx-auto mt-10 w-full max-w-3xl px-1">
        <div className="mb-6 border-t border-white/10 pt-8" />

        {/* Sauna / Heat Exposure */}
        <section className="space-y-4 pb-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold text-text-primary">סאונה / חום</h2>
            <p className="text-xs text-text-secondary/80">
              חשיפה לחום יכולה להשפיע על התאוששות ובריאות כללית.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              האם אתה משתמש בסאונה או חשיפה לחום?
            </h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {FREQUENCY_3_OPTIONS.map((opt) => {
                const selected = sauna.currently === opt.id
                return (
                  <SelectableCard
                    key={opt.id}
                    selected={selected}
                    onClick={() => {
                      if (opt.id === 'no') {
                        setSauna({ currently: 'no', timesPerWeek: undefined })
                      } else {
                        setSauna({ currently: opt.id })
                      }
                    }}
                    className="justify-center"
                  >
                    <span>{opt.label}</span>
                  </SelectableCard>
                )
              })}
            </div>
          </div>

          {showSaunaDetails && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-primary/90">
                כמה פעמים בשבוע?
              </h3>
              <div className="grid gap-2 sm:grid-cols-4">
                {SAUNA_TIMES_OPTIONS.map((opt) => {
                  const selected = sauna.timesPerWeek === opt.id
                  return (
                    <SelectableCard
                      key={String(opt.id)}
                      selected={selected}
                      onClick={() => setSauna({ timesPerWeek: opt.id })}
                      className="justify-center"
                    >
                      <span>{opt.label}</span>
                    </SelectableCard>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {/* Cold Exposure */}
        <section className="space-y-4 pb-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold text-text-primary">חשיפה לקור</h2>
            <p className="text-xs text-text-secondary/80">
              רק אם אתה עושה זאת בכוונה/באופן קבוע.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              האם אתה נחשף בכוונה לקור?
            </h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {FREQUENCY_3_OPTIONS.map((opt) => {
                const selected = cold.currently === opt.id
                return (
                  <SelectableCard
                    key={opt.id}
                    selected={selected}
                    onClick={() => {
                      if (opt.id === 'no') {
                        setCold({ currently: 'no', types: [] })
                      } else {
                        setCold({ currently: opt.id })
                      }
                    }}
                    className="justify-center"
                  >
                    <span>{opt.label}</span>
                  </SelectableCard>
                )
              })}
            </div>
          </div>

          {showColdDetails && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-primary/90">
                איזה סוגי חשיפה לקור?
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {COLD_TYPES.map((opt) => {
                  const selected = (cold.types ?? []).includes(opt.id)
                  return (
                    <SelectableCard
                      key={opt.id}
                      selected={selected}
                      onClick={() => toggleColdType(opt.id)}
                      className="justify-center"
                    >
                      <span>{opt.label}</span>
                    </SelectableCard>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {/* Daily Movement */}
        <section className="space-y-4 pb-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold text-text-primary">תנועה יומית</h2>
            <p className="text-xs text-text-secondary/80">
              איך נראה רוב היום שלך?
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {DAILY_MOVEMENT_OPTIONS.map((opt) => {
              const selected = state.dailyMovement === opt.id
              return (
                <SelectableCard
                  key={opt.id}
                  selected={selected}
                  onClick={() => setState((prev) => ({ ...prev, dailyMovement: opt.id }))}
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              )
            })}
          </div>
        </section>

        {/* Alcohol */}
        <section className="space-y-4 pb-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold text-text-primary">אלכוהול</h2>
            <p className="text-xs text-text-secondary/80">
              באיזו תדירות אתה שותה?
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {ALCOHOL_OPTIONS.map((opt) => {
              const selected = state.alcohol === opt.id
              return (
                <SelectableCard
                  key={opt.id}
                  selected={selected}
                  onClick={() => setState((prev) => ({ ...prev, alcohol: opt.id }))}
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              )
            })}
          </div>
        </section>

        {/* Smoking */}
        <section className="space-y-4 pb-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold text-text-primary">עישון</h2>
            <p className="text-xs text-text-secondary/80">
              האם אתה מעשן כרגע?
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {SMOKING_OPTIONS.map((opt) => {
              const selected = state.smoking === opt.id
              return (
                <SelectableCard
                  key={opt.id}
                  selected={selected}
                  onClick={() => setState((prev) => ({ ...prev, smoking: opt.id }))}
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              )
            })}
          </div>
        </section>

        {/* Supplements */}
        <section className="space-y-4 pb-2">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold text-text-primary">תוספים</h2>
            <p className="text-xs text-text-secondary/80">
              האם אתה לוקח תוספים כרגע?
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {SUPPLEMENTS_OPTIONS.map((opt) => {
              const selected = state.supplements === opt.id
              return (
                <SelectableCard
                  key={opt.id}
                  selected={selected}
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      supplements: opt.id,
                      supplementsDetails: opt.id === 'yes' ? prev.supplementsDetails : '',
                    }))
                  }
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              )
            })}
          </div>
          {state.supplements === 'yes' && (
            <div className="pt-2">
              <Textarea
                placeholder="איזה תוספים? (לדוגמה: ויטמין D, אומגה 3, מגנזיום...)"
                value={state.supplementsDetails ?? ''}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, supplementsDetails: e.target.value }))
                }
                rows={2}
              />
            </div>
          )}
        </section>
      </div>

      {/* כפתור המשך בתחתית (אחרי כל השדות) */}
      <div className="mx-auto mt-6 w-full max-w-3xl px-1">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleContinue}
          disabled={!extendedValid}
        >
          המשך
        </Button>
      </div>
    </div>
  )
}

