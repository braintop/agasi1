import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../app/ui/card'
import { Button } from '../../app/ui/button'
import {
  type BasicsInfo,
  type GoalsInfo,
  type FitnessInfo,
  type LifestyleInfo,
  type NutritionHabitsInfo,
  emptyBasicsInfo,
  emptyGoalsInfo,
  emptyFitnessInfo,
  emptyLifestyleInfo,
  emptyNutritionHabitsInfo,
} from '../../app/types/onboarding'
import { getJSON } from '../../app/utils/storage'

function useOnboardingSummary() {
  const basics = useMemo<BasicsInfo>(
    () => getJSON<BasicsInfo>('onboarding.basics', emptyBasicsInfo),
    [],
  )
  const goals = useMemo<GoalsInfo>(
    () => getJSON<GoalsInfo>('onboarding.goals', emptyGoalsInfo),
    [],
  )
  const fitness = useMemo<FitnessInfo>(
    () => getJSON<FitnessInfo>('onboarding.fitness', emptyFitnessInfo),
    [],
  )
  const lifestyle = useMemo<LifestyleInfo>(
    () => getJSON<LifestyleInfo>('onboarding.lifestyle', emptyLifestyleInfo),
    [],
  )
  const nutrition = useMemo<NutritionHabitsInfo>(
    () => getJSON<NutritionHabitsInfo>('onboarding.nutrition', emptyNutritionHabitsInfo),
    [],
  )

  return { basics, goals, fitness, lifestyle, nutrition }
}

export function CompletePage() {
  const navigate = useNavigate()
  const { basics, fitness, lifestyle, nutrition } = useOnboardingSummary()
  const strength = fitness.strength ?? {}
  const cardio = fitness.cardio ?? {}

  return (
    <div className="flex min-h-[60vh] flex-col items-center">
      <div className="mx-auto w-full max-w-3xl px-1">
        {/* ניווט – בשלב האחרון אין "המשך" */}
        <div className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-start px-1">
          <Button
            variant="primary"
            size="sm"
            className="min-w-[90px]"
            onClick={() => navigate('/nutrition')}
          >
            חזור
          </Button>
        </div>

        <div className="text-center">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/15">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10B981] text-xl text-bg">
              ✓
            </div>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-text-primary">
          התוכנית האישית שלך מוכנה
        </h1>
        <p className="mb-8 text-sm text-text-secondary">
          על בסיס המידע שמילאת יצרנו עבורך נקודת פתיחה מותאמת. תמיד אפשר לעדכן ולשנות בתוך האפליקציה.
        </p>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-3xl gap-4 px-1">
        {/* Profile summary */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-base">הפרופיל שלך</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              צילום־מצב קצר של המידע שמסרת לנו.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {basics.fullName && (
                <SummaryRow label="שם" value={basics.fullName} />
              )}
              {typeof basics.age === 'number' && (
                <SummaryRow label="גיל" value={`${basics.age}`} />
              )}
              {basics.gender && (
                <SummaryRow
                  label="מין"
                  value={
                    basics.gender === 'male'
                      ? 'Male'
                      : basics.gender === 'female'
                        ? 'Female'
                        : basics.gender
                  }
                />
              )}
              {typeof basics.heightCm === 'number' && (
                <SummaryRow label="גובה" value={`${basics.heightCm} ס״מ`} />
              )}
              {typeof basics.weightKg === 'number' && (
                <SummaryRow label="משקל" value={`${basics.weightKg} ק״ג`} />
              )}

              {strength.currently && (
                <SummaryRow
                  label="אימוני כוח"
                  value={
                    strength.currently === 'no'
                      ? 'לא'
                      : strength.currently === 'sometimes'
                        ? 'לפעמים'
                        : 'כן, באופן קבוע'
                  }
                />
              )}
              {strength.sessionsPerWeek && (
                <SummaryRow
                  label="אימוני כוח בשבוע"
                  value={`${strength.sessionsPerWeek}${strength.sessionsPerWeek === 4 ? '+' : ''}`}
                />
              )}
              {strength.experience && (
                <SummaryRow
                  label="ניסיון כוח"
                  value={
                    strength.experience === 'beginner'
                      ? 'מתחיל'
                      : strength.experience === 'intermediate'
                        ? 'בינוני'
                        : 'מתקדם'
                  }
                />
              )}
              {strength.priorities && strength.priorities.length > 0 && (
                <SummaryRow
                  label="מטרות כוח"
                  value={strength.priorities
                    .map((p) =>
                      p === 'strength'
                        ? 'כוח'
                        : p === 'hypertrophy'
                          ? 'היפרטרופיה'
                          : p === 'endurance'
                            ? 'סיבולת'
                            : 'משולב',
                    )
                    .join(' / ')}
                />
              )}

              {cardio.currently && (
                <SummaryRow
                  label="אירובי"
                  value={
                    cardio.currently === 'no'
                      ? 'לא'
                      : cardio.currently === 'sometimes'
                        ? 'לפעמים'
                        : 'כן, באופן קבוע'
                  }
                />
              )}
              {cardio.sessionsPerWeek && (
                <SummaryRow
                  label="אירובי בשבוע"
                  value={`${cardio.sessionsPerWeek}${cardio.sessionsPerWeek === 4 ? '+' : ''}`}
                />
              )}
              {cardio.types && cardio.types.length > 0 && (
                <SummaryRow
                  label="סוגי אירובי"
                  value={cardio.types
                    .map((t) =>
                      t === 'walking'
                        ? 'הליכה'
                        : t === 'running'
                          ? 'ריצה'
                          : t === 'cycling'
                            ? 'אופניים'
                            : t === 'swimming'
                              ? 'שחייה'
                              : t === 'rowing'
                                ? 'חתירה'
                                : 'אחר',
                    )
                    .join(' / ')}
                />
              )}
              {fitness.dailySteps && (
                <SummaryRow
                  label="צעדים ביום (כושר)"
                  value={
                    fitness.dailySteps === 'lt5k'
                      ? 'פחות מ־5,000'
                      : fitness.dailySteps === '5-7.5k'
                        ? '5,000–7,500'
                        : fitness.dailySteps === '7.5-10k'
                          ? '7,500–10,000'
                          : '10,000+'
                  }
                />
              )}
              {fitness.perceivedState && (
                <SummaryRow
                  label="תחושת כושר"
                  value={
                    fitness.perceivedState === 'strong'
                      ? 'מרגיש חזק'
                      : fitness.perceivedState === 'ok'
                        ? 'מרגיש בסדר'
                        : fitness.perceivedState === 'tired'
                          ? 'מרגיש עייף'
                          : 'מרגיש לא בכושר'
                  }
                />
              )}

              {/* Legacy fitness summary (if provided) */}
              {fitness.experience && (
                <SummaryRow
                  label="ניסיון אימוני (ישן)"
                  value={
                    fitness.experience === 'beginner'
                      ? 'מתחיל'
                      : fitness.experience === 'intermediate'
                        ? 'בינוני'
                        : 'מתקדם'
                  }
                />
              )}
              {fitness.location && (
                <SummaryRow
                  label="מקום אימון (ישן)"
                  value={
                    fitness.location === 'both'
                      ? 'חדר כושר ובית'
                      : fitness.location === 'gym'
                        ? 'חדר כושר'
                        : 'בית'
                  }
                />
              )}
              {typeof fitness.daysPerWeek === 'number' && (
                <SummaryRow
                  label="ימי אימון בשבוע (ישן)"
                  value={`${fitness.daysPerWeek}`}
                />
              )}
              {fitness.focus && (
                <SummaryRow
                  label="מוקד עיקרי (ישן)"
                  value={
                    fitness.focus === 'hypertrophy'
                      ? 'היפרטרופיה'
                      : fitness.focus === 'endurance'
                        ? 'סבולת'
                        : fitness.focus === 'strength'
                          ? 'כוח'
                          : 'משולב'
                  }
                />
              )}

              {lifestyle.sleep && (
                <SummaryRow
                  label="שינה"
                  value={
                    lifestyle.sleep === 'poor'
                      ? 'חלשה (0–5 שעות)'
                      : lifestyle.sleep === 'average'
                        ? 'בינונית (5–7 שעות)'
                        : 'טובה (7–9 שעות)'
                  }
                />
              )}
              {typeof lifestyle.stress === 'number' && (
                <SummaryRow label="סטרס" value={`${lifestyle.stress}/10`} />
              )}
              {lifestyle.steps && (
                <SummaryRow label="צעדים ביום" value={lifestyle.steps} />
              )}
              {lifestyle.nutrition && (
                <SummaryRow
                  label="תזונה"
                  value={
                    lifestyle.nutrition === 'not'
                      ? 'לא עקבית'
                      : lifestyle.nutrition === 'somewhat'
                        ? 'די עקבית'
                        : 'עקבית מאוד'
                  }
                />
              )}
              {lifestyle.sauna?.currently && (
                <SummaryRow
                  label="סאונה"
                  value={
                    lifestyle.sauna.currently === 'no'
                      ? 'לא'
                      : lifestyle.sauna.currently === 'sometimes'
                        ? 'לפעמים'
                        : 'כן, באופן קבוע'
                  }
                />
              )}
              {lifestyle.sauna?.timesPerWeek && (
                <SummaryRow
                  label="סאונה בשבוע"
                  value={
                    lifestyle.sauna.timesPerWeek === 'unknown'
                      ? 'לא בטוח'
                      : `${lifestyle.sauna.timesPerWeek}${lifestyle.sauna.timesPerWeek === 3 ? '+' : ''}`
                  }
                />
              )}
              {lifestyle.coldExposure?.currently && (
                <SummaryRow
                  label="חשיפה לקור"
                  value={
                    lifestyle.coldExposure.currently === 'no'
                      ? 'לא'
                      : lifestyle.coldExposure.currently === 'sometimes'
                        ? 'לפעמים'
                        : 'כן, באופן קבוע'
                  }
                />
              )}
              {lifestyle.coldExposure?.types && lifestyle.coldExposure.types.length > 0 && (
                <SummaryRow
                  label="סוגי קור"
                  value={lifestyle.coldExposure.types
                    .map((t) =>
                      t === 'iceBath'
                        ? 'אמבטיית קרח'
                        : t === 'coldShowers'
                          ? 'מקלחות קרות'
                          : t === 'seaNature'
                            ? 'ים / טבע'
                            : 'אחר',
                    )
                    .join(' / ')}
                />
              )}
              {lifestyle.dailyMovement && (
                <SummaryRow
                  label="תנועה יומית"
                  value={
                    lifestyle.dailyMovement === 'mostlySitting'
                      ? 'רוב היום בישיבה'
                      : lifestyle.dailyMovement === 'mixed'
                        ? 'שילוב של ישיבה ותנועה'
                        : 'רוב היום בתנועה'
                  }
                />
              )}
              {lifestyle.alcohol && (
                <SummaryRow
                  label="אלכוהול"
                  value={
                    lifestyle.alcohol === 'none'
                      ? 'לא שותה'
                      : lifestyle.alcohol === '1-2'
                        ? '1–2 פעמים בשבוע'
                        : '3+ פעמים בשבוע'
                  }
                />
              )}
              {lifestyle.smoking && (
                <SummaryRow
                  label="עישון"
                  value={
                    lifestyle.smoking === 'no'
                      ? 'לא'
                      : lifestyle.smoking === 'sometimes'
                        ? 'לפעמים'
                        : 'כן'
                  }
                />
              )}
              {lifestyle.supplements && (
                <SummaryRow
                  label="תוספים"
                  value={
                    lifestyle.supplements === 'no'
                      ? 'לא'
                      : lifestyle.supplements === 'basic'
                        ? 'כן – בסיסיים'
                        : 'כן – באופן קבוע'
                  }
                />
              )}

              {/* תזונה מוצגת בסיכום נפרד כדי להראות "סיכום מלא" */}
            </div>
          </CardContent>
        </Card>

        {/* Nutrition summary (full) */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-base">תזונה</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              סיכום מלא של הרגלי התזונה שסימנת.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              <SummaryRow
                label="סגנון אכילה"
                value={
                  nutrition.eatingStyle
                    ? nutrition.eatingStyle === 'regular'
                      ? 'רגיל / מעורב'
                      : nutrition.eatingStyle === 'protein'
                        ? 'דגש על חלבון'
                        : nutrition.eatingStyle === 'lowCarb'
                          ? 'דל פחמימות'
                          : nutrition.eatingStyle === 'vegetarian'
                            ? 'צמחוני'
                            : nutrition.eatingStyle === 'vegan'
                              ? 'טבעוני'
                              : 'לא מוגדר / משתנה'
                    : 'לא צוין'
                }
              />
              <SummaryRow
                label="ארוחות ביום"
                value={
                  nutrition.mealsPerDay
                    ? nutrition.mealsPerDay === 'varies'
                      ? 'משתנה'
                      : String(nutrition.mealsPerDay)
                    : 'לא צוין'
                }
              />
              <SummaryRow
                label="מקורות חלבון"
                value={
                  nutrition.proteinSources && nutrition.proteinSources.length > 0
                    ? nutrition.proteinSources
                        .map((p) =>
                          p === 'chicken'
                            ? 'עוף'
                            : p === 'beef'
                              ? 'בקר'
                              : p === 'fish'
                                ? 'דגים'
                                : p === 'eggs'
                                  ? 'ביצים'
                                  : p === 'dairy'
                                    ? 'מוצרי חלב'
                                    : p === 'legumes'
                                      ? 'קטניות'
                                      : p === 'tofuSoy'
                                        ? 'טופו / סויה'
                                        : p === 'proteinPowder'
                                          ? 'אבקות חלבון'
                                          : 'כמעט ולא אוכל חלבון',
                        )
                        .join(' / ')
                    : 'לא צוין'
                }
              />
              <SummaryRow
                label="הימנעויות"
                value={
                  nutrition.restrictions && nutrition.restrictions.length > 0
                    ? [
                        ...nutrition.restrictions
                          .filter((r) => r !== 'other')
                          .map((r) =>
                            r === 'pork'
                              ? 'חזיר'
                              : r === 'seafood'
                                ? 'פירות ים'
                                : r === 'gluten'
                                  ? 'גלוטן'
                                  : r === 'lactose'
                                    ? 'לקטוז'
                                    : r === 'soy'
                                      ? 'סויה'
                                      : 'אגוזים',
                          ),
                        ...(nutrition.restrictions.includes('other') &&
                        nutrition.restrictionsOtherText?.trim()
                          ? [nutrition.restrictionsOtherText.trim()]
                          : []),
                      ].join(' / ')
                    : 'ללא'
                }
              />
              <SummaryRow
                label="פירות וירקות"
                value={
                  nutrition.fruitsVeg
                    ? nutrition.fruitsVeg === 'daily'
                      ? 'כמעט כל יום'
                      : nutrition.fruitsVeg === 'sometimes'
                        ? 'לפעמים'
                        : 'כמעט ולא'
                    : 'לא צוין'
                }
              />
              <SummaryRow
                label="פחמימות"
                value={
                  nutrition.carbs
                    ? nutrition.carbs === 'free'
                      ? 'אוהב ואוכל חופשי'
                      : nutrition.carbs === 'moderate'
                        ? 'אוכל במידה'
                        : nutrition.carbs === 'avoid'
                          ? 'משתדל להימנע'
                          : 'לא בטוח'
                    : 'לא צוין'
                }
              />
              <SummaryRow
                label="אוכל בחוץ"
                value={
                  nutrition.eatingOut
                    ? nutrition.eatingOut === 'rarely'
                      ? 'כמעט לא'
                      : nutrition.eatingOut === '1-2'
                        ? '1–2 פעמים בשבוע'
                        : '3+ פעמים בשבוע'
                    : 'לא צוין'
                }
              />
              <SummaryRow
                label="מים ביום"
                value={
                  nutrition.hydration
                    ? nutrition.hydration === 'lt1l'
                      ? 'פחות מ־1 ליטר'
                      : nutrition.hydration === '1-2l'
                        ? '1–2 ליטר'
                        : nutrition.hydration === '2l+'
                          ? '2+ ליטר'
                          : 'לא בטוח'
                    : 'לא צוין'
                }
              />
              <SummaryRow
                label="משקאות ממותקים"
                value={
                  nutrition.sweetenedDrinks
                    ? nutrition.sweetenedDrinks === 'rarely'
                      ? 'כמעט לא'
                      : nutrition.sweetenedDrinks === 'sometimes'
                        ? 'לפעמים'
                        : 'באופן קבוע'
                    : 'לא צוין'
                }
              />
              <SummaryRow
                label="הערות תזונה"
                value={nutrition.notes?.trim() ? nutrition.notes.trim() : 'לא צוין'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recommended focus */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-base">על מה נשים דגש בהתחלה</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              שלושה צירים מרכזיים שינחו את השבועות הראשונים שלך.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <PillarCard
                title="תוכנית כוח"
                description="תרגילי בסיס 2–3 פעמים בשבוע לבניית חוסן וכוח."
              />
              <PillarCard
                title="בסיס קרדיו"
                description="אימוני Zone 2 עדינים לשיפור סבולת ובריאות הלב."
              />
              <PillarCard
                title="שיקום ושינה"
                description="הרגלים פשוטים לשיפור איכות השינה והפחתת סטרס."
              />
            </div>
          </CardContent>
        </Card>

        {/* Next steps */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-base">הצעדים הבאים</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              צ׳קליסט קצר למה שחשוב לעשות בביקור הראשון בדאשבורד.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>✓ להסתכל על אימון היום</li>
              <li>✓ למלא צ׳ק‑אין יומי ראשון</li>
              <li>✓ לעבור על תובנות ה‑AI ומסך ההתקדמות</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* מעבר לאפליקציה */}
      <div className="mx-auto mt-6 w-full max-w-3xl px-1">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/dashboard')}
        >
          כניסה לאפליקציה
        </Button>
      </div>
    </div>
  )
}

interface SummaryRowProps {
  label: string
  value: string
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-0.5 text-right">
      <span className="text-xs uppercase tracking-wide text-text-secondary/80">
        {label}
      </span>
      <span className="text-sm text-text-primary">{value}</span>
    </div>
  )
}

interface PillarCardProps {
  title: string
  description: string
}

function PillarCard({ title, description }: PillarCardProps) {
  return (
    <div className="rounded-2xl bg-surface-2 p-3 text-right">
      <h3 className="mb-1 text-xs font-semibold text-text-primary">
        {title}
      </h3>
      <p className="text-[11px] leading-snug text-text-secondary/90">
        {description}
      </p>
    </div>
  )
}


