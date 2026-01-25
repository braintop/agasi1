import { Dumbbell, Moon, Sparkles, Utensils } from 'lucide-react'
import {
  Card,
  CardContent,
} from '../../app/ui/card'
import { cn } from '../../app/utils/cn'

export function AIInsightsPage() {
  const items = [
    {
      dateLabel: 'אתמול',
      text: 'ביומיים האחרונים חוסר חלבון מעכב את ההתאוששות שלך.',
      tag: 'תזונה',
      icon: <Utensils className="h-4 w-4" />,
      tagTone: 'bg-[color:var(--primary-15)] text-[color:var(--primary)]',
    },
    {
      dateLabel: 'יום שישי, 23 בינואר',
      text: 'הרצף העקבי באימונים משפר משמעותית את ציון אריכות הימים שלך.',
      tag: 'אימון',
      icon: <Dumbbell className="h-4 w-4" />,
      tagTone: 'bg-[color:var(--primary-15)] text-[color:var(--primary)]',
    },
    {
      dateLabel: 'יום חמישי, 22 בינואר',
      text: 'שינה קצרה ביום שלישי הורידה את איכות ההתאוששות ביום שלאחר מכן.',
      tag: 'התאוששות',
      icon: <Moon className="h-4 w-4" />,
      tagTone: 'bg-[rgba(214,167,122,0.18)] text-[rgba(214,167,122,1)]',
    },
  ] as const

  return (
    <div className="w-full space-y-6 pb-10">
      <div className="flex items-center justify-center gap-3 pt-2">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          תובנות AI
        </h1>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[color:var(--primary)]">
          <Sparkles className="h-5 w-5" />
        </span>
      </div>

      {items.map((it) => (
        <Card key={it.dateLabel} className="border border-white/10 bg-surface">
          <CardContent className="space-y-3 py-6">
            <div className="flex items-center justify-between gap-3">
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
                  it.tagTone,
                )}
              >
                {it.icon}
                {it.tag}
              </span>
              <span className="text-xs font-semibold text-text-secondary">
                {it.dateLabel}
              </span>
            </div>

            <p className="text-center text-sm leading-relaxed text-text-primary/90">
              {it.text}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
