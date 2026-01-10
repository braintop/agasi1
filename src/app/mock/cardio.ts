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
  title: 'Zone 2 Base',
  weeklyTargetSessions: 3,
  targetMinutesPerSession: 30,
  notes:
    'Easy, conversational pace cardio to build your aerobic base without adding fatigue.',
  sessionTypes: [
    {
      type: 'Zone 2',
      description: 'Steady, low intensity cardio at conversational pace.',
    },
    {
      type: 'Intervals',
      description: 'Short bursts above Zone 2 with full recovery.',
    },
    {
      type: 'Easy',
      description: 'Very light sessions for off-days and recovery.',
    },
  ],
}

