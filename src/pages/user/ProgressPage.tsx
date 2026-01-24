import { TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
} from '../../app/ui/card'

export function ProgressPage() {
  return (
    <div className="space-y-6 pb-10">
      <Card className="border-none bg-surface">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C98A6B]/15 text-[#C98A6B]">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold text-text-primary">
              מעקב התקדמות
            </div>
            <div className="mt-1 text-xs text-text-secondary">
              בקרוב: צפייה במגמות ארוכות טווח ובהישגים.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
