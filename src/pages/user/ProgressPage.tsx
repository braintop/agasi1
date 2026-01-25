import { TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
} from '../../app/ui/card'

export function ProgressPage() {
  return (
    <div className="w-full space-y-6 pb-10">
      <Card className="border-none bg-gradient-to-br from-surface-2 via-surface to-surface">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center md:py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[color:var(--primary)]">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <div className="text-2xl font-semibold text-text-primary">
              מעקב התקדמות
            </div>
            <div className="mt-2 text-sm text-text-secondary">
              בקרוב: צפייה במגמות ארוכות טווח ובהישגים.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
