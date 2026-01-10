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
import { SelectableCard } from '../../app/ui/selectable-card'
import { type GoalsInfo, emptyGoalsInfo } from '../../app/types/onboarding'
import { getJSON, setJSON } from '../../app/utils/storage'

const STORAGE_KEY = 'onboarding.goals'

const GOALS = [
  'בניה שרירית',
  'הפחתת שומן',
  'שיפור כוח',
  'שיפור סבולת',
  'שיפור ניידות',
  'בריאות ואריכות ימים',
  'ביצועים ספורטיביים',
  'הפחתת סטרס',
] as const

export function GoalsPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<GoalsInfo>(() =>
    getJSON<GoalsInfo>(STORAGE_KEY, emptyGoalsInfo),
  )

  useEffect(() => {
    setJSON(STORAGE_KEY, state)
  }, [state])

  const hasSelection = useMemo(
    () => state.goals.length > 0,
    [state.goals.length],
  )

  const toggleGoal = (goal: string) => {
    setState((prev) => {
      const exists = prev.goals.includes(goal)
      return {
        goals: exists
          ? prev.goals.filter((g) => g !== goal)
          : [...prev.goals, goal],
      }
    })
  }

  const handleContinue = () => {
    if (!hasSelection) return
    navigate('/fitness')
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      <Card className="mx-auto w-full max-w-3xl border-none">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">מטרות</CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            בחר את כל המטרות שמתאימות לך
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {GOALS.map((goal) => (
              <SelectableCard
                key={goal}
                selected={state.goals.includes(goal)}
                onClick={() => toggleGoal(goal)}
                className="justify-start"
              >
                <span>{goal}</span>
              </SelectableCard>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 -mx-4 mt-8 bg-bg/95 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full max-w-[160px]"
            onClick={() => navigate('/basics')}
          >
            חזרה
          </Button>
          <Button
            size="lg"
            className="w-full max-w-[220px]"
            onClick={handleContinue}
            disabled={!hasSelection}
          >
            המשך
          </Button>
        </div>
      </div>
    </div>
  )
}

