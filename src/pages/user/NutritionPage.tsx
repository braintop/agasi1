import { useMemo, useState } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  PencilLine,
  Search,
  Check,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../app/ui/card'
import { cn } from '../../app/utils/cn'
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

// Targets aligned to the Nutrition screen screenshot
const CAL_TARGET = 2000
const PROTEIN_TARGET = 150
const CARBS_TARGET = 200
const FAT_TARGET = 65

const DEFAULT_MEALS: MealEntry[] = []

export function NutritionPage() {
  const [meals, setMeals] = useState<MealEntry[]>(() =>
    getJSON<MealEntry[]>(STORAGE_KEY, DEFAULT_MEALS),
  )

  const [view, setView] = useState<'plan' | 'week' | 'day' | 'insights'>('day')

  const totals = useMemo(() => {
    const calories = meals.reduce((s, m) => s + m.calories, 0)
    const proteinG = meals.reduce((s, m) => s + m.proteinG, 0)
    // Mocked macro splits until connected to real nutrition model
    const carbsG = Math.round(Math.max(0, calories * 0.12) / 4) // very rough placeholder
    const fatG = Math.round(Math.max(0, calories * 0.08) / 9) // placeholder
    return { calories, proteinG, carbsG, fatG }
  }, [meals])

  const macroRows = useMemo(() => {
    type MacroRow = {
      key: 'cal' | 'protein' | 'carbs' | 'fat'
      label: string
      unit: 'cal' | 'g'
      value: number
      target: number
      highlight?: boolean
    }

    const rows: MacroRow[] = [
      {
        key: 'cal',
        label: 'קלוריות',
        unit: 'cal',
        value: totals.calories,
        target: CAL_TARGET,
      },
      {
        key: 'protein',
        label: 'חלבון',
        unit: 'g',
        value: totals.proteinG,
        target: PROTEIN_TARGET,
        highlight: true,
      },
      {
        key: 'carbs',
        label: 'פחמימות',
        unit: 'g',
        value: totals.carbsG,
        target: CARBS_TARGET,
      },
      {
        key: 'fat',
        label: 'שומן',
        unit: 'g',
        value: totals.fatG,
        target: FAT_TARGET,
      },
    ]

    return rows.map((r) => {
      const pct = Math.min(Math.round((r.value / r.target) * 100), 100)
      const missing = Math.max(0, r.target - r.value)
      return { ...r, pct, missing }
    })
  }, [totals.calories, totals.proteinG, totals.carbsG, totals.fatG])

  const planMeals = useMemo(
    () => [
      {
        id: 'breakfast',
        title: 'ארוחת בוקר',
        items: ['חביתה 2 ביצים', 'יוגורט יווני 150g', 'לחם מלא 2 פרוסות', 'אבוקדו חצי'],
        calories: 480,
        proteinG: 32,
      },
      {
        id: 'lunch',
        title: 'ארוחת צהריים',
        items: ['חזה עוף 200g', 'אורז חום 150g', 'סלט ירקות', 'חומוס 2 כפות'],
        calories: 620,
        proteinG: 55,
      },
      {
        id: 'dinner',
        title: 'ארוחת ערב',
        items: ['סלמון 180g', 'בטטה אפויה 200g', 'ברוקולי מאודה', 'שמן זית 1 כף'],
        calories: 580,
        proteinG: 48,
      },
      {
        id: 'snack',
        title: 'חטיף',
        items: ['שייק חלבון', 'בננה', 'שקדים 30g'],
        calories: 320,
        proteinG: 28,
      },
    ],
    [],
  )
  const [planChecked, setPlanChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(planMeals.map((m) => [m.id, false])),
  )

  const handleAddMeal = () => {
    const next: MealEntry = {
      id: `${Date.now()}`,
      type: 'Snack',
      description: 'רישום חופשי – ארוחה חדשה',
      calories: 350,
      proteinG: 25,
    }
    const updated = [...meals, next]
    setMeals(updated)
    setJSON(STORAGE_KEY, updated)
  }

  return (
    <div className="w-full space-y-6 pb-24">
      {/* Top: date + segmented */}
      <Card className="border border-white/10 bg-surface">
        <CardContent className="space-y-3 py-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary"
              aria-label="פתח"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">היום</span>
              <CalendarDays className="h-4 w-4 text-[color:var(--primary)]" />
              <span className="text-xs text-text-secondary">2026 בינואר 25</span>
            </div>
            <span className="inline-flex h-10 w-10" />
          </div>

          <div className="flex items-center justify-between rounded-full bg-white/5 p-1">
            {[
              { id: 'insights', label: 'תובנות' },
              { id: 'week', label: 'שבוע' },
              { id: 'day', label: 'היום' },
              { id: 'plan', label: 'תוכנית' },
            ].map((t) => {
              const active = view === (t.id as typeof view)
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setView(t.id as typeof view)}
                  className={cn(
                    'flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors',
                    active
                      ? 'bg-[color:var(--primary)] text-bg'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day view */}
      {view === 'day' && (
        <>
          <Card className="border border-white/10 bg-surface">
            <CardHeader className="mb-0 pb-2">
              <CardTitle className="text-base">היום</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {macroRows.map((r) => (
                <div key={r.key} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className={cn('font-semibold', r.highlight ? 'text-[color:var(--primary)]' : 'text-text-primary')}>
                      {r.label}
                      {r.highlight ? (
                        <span className="ml-2 text-[11px] font-medium text-[color:var(--primary)]">
                          המדד החשוב ביותר היום
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                        חסר
                      </span>
                      <span className="text-text-primary/90">
                        {r.value} / {r.target} {r.unit}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[color:var(--primary)]"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-surface">
            <CardHeader className="mb-0 pb-2">
              <CardTitle className="text-base">התפריט היומי שלך</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {planMeals.map((m) => {
                const checked = planChecked[m.id] ?? false
                return (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-white/10 bg-surface-2 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 text-right">
                        <div className="text-sm font-semibold text-text-primary">
                          {m.title}
                        </div>
                        <ul className="mt-2 space-y-1 text-xs text-text-secondary/80">
                          {m.items.map((it) => (
                            <li key={it}>- {it}</li>
                          ))}
                        </ul>
                        <div className="mt-3 text-xs text-text-secondary/80">
                          <span className="text-text-primary/90">{m.calories} קל׳</span>{' '}
                          | <span className="text-text-primary/90">{m.proteinG}g</span> חלבון
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPlanChecked((p) => ({ ...p, [m.id]: !checked }))}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
                          checked
                            ? 'bg-[color:var(--primary)] text-bg'
                            : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary',
                        )}
                      >
                        סמן כמלאתי
                        {checked ? <Check className="h-4 w-4" /> : null}
                      </button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-surface">
            <CardHeader className="mb-0 pb-2">
              <CardTitle className="text-base">הארוחות של היום</CardTitle>
            </CardHeader>
            <CardContent className="py-10 text-center text-sm text-text-secondary">
              {meals.length === 0 ? 'עדיין לא נרשמו ארוחות היום' : 'יש ארוחות שנרשמו היום'}
            </CardContent>
          </Card>
        </>
      )}

      {/* Bottom actions */}
      <div className="sticky bottom-0 -mx-6 bg-bg/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl gap-3">
          <button
            type="button"
            onClick={handleAddMeal}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-surface px-4 py-4',
              'text-sm font-semibold text-text-primary hover:bg-white/10',
            )}
          >
            <PencilLine className="h-4 w-4 text-[color:var(--primary)]" />
            רישום חופשי
          </button>
          <button
            type="button"
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-surface px-4 py-4',
              'text-sm font-semibold text-text-primary hover:bg-white/10',
            )}
          >
            <Search className="h-4 w-4 text-[color:var(--primary)]" />
            סמן ארוחה מהתפריט
          </button>
        </div>
      </div>
    </div>
  )
}

