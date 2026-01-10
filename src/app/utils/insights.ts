import { getLastNDays, isWithinRange, parseISODate } from './metrics'

export interface WorkoutLogLike {
  dateISO: string
}

export interface CardioLogLike {
  dateISO: string
  durationMin: number
}

export interface CheckinLogLike {
  dateISO: string
  sleepQuality: number
}

export interface AiInsight {
  id: string
  weekStartISO: string
  title: string
  summary: string
  bullets: string[]
  focus: string
  createdAtISO: string
}

export function getWeekStartISO(date: Date): string {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sun
  const diff = (day + 6) % 7 // how many days since Monday
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function buildInsightFromLogs({
  workouts,
  cardio,
  checkins,
  rangeDays = 7,
}: {
  workouts: WorkoutLogLike[]
  cardio: CardioLogLike[]
  checkins: CheckinLogLike[]
  rangeDays?: number
}): Omit<AiInsight, 'id' | 'weekStartISO' | 'createdAtISO'> {
  const days = getLastNDays(rangeDays)
  const start = days[0]
  const end = days[days.length - 1]

  const workoutsInRange = workouts.filter((w) =>
    isWithinRange(parseISODate(w.dateISO), start, end),
  )
  const cardioInRange = cardio.filter((c) =>
    isWithinRange(parseISODate(c.dateISO), start, end),
  )
  const checkinsInRange = checkins.filter((c) =>
    isWithinRange(parseISODate(c.dateISO), start, end),
  )

  const workoutsCompleted = workoutsInRange.length
  const cardioMinutes = cardioInRange.reduce(
    (sum, l) => sum + l.durationMin,
    0,
  )
  const avgSleep =
    checkinsInRange.length === 0
      ? 0
      : checkinsInRange.reduce((sum, c) => sum + c.sleepQuality, 0) /
        checkinsInRange.length

  const bullets: string[] = []

  if (workoutsCompleted >= 4) {
    bullets.push(
      'You hit your strength workout target this week – great foundation for progress.',
    )
  } else if (workoutsCompleted > 0) {
    bullets.push(
      `You completed ${workoutsCompleted} strength workouts. Adding 1 more would fully meet the weekly target of 4.`,
    )
  } else {
    bullets.push(
      'No strength workouts were logged. Even 1–2 short sessions would move the needle.',
    )
  }

  if (cardioMinutes >= 90) {
    bullets.push(
      'Cardio volume is solid – your aerobic base work is on track for longevity and recovery.',
    )
  } else if (cardioMinutes > 0) {
    bullets.push(
      `You logged ${cardioMinutes} minutes of cardio. Pushing towards ~90 minutes would unlock more endurance benefits.`,
    )
  } else {
    bullets.push(
      'No cardio sessions logged. A single 30-minute Zone 2 walk or ride would be a great start.',
    )
  }

  if (avgSleep > 0 && avgSleep < 5) {
    bullets.push(
      'Sleep quality looks lower than ideal – focus on wind-down, light exposure, and consistent bedtimes.',
    )
  } else if (avgSleep >= 5) {
    bullets.push(
      'Sleep quality has been reasonable – keep protecting your nighttime routine.',
    )
  }

  const title =
    workoutsCompleted >= 4 && cardioMinutes >= 90
      ? 'Solid momentum this week'
      : 'Room to tighten the basics'

  const summary =
    workoutsCompleted >= 4 && cardioMinutes >= 90
      ? 'You showed strong consistency across strength and cardio. Keep the current structure and gently increase challenge where it feels good.'
      : 'Your recent training and recovery show progress, but a few small tweaks around sessions and sleep will unlock more gains.'

  const focus =
    cardioMinutes < 90
      ? 'Primary focus: add one more Zone 2 cardio session and stabilize bedtime.'
      : avgSleep < 5
        ? 'Primary focus: recovery. Protect 7–8 hours of quality sleep on at least 4 nights this week.'
        : 'Primary focus: maintain your current habits while gradually increasing intensity in 1–2 key sessions.'

  return { title, summary, bullets: bullets.slice(0, 3), focus }
}

