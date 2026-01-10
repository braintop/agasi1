export const dailyScore = {
  label: 'ציון אריכות ימים',
  value: 78,
  trend: '+3 השבוע',
}

export const todayActions = [
  {
    id: 'workout',
    title: 'אימון כוח',
    subtitle: 'פלג גוף עליון • 45 דק׳',
    status: 'ממתין',
    statusTone: 'primary' as const,
    cta: 'התחל',
    to: '/workouts',
  },
  {
    id: 'cardio',
    title: 'קרדיו',
    subtitle: 'Zone 2 • 30 דק׳',
    status: 'ממתין',
    statusTone: 'info' as const,
    cta: 'רשום',
    to: '/cardio',
  },
  {
    id: 'checkin',
    title: 'צ׳ק‑אין יומי',
    subtitle: 'דקה אחת',
    status: 'ממתין',
    statusTone: 'success' as const,
    cta: 'השלם',
    to: '/dailycheckin',
  },
] as const

export const streaks = {
  workoutDays: 4,
  checkInDays: 6,
}

export const aiInsightPreview =
  'העקביות שלך השבוע משתפרת. עדיף לתת עדיפות לשינה הלילה כדי לתמוך באימון של מחר.'

