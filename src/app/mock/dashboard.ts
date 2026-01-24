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
    kind: 'strength',
    title: 'אימון כוח',
    subtitle: 'פלג גוף עליון • 45 דק׳',
    uiStatus: 'fail',
    completed: false,
    to: '/workouts',
  },
  {
    id: 'cardio',
    kind: 'cardio',
    title: 'קרדיו',
    subtitle: 'Zone 2 • 30 דק׳',
    uiStatus: 'ok',
    completed: false,
    to: '/cardio',
  },
  {
    id: 'nutrition',
    kind: 'nutrition',
    title: 'תזונה',
    subtitle: 'חלבון: 85 / 120 גרם',
    uiStatus: 'ok',
    completed: false,
    to: '/nutrition',
    actionLabel: 'הוסף ארוחה',
  },
  {
    id: 'checkin',
    kind: 'checkin',
    title: 'צ׳ק‑אין יומי',
    subtitle: 'דקה אחת',
    uiStatus: 'ok',
    completed: true,
    to: '/dailycheckin',
  },
] as const

export const streaks = {
  current: 6,
  last7Days: [true, true, true, true, true, false, true],
  workouts: 4,
  cardio: 3,
  checkIn: 6,
} as const

export const aiDailyInsightPreview = {
  user_message: 'ביומיים האחרונים חוסר חלבון מעכב את ההתאוששות שלך.',
  coach_message:
    'היום נסה להוסיף מנת חלבון אחת נוספת בארוחה הקרובה – זה ישפיע מהר על האנרגיה וההתאוששות.',
} as const

