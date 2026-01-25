import { useState } from 'react'
import { AlertCircle, CalendarDays, ChevronLeft } from 'lucide-react'
import { Card, CardContent } from '../../app/ui/card'
import { cn } from '../../app/utils/cn'

export function TrainingPage() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('day')

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Top date card (matches screenshot) */}
      <Card className="border border-white/10 bg-surface">
        <CardContent className="py-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary"
              aria-label="פתח"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">היום</span>
              <CalendarDays className="h-4 w-4 text-[color:var(--primary)]" />
              <span className="text-xs text-text-secondary">2026 בינואר 25</span>
            </div>
            <span className="inline-flex h-10 w-10" />
          </div>
        </CardContent>
      </Card>

      {/* Segmented control (חודש/שבוע/יום) */}
      <Card className="border border-white/10 bg-surface">
        <CardContent className="space-y-3 py-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary"
              aria-label="פתח"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">היום</span>
              <CalendarDays className="h-4 w-4 text-[color:var(--primary)]" />
              <span className="text-xs text-text-secondary">2026 בינואר 25</span>
            </div>
            <span className="inline-flex h-10 w-10" />
          </div>

          <div className="flex items-center justify-between rounded-full bg-white/5 p-1">
            {[
              { id: 'month', label: 'חודש' },
              { id: 'week', label: 'שבוע' },
              { id: 'day', label: 'יום' },
            ].map((t) => {
              const active = view === (t.id as typeof view)
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setView(t.id as typeof view)}
                  className={cn(
                    'flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors',
                    active
                      ? 'bg-[color:var(--primary)] text-bg'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Empty state (day) */}
      {view === 'day' ? (
        <Card className="border border-white/10 bg-surface">
          <CardContent className="py-16 text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-text-primary/80">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="mt-5 text-xl font-semibold text-text-primary">
              אין אימון מתוכנן להיום
            </div>
            <div className="mt-2 text-sm text-text-secondary">
              יום מנוחה – תן לגוף שלך להתאושש
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-white/10 bg-surface">
          <CardContent className="py-12 text-center text-sm text-text-secondary">
            תצוגת {view === 'week' ? 'שבוע' : 'חודש'} (בנייה בהמשך)
          </CardContent>
        </Card>
      )}
    </div>
  )
}

