import { CalendarCheck2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../app/ui/card'

export function DailyHabitsPage() {
  return (
    <div className="w-full space-y-5 pb-10">
      <Card className="border-none bg-surface">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">הרגלים יומיים</CardTitle>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary-15)] text-[color:var(--primary)]">
            <CalendarCheck2 className="h-4 w-4" />
          </span>
        </CardHeader>
        <CardContent className="text-sm text-text-secondary">
          עמוד ״הרגלים יומיים״ (placeholder). נעצב ונחבר נתונים בהמשך לפי פיגמה.
        </CardContent>
      </Card>
    </div>
  )
}

