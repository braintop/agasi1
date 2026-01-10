export type CardioType = 'Zone 2' | 'Intervals' | 'Easy' | 'Other'

export interface CardioPlan {
  id: string
  title: string
  weeklyTargetSessions: number
  targetMinutesPerSession: number
  notes: string
  sessionTypes: Array<{ type: Exclude<CardioType, 'Other'>; description: string }>
}

export interface CardioLog {
  id: string
  dateISO: string
  type: CardioType
  durationMin: number
  distanceKm?: number
  avgHr?: number
  notes?: string
}

export const cardioPlan: CardioPlan = {
  id: 'cp1',
  title: 'בסיס Zone 2',
  weeklyTargetSessions: 3,
  targetMinutesPerSession: 30,
  notes:
    'קרדיו בקצב קל שבו עדיין אפשר לדבר – לבניית בסיס אירובי בלי עומס מיותר.',
  sessionTypes: [
    {
      type: 'Zone 2',
      description: 'קרדיו יציב, בעצימות נמוכה, בקצב שבו אפשר לנהל שיחה.',
    },
    {
      type: 'Intervals',
      description: 'מקטעים קצרים מעל Zone 2 עם התאוששות מלאה ביניהם.',
    },
    {
      type: 'Easy',
      description: 'סשנים קלים מאוד לימים רגועים ולהתאוששות.',
    },
  ],
}

