import { Dumbbell, HeartPulse } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../app/ui/card'
import { cn } from '../../app/utils/cn'

export function TrainingPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full space-y-5 pb-10">
      <Card className="border-none bg-surface">
        <CardHeader>
          <CardTitle className="text-base">אימון כח ואירובי</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className={cn(
              'flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-right',
              'hover:bg-white/10',
            )}
          >
            <div>
              <div className="text-sm font-semibold text-text-primary">אימון כוח</div>
              <div className="text-xs text-text-secondary/80">תוכניות, אימונים ומפגשים</div>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary-15)] text-[color:var(--primary)]">
              <Dumbbell className="h-4 w-4" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/cardio')}
            className={cn(
              'flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-right',
              'hover:bg-white/10',
            )}
          >
            <div>
              <div className="text-sm font-semibold text-text-primary">אירובי</div>
              <div className="text-xs text-text-secondary/80">Zone 2, אינטרוולים ועוד</div>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary-15)] text-[color:var(--primary)]">
              <HeartPulse className="h-4 w-4" />
            </span>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

