export const dailyScore = {
  label: 'Longevity Score',
  value: 78,
  trend: '+3 this week',
}

export const todayActions = [
  {
    id: 'workout',
    title: 'Workout',
    subtitle: 'Upper Body • 45 min',
    status: 'Pending',
    statusTone: 'primary' as const,
    cta: 'Start',
    to: '/workouts',
  },
  {
    id: 'cardio',
    title: 'Cardio',
    subtitle: 'Zone 2 • 30 min',
    status: 'Pending',
    statusTone: 'info' as const,
    cta: 'Log',
    to: '/cardio',
  },
  {
    id: 'checkin',
    title: 'Daily Check-in',
    subtitle: '1 min',
    status: 'Pending',
    statusTone: 'success' as const,
    cta: 'Complete',
    to: '/dailycheckin',
  },
] as const

export const streaks = {
  workoutDays: 4,
  checkInDays: 6,
}

export const aiInsightPreview =
  'Your consistency this week is trending up. Prioritize sleep tonight to support tomorrow’s training.'

