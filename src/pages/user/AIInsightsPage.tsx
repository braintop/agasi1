import { Sparkles } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../app/ui/card'
import { cn } from '../../app/utils/cn'

export function AIInsightsPage() {
  const items = [
    {
      label: 'היום',
      text: 'ביומיים האחרונים חוסר חלבון מעכב את ההתאוששות שלך.',
      tag: 'תזונה',
      tagTone: 'bg-[#10B981]/15 text-[#10B981]',
    },
    {
      label: 'אתמול',
      text: 'הרצף העקבי באימונים משפר משמעותית את ציון הלונג׳ביטי שלך.',
      tag: 'אימונים',
      tagTone: 'bg-[#C98A6B]/15 text-[#C98A6B]',
    },
    {
      label: 'חמישי, 22 בינואר',
      text: 'שינה קצרה ביום שלישי הורידה את איכות ההתאוששות ביום שאחריו.',
      tag: 'התאוששות',
      tagTone: 'bg-[#8B5CF6]/15 text-[#8B5CF6]',
    },
  ] as const

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6]">
          <Sparkles className="h-4 w-4" />
        </div>
        <h1 className="text-xl font-semibold text-text-primary">תובנות AI</h1>
      </div>

      {items.map((it) => (
        <Card key={it.label} className="border-none bg-surface">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xs font-semibold text-text-secondary">
                {it.label}
              </CardTitle>
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-[10px] font-semibold',
                  it.tagTone,
                )}
              >
                {it.tag}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-text-primary">
            {it.text}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
