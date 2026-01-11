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
  emptyBasicsInfo,
  emptyGoalsInfo,
  emptyFitnessInfo,
  emptyLifestyleInfo,
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

  return { basics, goals, fitness, lifestyle }
}

export function CompletePage() {
  const navigate = useNavigate()
  const { basics, fitness, lifestyle } = useOnboardingSummary()

  return (
    <div className="flex min-h-[60vh] flex-col items-center">
      <div className="mx-auto w-full max-w-3xl px-1">
        {/* ניווט – בשלב האחרון אין "המשך" */}
        <div className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-start px-1">
          <Button
            variant="primary"
            size="sm"
            className="min-w-[90px]"
            onClick={() => navigate('/lifestyle')}
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

              {fitness.experience && (
                <SummaryRow
                  label="ניסיון אימוני"
                  value={
                    fitness.experience.charAt(0).toUpperCase() +
                    fitness.experience.slice(1)
                  }
                />
              )}
              {fitness.location && (
                <SummaryRow
                  label="מקום אימון"
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
                <SummaryRow label="ימי אימון בשבוע" value={`${fitness.daysPerWeek}`} />
              )}
              {fitness.focus && (
                <SummaryRow
                  label="מוקד עיקרי"
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

      {/* אין "המשך" אחרי שלב 6 */}
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


