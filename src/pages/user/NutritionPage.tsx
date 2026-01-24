import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../app/ui/card'
import { Button } from '../../app/ui/button'
import { Badge } from '../../app/ui/badge'
import { getJSON, setJSON } from '../../app/utils/storage'

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'

interface MealEntry {
  id: string
  type: MealType
  description: string
  calories: number
  proteinG: number
}

const STORAGE_KEY = 'nutrition.meals'

const CAL_TARGET = 2100
const PROTEIN_TARGET = 120

const DEFAULT_MEALS: MealEntry[] = [
  {
    id: 'breakfast',
    type: 'Breakfast',
    description: 'ביצים מקושקשות עם טוסט מחיטה מלאה',
    calories: 420,
    proteinG: 32,
  },
  {
    id: 'lunch',
    type: 'Lunch',
    description: 'סלט עוף בגריל עם קינואה',
    calories: 520,
    proteinG: 38,
  },
]

export function NutritionPage() {
  const [meals, setMeals] = useState<MealEntry[]>(() =>
    getJSON<MealEntry[]>(STORAGE_KEY, DEFAULT_MEALS),
  )

  const totals = useMemo(() => {
    const calories = meals.reduce((s, m) => s + m.calories, 0)
    const proteinG = meals.reduce((s, m) => s + m.proteinG, 0)
    return { calories, proteinG }
  }, [meals])

  const caloriesPct = Math.min(Math.round((totals.calories / CAL_TARGET) * 100), 100)
  const proteinPct = Math.min(Math.round((totals.proteinG / PROTEIN_TARGET) * 100), 100)

  const week = useMemo(() => {
    // Mock, matches Figma screenshot: mostly low days
    return [
      { label: 'א׳, 18 בינו׳', calories: 0, proteinG: 0, status: 'נמוך' },
      { label: 'ב׳, 19 בינו׳', calories: 0, proteinG: 0, status: 'נמוך' },
      { label: 'ג׳, 20 בינו׳', calories: 0, proteinG: 0, status: 'נמוך' },
      { label: 'ד׳, 21 בינו׳', calories: 0, proteinG: 0, status: 'נמוך' },
      { label: 'ה׳, 22 בינו׳', calories: 0, proteinG: 0, status: 'נמוך' },
      { label: 'אתמול', calories: 0, proteinG: 0, status: 'נמוך' },
      { label: 'היום', calories: totals.calories, proteinG: totals.proteinG, status: 'נמוך' },
    ]
  }, [totals.calories, totals.proteinG])

  const handleAddMeal = () => {
    const next: MealEntry = {
      id: `${Date.now()}`,
      type: 'Snack',
      description: 'ארוחה חדשה',
      calories: 250,
      proteinG: 20,
    }
    const updated = [...meals, next]
    setMeals(updated)
    setJSON(STORAGE_KEY, updated)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-10">
      <Card className="border-none bg-surface">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">תזונה</CardTitle>
          <Button
            size="sm"
            onClick={handleAddMeal}
            className="bg-[color:var(--primary)] text-bg hover:bg-[color:var(--primary-dark)]"
          >
            <Plus className="mr-1 h-4 w-4" />
            הוסף ארוחה
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>קלוריות היום</span>
              <span className="text-text-primary/90">
                {totals.calories} / {CAL_TARGET} kcal
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[color:var(--primary)]"
                style={{ width: `${caloriesPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>חלבון היום</span>
              <span className="text-text-primary/90">
                {totals.proteinG} / {PROTEIN_TARGET} g
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[color:var(--primary)]"
                style={{ width: `${proteinPct}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-surface">
        <CardHeader>
          <CardTitle className="text-sm">ארוחות היום</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {meals.map((m) => (
            <div key={m.id} className="flex items-start justify-between rounded-2xl bg-surface-2 px-4 py-3 text-right">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-text-primary">
                  {m.type === 'Breakfast'
                    ? 'ארוחת בוקר'
                    : m.type === 'Lunch'
                      ? 'ארוחת צהריים'
                      : m.type === 'Dinner'
                        ? 'ארוחת ערב'
                        : 'נשנוש'}
                </div>
                <div className="text-[11px] text-text-secondary/80">{m.description}</div>
              </div>
              <div className="text-left text-xs">
                <div className="text-text-primary">{m.calories} kcal</div>
                <div className="text-[color:var(--primary)]">{m.proteinG}g חלבון</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-none bg-surface">
        <CardHeader>
          <CardTitle className="text-sm">סקירה שבועית</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {week.map((d) => (
            <div key={d.label} className="rounded-2xl bg-surface-2 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-text-primary/90">{d.label}</div>
                <Badge className="bg-[#C96B6B] text-white hover:bg-[#C96B6B]">
                  {d.status}
                </Badge>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-[11px] text-text-secondary/80">
                <div>
                  <div>קלוריות</div>
                  <div className="text-text-primary/90">
                    {d.calories} / {CAL_TARGET} (0%)
                  </div>
                </div>
                <div>
                  <div>חלבון</div>
                  <div className="text-text-primary/90">
                    {d.proteinG} / {PROTEIN_TARGET} (0%)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

