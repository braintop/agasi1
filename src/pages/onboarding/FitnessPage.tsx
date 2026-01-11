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
      label: 'מתחיל',
      helper: 'חדש באימונים או חוזר אחרי הפסקה',
    },
    {
      id: 'intermediate',
      label: 'בינוני',
      helper: '1–3 שנות אימון עקבי',
    },
    {
      id: 'advanced',
      label: 'מתקדם',
      helper: '3+ שנות אימון רציני ועקבי',
    },
  ]

const LOCATION_OPTIONS: { id: FitnessLocation; label: string }[] = [
  { id: 'gym', label: 'חדר כושר' },
  { id: 'home', label: 'בית' },
  { id: 'both', label: 'גם וגם' },
]

const FOCUS_OPTIONS: { id: FitnessFocus; label: string }[] = [
  { id: 'strength', label: 'כוח' },
  { id: 'hypertrophy', label: 'היפרטרופיה' },
  { id: 'endurance', label: 'סיבולת' },
  { id: 'mixed', label: 'משולב' },
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
    <div className="flex min-h-[60vh] flex-col pb-24">
      {/* ניווט – המשך + חזור באותה שורה (מיושר לימין) */}
      <div className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-between gap-2 px-1">
        <Button
          variant="primary"
          size="sm"
          className="min-w-[90px]"
          onClick={() => navigate('/goals')}
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
          <CardTitle className="text-2xl font-semibold">כושר</CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            עזור לנו להבין את רמת הכושר וההרגלים הנוכחיים שלך.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Experience */}
          <section className="space-y-2 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                ניסיון אימוני
              </h3>
              <p className="text-xs text-text-secondary/80">
                בחר את האפשרות שמתארת אותך בצורה הטובה ביותר.
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
          <section className="space-y-2 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                איפה אתה מתאמן?
              </h3>
              <p className="text-xs text-text-secondary/80">
                נתאים את התוכנית לסביבה שבה אתה מתאמן בפועל.
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

          {/* Days per week */}
          <section className="space-y-2 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                מספר ימי אימון בשבוע
              </h3>
              <p className="text-xs text-text-secondary/80">
                כמה ימים בשבוע תוכל להתחייב אליהם באופן מציאותי?
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
                      'flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-colors',
                      'bg-surface-2 text-text-secondary hover:bg-surface',
                      selected &&
                        'bg-[#A96D51] text-[#2F2626] shadow-card',
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Focus */}
          <section className="space-y-2 pb-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                מוקד עיקרי
              </h3>
              <p className="text-xs text-text-secondary/80">
                מה הדבר שהכי חשוב לך להשיג מהאימונים?
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

          {/* Limitations */}
          <section className="space-y-2">
            <div>
              <h3 className="text-sm font-medium text-text-primary/90">
                פציעות או מגבלות
              </h3>
              <p className="text-xs text-text-secondary/80">
                לא חובה. ספר לנו אם יש אזור שדורש התחשבות מיוחדת.
              </p>
            </div>
            <Textarea
              placeholder="לדוגמה: כאבי ברכיים, רגישות בגב התחתון..."
              value={state.limitations ?? ''}
              onChange={(e) =>
                setState((prev) => ({ ...prev, limitations: e.target.value }))
              }
              rows={3}
            />
          </section>
        </CardContent>
      </Card>

      {/* אין כפתור המשך למטה – משתמשים בשורת הניווט העליונה */}
    </div>
  )
}

