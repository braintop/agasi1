import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../app/ui/card'
import { Input } from '../../app/ui/input'
import { SelectableCard } from '../../app/ui/selectable-card'
import { Button } from '../../app/ui/button'
import { getJSON, setJSON } from '../../app/utils/storage'

type EatingPattern = 'regular' | 'irregular'
type ProteinIntake = 'low' | 'medium' | 'high'
type NutritionGoal = 'fatLoss' | 'muscleGain' | 'maintenance' | 'longevity'

interface NutritionProfileInfo {
  eatingPattern?: EatingPattern
  mealsPerDay?: number
  proteinIntake?: ProteinIntake
  allergies?: string
  goal?: NutritionGoal
}

const STORAGE_KEY = 'profile.nutrition'

const EATING_PATTERN: { id: EatingPattern; label: string }[] = [
  { id: 'regular', label: 'מסודר' },
  { id: 'irregular', label: 'לא מסודר' },
]

const PROTEIN_LEVEL: { id: ProteinIntake; label: string }[] = [
  { id: 'low', label: 'נמוך' },
  { id: 'medium', label: 'בינוני' },
  { id: 'high', label: 'גבוה' },
]

const GOALS: { id: NutritionGoal; label: string }[] = [
  { id: 'fatLoss', label: 'ירידה בשומן' },
  { id: 'muscleGain', label: 'עלייה במסת שריר' },
  { id: 'maintenance', label: 'שימור' },
  { id: 'longevity', label: 'לונג׳ביטי' },
]

export function ProfileNutritionPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<NutritionProfileInfo>(() =>
    getJSON<NutritionProfileInfo>(STORAGE_KEY, {}),
  )

  useEffect(() => {
    setJSON(STORAGE_KEY, state)
  }, [state])

  return (
    <Card className="border-none bg-surface shadow-card">
      <CardHeader>
        <CardTitle className="text-xl">פרופיל תזונה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="space-y-2">
          <div className="text-xs font-medium text-text-secondary">דפוס אכילה</div>
          <div className="space-y-2">
            {EATING_PATTERN.map((opt) => (
              <SelectableCard
                key={opt.id}
                selected={state.eatingPattern === opt.id}
                onClick={() => setState((p) => ({ ...p, eatingPattern: opt.id }))}
                className="justify-start"
              >
                <span>{opt.label}</span>
              </SelectableCard>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <div className="text-xs font-medium text-text-secondary">ארוחות ביום</div>
          <Input
            type="number"
            min={1}
            placeholder="לדוגמה: 3"
            value={state.mealsPerDay ?? ''}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                mealsPerDay: e.target.value === '' ? undefined : Number(e.target.value),
              }))
            }
          />
        </section>

        <section className="space-y-2">
          <div className="text-xs font-medium text-text-secondary">רמת צריכת חלבון</div>
          <div className="space-y-2">
            {PROTEIN_LEVEL.map((opt) => (
              <SelectableCard
                key={opt.id}
                selected={state.proteinIntake === opt.id}
                onClick={() => setState((p) => ({ ...p, proteinIntake: opt.id }))}
                className="justify-start"
              >
                <span>{opt.label}</span>
              </SelectableCard>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <div className="text-xs font-medium text-text-secondary">אלרגיות / רגישויות</div>
          <Input
            type="text"
            placeholder="לדוגמה: לקטוז, גלוטן"
            value={state.allergies ?? ''}
            onChange={(e) => setState((p) => ({ ...p, allergies: e.target.value }))}
          />
        </section>

        <section className="space-y-2">
          <div className="text-xs font-medium text-text-secondary">מטרה מרכזית</div>
          <div className="space-y-2">
            {GOALS.map((opt) => (
              <SelectableCard
                key={opt.id}
                selected={state.goal === opt.id}
                onClick={() => setState((p) => ({ ...p, goal: opt.id }))}
                className="justify-start"
              >
                <span>{opt.label}</span>
              </SelectableCard>
            ))}
          </div>
        </section>

        <div className="flex gap-3">
          <Button
            type="button"
            size="lg"
            fullWidth
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              navigate('/dashboard')
            }}
          >
            סיום
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              navigate('/profile/fitness')
            }}
          >
            חזרה
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

