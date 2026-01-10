export function parseISODate(value: string): Date {
  return new Date(value)
}

export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end
}

export function getLastNDays(n: number): Date[] {
  const days: Date[] = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d)
  }
  return days
}

export interface CheckinLike {
  dateISO: string
}

export function computeStreak(checkins: CheckinLike[]): number {
  if (checkins.length === 0) return 0

  const byDay = new Set(
    checkins.map((c) =>
      parseISODate(c.dateISO).toISOString().slice(0, 10),
    ),
  )

  let streak = 0
  const today = new Date()

  // walk backwards from today
  // allow “yesterday only” start
  for (let i = 0; i < 365; i += 1) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (byDay.has(key)) {
      streak += 1
    } else if (i === 0) {
      // if no check-in today, streak is 0
      break
    } else {
      break
    }
  }

  return streak
}

export interface CardioLogLike {
  dateISO: string
  durationMin: number
  distanceKm?: number
}

export function aggregateCardioMinutes(
  logs: CardioLogLike[],
  start: Date,
  end: Date,
): number {
  return logs
    .filter((l) => isWithinRange(parseISODate(l.dateISO), start, end))
    .reduce((sum, l) => sum + l.durationMin, 0)
}

