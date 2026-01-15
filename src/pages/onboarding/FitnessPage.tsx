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
  type TrainingFrequency,
  type SessionsPerWeek,
  type StrengthPriority,
  type CardioType,
  type CardioStyle,
  type CardioHeartRateData,
  type DailyStepsRange,
  type PerceivedFitnessState,
} from '../../app/types/onboarding'
import { getJSON, setJSON } from '../../app/utils/storage'
import { cn } from '../../app/utils/cn'
import { Input } from '../../app/ui/input'

const STORAGE_KEY = 'onboarding.fitness'

const TRAINING_FREQUENCY_OPTIONS: { id: TrainingFrequency; label: string }[] = [
  { id: 'no', label: 'לא' },
  { id: 'sometimes', label: 'לפעמים' },
  { id: 'regular', label: 'כן, באופן קבוע' },
]

const SESSIONS_PER_WEEK_OPTIONS: { id: SessionsPerWeek; label: string }[] = [
  { id: 1, label: '1' },
  { id: 2, label: '2' },
  { id: 3, label: '3' },
  { id: 4, label: '4+' },
]

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

// Legacy (existing questionnaire)
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

const LEGACY_DAYS = [1, 2, 3, 4, 5, 6, 7]

const STRENGTH_PRIORITIES: { id: StrengthPriority; label: string }[] = [
  { id: 'strength', label: 'כוח' },
  { id: 'hypertrophy', label: 'היפרטרופיה' },
  { id: 'endurance', label: 'סיבולת' },
  { id: 'mixed', label: 'משולב' },
]

const CARDIO_TYPES: { id: CardioType; label: string }[] = [
  { id: 'walking', label: 'הליכה' },
  { id: 'running', label: 'ריצה' },
  { id: 'cycling', label: 'אופניים' },
  { id: 'swimming', label: 'שחייה' },
  { id: 'rowing', label: 'חתירה' },
  { id: 'other', label: 'אחר' },
]

const CARDIO_STYLES: { id: CardioStyle; label: string; helper?: string }[] = [
  { id: 'zone2', label: 'Zone 2', helper: 'אירובי קל ומתמשך' },
  { id: 'hiit', label: 'אינטרוולים / HIIT' },
  { id: 'mixed', label: 'שילוב של שניהם' },
  { id: 'unknown', label: 'לא בטוח / לא יודע' },
]

const HEART_RATE_OPTIONS: { id: CardioHeartRateData; label: string }[] = [
  { id: 'zone2', label: 'Zone 2' },
  { id: 'unknown', label: 'כללי / לא יודע' },
]

const DAILY_STEPS_OPTIONS: { id: DailyStepsRange; label: string }[] = [
  { id: 'lt5k', label: 'פחות מ־5,000' },
  { id: '5-7.5k', label: '5,000–7,500' },
  { id: '7.5-10k', label: '7,500–10,000' },
  { id: '10k+', label: '10,000+' },
]

const PERCEIVED_FITNESS_OPTIONS: { id: PerceivedFitnessState; label: string }[] =
  [
    { id: 'strong', label: 'מרגיש חזק' },
    { id: 'ok', label: 'מרגיש בסדר' },
    { id: 'tired', label: 'מרגיש עייף' },
    { id: 'unfit', label: 'מרגיש לא בכושר' },
  ]

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-1 text-center">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="text-xs text-text-secondary/80">{subtitle}</p>
    </div>
  )
}

function QuestionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-medium text-text-primary/90">{children}</h3>
  )
}

function OptionGrid({
  children,
  cols = 3,
}: {
  children: React.ReactNode
  cols?: 2 | 3 | 4
}) {
  const gridCols =
    cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-4' : 'grid-cols-3'

  return <div className={cn('grid gap-2', gridCols)}>{children}</div>
}

export function FitnessPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<FitnessInfo>(() =>
    getJSON<FitnessInfo>(STORAGE_KEY, emptyFitnessInfo),
  )

  useEffect(() => {
    setJSON(STORAGE_KEY, state)
  }, [state])

  const strength = state.strength ?? {}
  const cardio = state.cardio ?? {}
  const showStrengthDetails = strength.currently === 'sometimes' || strength.currently === 'regular'
  const showCardioDetails = cardio.currently === 'sometimes' || cardio.currently === 'regular'

  const isValid = useMemo(() => {
    // Keep legacy requirements as the primary gate (so this is an addition, not a replacement)
    if (!state.experience) return false
    if (!state.daysPerWeek) return false

    // New sections are optional, but if user starts them we validate progressively
    if (strength.currently) {
      if (showStrengthDetails) {
        if (!strength.sessionsPerWeek) return false
        if (!strength.experience) return false
        if (!strength.priorities || strength.priorities.length === 0) return false
        if (strength.priorities.length > 2) return false
      }
    }

    if (cardio.currently) {
      if (showCardioDetails) {
        if (!cardio.sessionsPerWeek) return false
        if (!cardio.types || cardio.types.length === 0) return false
        if (!cardio.styles || cardio.styles.length === 0) return false
      }
    }

    return true
  }, [
    state.experience,
    state.daysPerWeek,
    strength.currently,
    cardio.currently,
    showStrengthDetails,
    showCardioDetails,
    strength.sessionsPerWeek,
    strength.experience,
    strength.priorities,
    cardio.sessionsPerWeek,
    cardio.types,
    cardio.styles,
  ])

  const handleContinue = () => {
    if (!isValid) return
    navigate('/lifestyle')
  }

  const setStrength = (patch: Partial<NonNullable<FitnessInfo['strength']>>) => {
    setState((prev) => ({
      ...prev,
      strength: {
        ...(prev.strength ?? {}),
        ...patch,
      },
    }))
  }

  const setCardio = (patch: Partial<NonNullable<FitnessInfo['cardio']>>) => {
    setState((prev) => ({
      ...prev,
      cardio: {
        ...(prev.cardio ?? {}),
        ...patch,
      },
    }))
  }

  const toggleStrengthPriority = (priority: StrengthPriority) => {
    const current = strength.priorities ?? []
    const exists = current.includes(priority)

    if (exists) {
      setStrength({ priorities: current.filter((p) => p !== priority) })
      return
    }

    if (current.length >= 2) return
    setStrength({ priorities: [...current, priority] })
  }

  const toggleCardioType = (t: CardioType) => {
    const current = cardio.types ?? []
    const exists = current.includes(t)
    setCardio({ types: exists ? current.filter((x) => x !== t) : [...current, t] })
  }

  const toggleCardioStyle = (s: CardioStyle) => {
    const current = cardio.styles ?? []
    const exists = current.includes(s)
    setCardio({
      styles: exists ? current.filter((x) => x !== s) : [...current, s],
    })
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
            נשאל כמה שאלות קצרות כדי להבין את הרגלי האימונים שלך.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* Legacy questionnaire (kept as-is, new questions are added below) */}
          <section className="space-y-6">
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
              <OptionGrid cols={3}>
                {LOCATION_OPTIONS.map((option) => {
                  const selected = state.location === option.id
                  return (
                    <SelectableCard
                      key={option.id}
                      selected={selected}
                      onClick={() =>
                        setState((prev) => ({ ...prev, location: option.id }))
                      }
                      className="justify-center"
                    >
                      <span>{option.label}</span>
                    </SelectableCard>
                  )
                })}
              </OptionGrid>
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
                {LEGACY_DAYS.map((day) => {
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
                        'border border-white/15 bg-surface-2 text-text-secondary hover:bg-surface',
                        selected && 'bg-[#C98A6B] text-text-primary shadow-card hover:bg-[#A96D51]',
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
                        'rounded-xl border border-white/15 px-4 py-2 text-sm transition-colors',
                        'bg-transparent text-text-primary hover:bg-white/5',
                        selected &&
                          'border-transparent bg-[#C98A6B] text-text-primary shadow-card hover:bg-[#A96D51]',
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
          </section>

          {/* Divider */}
          <div className="border-t border-white/10 pt-8" />

          {/* SECTION 1: Strength Training */}
          <section className="space-y-4">
            <SectionHeader
              title="אימוני כוח"
              subtitle="עוזר לנו להבין את רמת הכושר וההרגלים הנוכחיים שלך."
            />

            <div className="space-y-2">
              <QuestionTitle>האם אתה עושה כרגע אימוני כוח?</QuestionTitle>
              <OptionGrid cols={3}>
                {TRAINING_FREQUENCY_OPTIONS.map((opt) => {
                  const selected = strength.currently === opt.id
                  return (
                    <SelectableCard
                      key={opt.id}
                      selected={selected}
                      onClick={() => {
                        const next = opt.id
                        if (next === 'no') {
                          setStrength({
                            currently: next,
                            sessionsPerWeek: undefined,
                            experience: undefined,
                            priorities: [],
                            limitations: strength.limitations,
                          })
                        } else {
                          setStrength({ currently: next })
                        }
                      }}
                      className="justify-center"
                    >
                      <span>{opt.label}</span>
                    </SelectableCard>
                  )
                })}
              </OptionGrid>
            </div>

            {showStrengthDetails && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <QuestionTitle>כמה אימוני כוח בשבוע?</QuestionTitle>
                  <OptionGrid cols={4}>
                    {SESSIONS_PER_WEEK_OPTIONS.map((opt) => {
                      const selected = strength.sessionsPerWeek === opt.id
                      return (
                        <SelectableCard
                          key={opt.id}
                          selected={selected}
                          onClick={() => setStrength({ sessionsPerWeek: opt.id })}
                          className="justify-center"
                        >
                          <span>{opt.label}</span>
                        </SelectableCard>
                      )
                    })}
                  </OptionGrid>
                </div>

                <div className="space-y-2">
                  <QuestionTitle>מה רמת הניסיון שלך?</QuestionTitle>
                  <div className="space-y-2">
                    {EXPERIENCE_OPTIONS.map((opt) => {
                      const selected = strength.experience === opt.id
                      return (
                        <SelectableCard
                          key={opt.id}
                          selected={selected}
                          onClick={() => setStrength({ experience: opt.id })}
                          className="flex-col items-start gap-1 text-left"
                        >
                          <span>{opt.label}</span>
                          <span className="text-xs font-normal text-text-secondary/80">
                            {opt.helper}
                          </span>
                        </SelectableCard>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <QuestionTitle>מה הכי חשוב לך באימוני כוח?</QuestionTitle>
                    <span className="text-[11px] text-text-secondary/75">
                      עד 2 בחירות
                    </span>
                  </div>
                  <OptionGrid cols={2}>
                    {STRENGTH_PRIORITIES.map((opt) => {
                      const selected = (strength.priorities ?? []).includes(opt.id)
                      const disabled =
                        !selected && (strength.priorities ?? []).length >= 2
                      return (
                        <SelectableCard
                          key={opt.id}
                          selected={selected}
                          disabled={disabled}
                          onClick={() => toggleStrengthPriority(opt.id)}
                          className={cn(
                            'justify-center',
                            disabled && 'opacity-60',
                          )}
                        >
                          <span>{opt.label}</span>
                        </SelectableCard>
                      )
                    })}
                  </OptionGrid>
                </div>

                <div className="space-y-2">
                  <QuestionTitle>האם יש פציעות או מגבלות? (לא חובה)</QuestionTitle>
                  <Textarea
                    placeholder="לדוגמה: גב תחתון, ברכיים, כתפיים..."
                    value={strength.limitations ?? ''}
                    onChange={(e) => setStrength({ limitations: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </section>

          {/* SECTION 2: Cardio / Aerobic Training */}
          <section className="space-y-4">
            <SectionHeader
              title="אימונים אירוביים"
              subtitle="הליכה, ריצה, אופניים, שחייה או כל פעילות אירובית אחרת."
            />

            <div className="space-y-2">
              <QuestionTitle>האם אתה עושה כרגע אימונים אירוביים?</QuestionTitle>
              <OptionGrid cols={3}>
                {TRAINING_FREQUENCY_OPTIONS.map((opt) => {
                  const selected = cardio.currently === opt.id
                  return (
                    <SelectableCard
                      key={opt.id}
                      selected={selected}
                      onClick={() => {
                        const next = opt.id
                        if (next === 'no') {
                          setCardio({
                            currently: next,
                            sessionsPerWeek: undefined,
                            types: [],
                            styles: [],
                            avgDurationMin: undefined,
                            avgDistanceKm: undefined,
                            heartRateData: undefined,
                          })
                        } else {
                          setCardio({ currently: next })
                        }
                      }}
                      className="justify-center"
                    >
                      <span>{opt.label}</span>
                    </SelectableCard>
                  )
                })}
              </OptionGrid>
            </div>

            {showCardioDetails && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <QuestionTitle>כמה אימונים אירוביים בשבוע?</QuestionTitle>
                  <OptionGrid cols={4}>
                    {SESSIONS_PER_WEEK_OPTIONS.map((opt) => {
                      const selected = cardio.sessionsPerWeek === opt.id
                      return (
                        <SelectableCard
                          key={opt.id}
                          selected={selected}
                          onClick={() => setCardio({ sessionsPerWeek: opt.id })}
                          className="justify-center"
                        >
                          <span>{opt.label}</span>
                        </SelectableCard>
                      )
                    })}
                  </OptionGrid>
                </div>

                <div className="space-y-2">
                  <QuestionTitle>אילו סוגי אירובי אתה עושה?</QuestionTitle>
                  <OptionGrid cols={2}>
                    {CARDIO_TYPES.map((opt) => {
                      const selected = (cardio.types ?? []).includes(opt.id)
                      return (
                        <SelectableCard
                          key={opt.id}
                          selected={selected}
                          onClick={() => toggleCardioType(opt.id)}
                          className="justify-center"
                        >
                          <span>{opt.label}</span>
                        </SelectableCard>
                      )
                    })}
                  </OptionGrid>
                </div>

                <div className="space-y-2">
                  <QuestionTitle>איזה סוג אירובי אתה בדרך כלל עושה?</QuestionTitle>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {CARDIO_STYLES.map((opt) => {
                      const selected = (cardio.styles ?? []).includes(opt.id)
                      return (
                        <SelectableCard
                          key={opt.id}
                          selected={selected}
                          onClick={() => toggleCardioStyle(opt.id)}
                          className="flex-col items-start gap-1 text-left"
                        >
                          <span>{opt.label}</span>
                          {opt.helper && (
                            <span className="text-xs font-normal text-text-secondary/80">
                              {opt.helper}
                            </span>
                          )}
                        </SelectableCard>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <QuestionTitle>מדדים אופייניים (לא חובה)</QuestionTitle>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="mb-2 text-xs font-semibold text-text-primary/90">
                        משך ממוצע לאימון (דקות)
                      </div>
                      <Input
                        type="number"
                        min={1}
                        placeholder="45"
                        value={cardio.avgDurationMin ?? ''}
                        onChange={(e) =>
                          setCardio({
                            avgDurationMin:
                              e.target.value === ''
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="mb-2 text-xs font-semibold text-text-primary/90">
                        מרחק ממוצע (ק״מ)
                      </div>
                      <Input
                        type="number"
                        min={0}
                        step="0.1"
                        placeholder="5"
                        value={cardio.avgDistanceKm ?? ''}
                        onChange={(e) =>
                          setCardio({
                            avgDistanceKm:
                              e.target.value === ''
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="mb-2 text-xs font-semibold text-text-primary/90">
                        נתוני דופק
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {HEART_RATE_OPTIONS.map((opt) => {
                          const selected = cardio.heartRateData === opt.id
                          return (
                            <SelectableCard
                              key={opt.id}
                              selected={selected}
                              onClick={() => setCardio({ heartRateData: opt.id })}
                              className="justify-center py-2"
                            >
                              <span className="text-xs">{opt.label}</span>
                            </SelectableCard>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <QuestionTitle>צעדים ממוצעים ביום</QuestionTitle>
              <p className="text-xs text-text-secondary/80">
                גם הליכה יומיומית נחשבת.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {DAILY_STEPS_OPTIONS.map((opt) => {
                  const selected = state.dailySteps === opt.id
                  return (
                    <SelectableCard
                      key={opt.id}
                      selected={selected}
                      onClick={() => setState((prev) => ({ ...prev, dailySteps: opt.id }))}
                      className="justify-center"
                    >
                      <span>{opt.label}</span>
                    </SelectableCard>
                  )
                })}
              </div>
            </div>
          </section>

          {/* SECTION 3: Perceived Fitness State */}
          <section className="space-y-4">
            <SectionHeader
              title="איך אתה מרגיש עם הכושר שלך היום?"
              subtitle="נותן לנו קונטקסט ל‑AI ולהמלצות מותאמות."
            />
            <div className="grid gap-2 sm:grid-cols-2">
              {PERCEIVED_FITNESS_OPTIONS.map((opt) => {
                const selected = state.perceivedState === opt.id
                return (
                  <SelectableCard
                    key={opt.id}
                    selected={selected}
                    onClick={() =>
                      setState((prev) => ({ ...prev, perceivedState: opt.id }))
                    }
                    className="justify-center"
                  >
                    <span>{opt.label}</span>
                  </SelectableCard>
                )
              })}
            </div>
          </section>
        </CardContent>
      </Card>

      {/* כפתור המשך בתחתית (אחרי כל השדות) */}
      <div className="mx-auto mt-6 w-full max-w-3xl px-1">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleContinue}
          disabled={!isValid}
        >
          המשך
        </Button>
      </div>
    </div>
  )
}

