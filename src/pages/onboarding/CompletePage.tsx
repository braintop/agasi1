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
      <div className="mx-auto w-full max-w-3xl px-1 text-center">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/15">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10B981] text-xl text-bg">
              ✓
            </div>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-text-primary">
          Your plan is ready
        </h1>
        <p className="mb-8 text-sm text-text-secondary">
          Based on your answers, here&apos;s your starting point. You can always
          refine it inside the app.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-3xl gap-4 px-1">
        {/* Profile summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Profile</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              A quick snapshot of the information you shared.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {basics.fullName && (
                <SummaryRow label="Name" value={basics.fullName} />
              )}
              {typeof basics.age === 'number' && (
                <SummaryRow label="Age" value={`${basics.age}`} />
              )}
              {basics.gender && (
                <SummaryRow
                  label="Gender"
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
                <SummaryRow label="Height" value={`${basics.heightCm} cm`} />
              )}
              {typeof basics.weightKg === 'number' && (
                <SummaryRow label="Weight" value={`${basics.weightKg} kg`} />
              )}

              {fitness.experience && (
                <SummaryRow
                  label="Experience"
                  value={
                    fitness.experience.charAt(0).toUpperCase() +
                    fitness.experience.slice(1)
                  }
                />
              )}
              {fitness.location && (
                <SummaryRow
                  label="Training location"
                  value={
                    fitness.location === 'both'
                      ? 'Gym & home'
                      : fitness.location === 'gym'
                        ? 'Gym'
                        : 'Home'
                  }
                />
              )}
              {typeof fitness.daysPerWeek === 'number' && (
                <SummaryRow
                  label="Days / week"
                  value={`${fitness.daysPerWeek}`}
                />
              )}
              {fitness.focus && (
                <SummaryRow
                  label="Primary focus"
                  value={
                    fitness.focus === 'hypertrophy'
                      ? 'Hypertrophy'
                      : fitness.focus === 'endurance'
                        ? 'Endurance'
                        : fitness.focus === 'strength'
                          ? 'Strength'
                          : 'Mixed'
                  }
                />
              )}

              {lifestyle.sleep && (
                <SummaryRow
                  label="Sleep"
                  value={
                    lifestyle.sleep === 'poor'
                      ? 'Poor (0–5h)'
                      : lifestyle.sleep === 'average'
                        ? 'Average (5–7h)'
                        : 'Good (7–9h)'
                  }
                />
              )}
              {typeof lifestyle.stress === 'number' && (
                <SummaryRow
                  label="Stress"
                  value={`${lifestyle.stress}/10`}
                />
              )}
              {lifestyle.steps && (
                <SummaryRow label="Daily steps" value={lifestyle.steps} />
              )}
              {lifestyle.nutrition && (
                <SummaryRow
                  label="Nutrition"
                  value={
                    lifestyle.nutrition === 'not'
                      ? 'Not consistent'
                      : lifestyle.nutrition === 'somewhat'
                        ? 'Somewhat consistent'
                        : 'Very consistent'
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommended focus */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended Focus</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              Three pillars we&apos;ll emphasize in your first weeks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <PillarCard
                title="Strength Program"
                description="Foundational compound lifts 2–3x per week to build resilience."
              />
              <PillarCard
                title="Cardio Base"
                description="Low-impact Zone 2 work to support heart health and recovery."
              />
              <PillarCard
                title="Recovery & Sleep"
                description="Simple routines to improve sleep quality and manage stress."
              />
            </div>
          </CardContent>
        </Card>

        {/* Next steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Next Steps</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              A quick checklist for your first visit inside Younger.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>✓ Check your first workout</li>
              <li>✓ Log your daily check-in</li>
              <li>✓ Explore your AI insights and progress views</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 -mx-4 mt-8 border-t border-border bg-bg/95 px-4 py-4">
        <div className="mx-auto flex max-w-3xl justify-center">
          <Button
            size="lg"
            className="w-full max-w-md"
            onClick={() => navigate('/dashboard')}
          >
            Enter App
          </Button>
        </div>
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
    <div className="flex flex-col gap-0.5 text-left">
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
    <div className="rounded-2xl border border-border bg-surface-2 p-3 text-left">
      <h3 className="mb-1 text-xs font-semibold text-text-primary">
        {title}
      </h3>
      <p className="text-[11px] leading-snug text-text-secondary/90">
        {description}
      </p>
    </div>
  )
}

