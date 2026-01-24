import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../app/ui/card'
import { Input } from '../../app/ui/input'
import { SelectableCard } from '../../app/ui/selectable-card'
import { Button } from '../../app/ui/button'
import { getJSON, setJSON } from '../../app/utils/storage'

type StrengthExperience = 'beginner' | 'intermediate' | 'advanced'
type StrengthGoal = 'strength' | 'muscle' | 'longevity'
type YesNo = 'yes' | 'no'

interface FitnessProfileInfo {
  strengthExperience?: StrengthExperience
  strengthSessionsPerWeek?: number
  strengthGoal?: StrengthGoal
  doesCardio?: YesNo
}

const STORAGE_KEY = 'profile.fitness'

const EXPERIENCE_OPTIONS: { id: StrengthExperience; label: string }[] = [
  { id: 'beginner', label: 'מתחיל' },
  { id: 'intermediate', label: 'בינוני' },
  { id: 'advanced', label: 'מתקדם' },
]

const GOAL_OPTIONS: { id: StrengthGoal; label: string }[] = [
  { id: 'strength', label: 'כוח' },
  { id: 'muscle', label: 'שריר' },
  { id: 'longevity', label: 'לונג׳ביטי' },
]

const YES_NO: { id: YesNo; label: string }[] = [
  { id: 'yes', label: 'כן' },
  { id: 'no', label: 'לא' },
]

export function ProfileFitnessPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<FitnessProfileInfo>(() =>
    getJSON<FitnessProfileInfo>(STORAGE_KEY, {}),
  )

  useEffect(() => {
    setJSON(STORAGE_KEY, state)
  }, [state])

  return (
    <Card className="border-none bg-surface shadow-card">
      <CardHeader>
        <CardTitle className="text-xl">פרופיל כושר</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary/90">אימוני כוח</h3>

          <div className="space-y-2">
            <div className="text-xs font-medium text-text-secondary">רמת ניסיון</div>
            <div className="space-y-2">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.id}
                  selected={state.strengthExperience === opt.id}
                  onClick={() => setState((p) => ({ ...p, strengthExperience: opt.id }))}
                  className="justify-start"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-text-secondary">
              תדירות שבועית (אימונים)
            </div>
            <Input
              type="number"
              min={0}
              placeholder="לדוגמה: 3"
              value={state.strengthSessionsPerWeek ?? ''}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  strengthSessionsPerWeek:
                    e.target.value === '' ? undefined : Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-text-secondary">מטרה מרכזית</div>
            <div className="space-y-2">
              {GOAL_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.id}
                  selected={state.strengthGoal === opt.id}
                  onClick={() => setState((p) => ({ ...p, strengthGoal: opt.id }))}
                  className="justify-start"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary/90">קרדיו</h3>
          <div className="space-y-2">
            <div className="text-xs font-medium text-text-secondary">האם אתה עושה קרדיו?</div>
            <div className="space-y-2">
              {YES_NO.map((opt) => (
                <SelectableCard
                  key={opt.id}
                  selected={state.doesCardio === opt.id}
                  onClick={() => setState((p) => ({ ...p, doesCardio: opt.id }))}
                  className="justify-start"
                >
                  <span>{opt.label}</span>
                </SelectableCard>
              ))}
            </div>
          </div>
        </section>

        <Button
          type="button"
          size="lg"
          fullWidth
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            navigate('/profile/nutrition')
          }}
        >
          הבא
        </Button>
      </CardContent>
    </Card>
  )
}

