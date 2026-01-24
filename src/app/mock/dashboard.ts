export const longevityScore = {
  value: 78,
  trend: '+3 this week',
  explanation: 'הציון עלה בזכות התמדה באימונים ושינה טובה.',
} as const

export const explainScoreBreakdown = {
  workouts: 'טוב',
  cardio: 'בינוני',
  nutrition: 'חלש',
  sleep: 'טוב',
  recommendation: 'אם תוסיף 2 אימוני Zone 2 השבוע – הציון צפוי לעלות.',
} as const

export const todayActions = [
  {
    id: 'workout',
    title: 'אימון כוח',
    subtitle: 'פלג גוף עליון • 45 דק׳',
    status: '⏳',
    completed: false,
    to: '/workouts',
  },
  {
    id: 'cardio',
    title: 'קרדיו',
    subtitle: 'Zone 2 • 30 דק׳',
    status: '⏳',
    completed: false,
    to: '/cardio',
  },
  {
    id: 'nutrition',
    title: 'תזונה',
    subtitle: 'חלבון: 85 / 120 גרם',
    status: '⏳',
    completed: false,
    to: '/dashboard',
    actionLabel: 'הוסף ארוחה',
  },
  {
    id: 'checkin',
    title: 'צ׳ק‑אין יומי',
    subtitle: 'דקה אחת',
    status: '⏳',
    completed: false,
    to: '/dailycheckin',
  },
] as const

export const streaks = {
  current: 6,
  last7Days: [true, true, false, true, true, true, true],
  workouts: 4,
  cardio: 3,
  checkIn: 6,
} as const

export const aiDailyInsightPreview = {
  user_message: 'ביומיים האחרונים חוסר חלבון מעכב את ההתאוששות שלך.',
  coach_message:
    'היום נסה להוסיף מנת חלבון אחת נוספת בארוחה הקרובה – זה ישפיע מהר על האנרגיה וההתאוששות.',
} as const

