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
import { Input } from '../../app/ui/input'
import { Textarea } from '../../app/ui/textarea'
import { SelectableCard } from '../../app/ui/selectable-card'
import {
  type NutritionHabitsInfo,
  emptyNutritionHabitsInfo,
  type EatingStyle,
  type MealsPerDay,
  type ProteinSource,
  type Restriction,
  type FruitsVegFrequency,
  type CarbsAttitude,
  type EatingOutFrequency,
  type Hydration,
  type SweetenedDrinksFrequency,
} from '../../app/types/onboarding'
import { getJSON, setJSON } from '../../app/utils/storage'

const STORAGE_KEY = 'onboarding.nutrition'

const EATING_STYLE_OPTIONS: { id: EatingStyle; label: string }[] = [
  { id: 'regular', label: 'רגיל / מעורב' },
  { id: 'protein', label: 'דגש על חלבון' },
  { id: 'lowCarb', label: 'דל פחמימות' },
  { id: 'vegetarian', label: 'צמחוני' },
  { id: 'vegan', label: 'טבעוני' },
  { id: 'undefined', label: 'לא מוגדר / משתנה' },
]

const MEALS_PER_DAY_OPTIONS: { id: MealsPerDay; label: string }[] = [
  { id: 2, label: '2' },
  { id: 3, label: '3' },
  { id: '4+', label: '4+' },
  { id: 'varies', label: 'משתנה' },
]

const PROTEIN_SOURCES: { id: ProteinSource; label: string }[] = [
  { id: 'chicken', label: 'עוף' },
  { id: 'beef', label: 'בקר' },
  { id: 'fish', label: 'דגים' },
  { id: 'eggs', label: 'ביצים' },
  { id: 'dairy', label: 'מוצרי חלב' },
  { id: 'legumes', label: 'קטניות' },
  { id: 'tofuSoy', label: 'טופו / סויה' },
  { id: 'proteinPowder', label: 'אבקות חלבון' },
  { id: 'almostNone', label: 'כמעט ולא אוכל חלבון' },
]

const RESTRICTIONS: { id: Restriction; label: string }[] = [
  { id: 'fish', label: 'דגים' },
  { id: 'seafood', label: 'פירות ים' },
  { id: 'gluten', label: 'גלוטן' },
  { id: 'lactose', label: 'לקטוז' },
  { id: 'soy', label: 'סויה' },
  { id: 'nuts', label: 'אגוזים' },
  { id: 'other', label: 'אחר' },
]

const FRUITS_VEG_OPTIONS: { id: FruitsVegFrequency; label: string }[] = [
  { id: 'daily', label: 'כמעט כל יום' },
  { id: 'sometimes', label: 'לפעמים' },
  { id: 'rarely', label: 'כמעט ולא' },
]

const CARBS_OPTIONS: { id: CarbsAttitude; label: string }[] = [
  { id: 'free', label: 'אוהב ואוכל חופשי' },
  { id: 'moderate', label: 'אוכל במידה' },
  { id: 'avoid', label: 'משתדל להימנע' },
  { id: 'unsure', label: 'לא בטוח' },
]

const EATING_OUT_OPTIONS: { id: EatingOutFrequency; label: string }[] = [
  { id: 'rarely', label: 'כמעט לא' },
  { id: '1-2', label: '1–2 פעמים בשבוע' },
  { id: '3+', label: '3+ פעמים בשבוע' },
]

const HYDRATION_OPTIONS: { id: Hydration; label: string }[] = [
  { id: 'lt1l', label: 'פחות מ־1 ליטר' },
  { id: '1-2l', label: '1–2 ליטר' },
  { id: '2l+', label: '2+ ליטר' },
  { id: 'unsure', label: 'לא בטוח' },
]

const SWEETENED_DRINKS_OPTIONS: { id: SweetenedDrinksFrequency; label: string }[] =
  [
    { id: 'rarely', label: 'כמעט לא' },
    { id: 'sometimes', label: 'לפעמים' },
    { id: 'regular', label: 'באופן קבוע' },
  ]

export function NutritionPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<NutritionHabitsInfo>(() =>
    getJSON<NutritionHabitsInfo>(STORAGE_KEY, emptyNutritionHabitsInfo),
  )

  useEffect(() => {
    setJSON(STORAGE_KEY, state)
  }, [state])

  const restrictions = state.restrictions ?? []
  const proteinSources = state.proteinSources ?? []
  const hasOtherRestriction = restrictions.includes('other')

  const isValid = useMemo(() => {
    if (!state.eatingStyle) return false
    if (!state.mealsPerDay) return false
    // Protein sources and restrictions are helpful but not blocking at this stage.
    if (hasOtherRestriction && !state.restrictionsOtherText?.trim()) return false
    if (!state.fruitsVeg) return false
    if (!state.carbs) return false
    if (!state.eatingOut) return false
    if (!state.hydration) return false
    if (!state.sweetenedDrinks) return false
    if (!state.notes?.trim()) return false
    return true
  }, [
    state.eatingStyle,
    state.mealsPerDay,
    hasOtherRestriction,
    state.restrictionsOtherText,
    state.fruitsVeg,
    state.carbs,
    state.eatingOut,
    state.hydration,
    state.sweetenedDrinks,
    state.notes,
  ])

  const toggleProtein = (p: ProteinSource) => {
    const current = proteinSources
    const exists = current.includes(p)
    setState((prev) => ({
      ...prev,
      proteinSources: exists ? current.filter((x) => x !== p) : [...current, p],
    }))
  }

  const toggleRestriction = (r: Restriction) => {
    const current = restrictions
    const exists = current.includes(r)
    const next = exists ? current.filter((x) => x !== r) : [...current, r]
    setState((prev) => ({
      ...prev,
      restrictions: next,
      restrictionsOtherText: next.includes('other') ? prev.restrictionsOtherText : '',
    }))
  }

  const handleContinue = () => {
    if (!isValid) return
    navigate('/complete')
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      {/* ניווט עליון */}
      <div className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-between gap-2 px-1">
        <Button
          variant="primary"
          size="sm"
          className="min-w-[90px]"
          onClick={() => navigate('/lifestyle')}
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
          <CardTitle className="text-2xl font-semibold">הרגלי תזונה</CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            כמה שאלות קצרות כדי שנוכל לבנות תכנית תזונה ריאלית ומותאמת.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Eating style */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              איך היית מתאר את סגנון האכילה שלך כרגע?
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {EATING_STYLE_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.id}
                  selected={state.eatingStyle === opt.id}
                  onClick={() => setState((prev) => ({ ...prev, eatingStyle: opt.id }))}
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
          </section>

          {/* Meals per day */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              כמה ארוחות ביום אתה בדרך כלל אוכל?
            </h3>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
              {MEALS_PER_DAY_OPTIONS.map((opt) => (
                <SelectableCard
                  key={String(opt.id)}
                  selected={state.mealsPerDay === opt.id}
                  onClick={() => setState((prev) => ({ ...prev, mealsPerDay: opt.id }))}
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
          </section>

          {/* Protein sources */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              אילו מקורות חלבון אתה צורך באופן קבוע?
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {PROTEIN_SOURCES.map((opt) => (
                <SelectableCard
                  key={opt.id}
                  selected={proteinSources.includes(opt.id)}
                  onClick={() => toggleProtein(opt.id)}
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
          </section>

          {/* Restrictions */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              האם יש מזונות שאתה נמנע מהם או לא יכול לאכול?
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {RESTRICTIONS.map((opt) => (
                <SelectableCard
                  key={opt.id}
                  selected={restrictions.includes(opt.id)}
                  onClick={() => toggleRestriction(opt.id)}
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
            {hasOtherRestriction && (
              <div className="pt-2">
                <Input
                  type="text"
                  placeholder="כתוב בקצרה…"
                  value={state.restrictionsOtherText ?? ''}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      restrictionsOtherText: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </section>

          {/* Fruits & veg */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              באיזו תדירות אתה אוכל פירות וירקות?
            </h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {FRUITS_VEG_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.id}
                  selected={state.fruitsVeg === opt.id}
                  onClick={() => setState((prev) => ({ ...prev, fruitsVeg: opt.id }))}
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
          </section>

          {/* Carbs */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              איך אתה מרגיש לגבי פחמימות?
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {CARBS_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.id}
                  selected={state.carbs === opt.id}
                  onClick={() => setState((prev) => ({ ...prev, carbs: opt.id }))}
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
          </section>

          {/* Eating out */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              באיזו תדירות אתה אוכל בחוץ / אוכל מוכן?
            </h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {EATING_OUT_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.id}
                  selected={state.eatingOut === opt.id}
                  onClick={() => setState((prev) => ({ ...prev, eatingOut: opt.id }))}
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
          </section>

          {/* Hydration */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              כמה מים אתה שותה ביום?
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {HYDRATION_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.id}
                  selected={state.hydration === opt.id}
                  onClick={() => setState((prev) => ({ ...prev, hydration: opt.id }))}
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
          </section>

          {/* Sweetened drinks */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              באיזו תדירות אתה שותה משקאות ממותקים?
            </h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {SWEETENED_DRINKS_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.id}
                  selected={state.sweetenedDrinks === opt.id}
                  onClick={() =>
                    setState((prev) => ({ ...prev, sweetenedDrinks: opt.id }))
                  }
                  className="justify-center"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary/90">
              הערות <span className="text-danger">*</span>
            </h3>
            <Textarea
              placeholder="תאר בבקשה יום אכילה מייצג שלך והערות נוספות שתרצה להוסיף"
              value={state.notes ?? ''}
              onChange={(e) => setState((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </section>
        </CardContent>
      </Card>

      {/* כפתור המשך בתחתית */}
      <div className="mx-auto mt-6 w-full max-w-3xl px-1">
        <Button variant="primary" size="lg" fullWidth onClick={handleContinue} disabled={!isValid}>
          המשך
        </Button>
      </div>
    </div>
  )
}

