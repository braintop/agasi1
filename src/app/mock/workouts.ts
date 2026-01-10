export type WorkoutTag = 'Upper' | 'Lower' | 'Full'

export interface Workout {
  id: string
  name: string
  durationMin: number
  tag: WorkoutTag
  description?: string
}

export interface WorkoutLog {
  id: string
  workoutId: string
  dateISO: string
  durationMin: number
  completed: boolean
  highlight: string
}

export interface Exercise {
  id: string
  name: string
  description: string
  videoUrl?: string
}

export interface WorkoutExerciseConfig {
  exerciseId: string
  sets: number
  targetReps: string
  restSec: number
}

export interface WorkoutDetails extends Workout {
  exercises: WorkoutExerciseConfig[]
}

export const workouts: Workout[] = [
  {
    id: 'w1',
    name: 'Upper Body Strength',
    durationMin: 45,
    tag: 'Upper',
    description: 'Push, pull, and accessory work focused on upper body strength.',
  },
  {
    id: 'w2',
    name: 'Lower Body Power',
    durationMin: 40,
    tag: 'Lower',
    description: 'Squats, hinges, and accessory work for powerful legs.',
  },
  {
    id: 'w3',
    name: 'Full Body Foundation',
    durationMin: 50,
    tag: 'Full',
    description: 'Balanced full body session to maintain strength and movement.',
  },
]

export const exercises: Exercise[] = [
  {
    id: 'e1',
    name: 'Barbell Bench Press',
    description: 'Primary horizontal press for building upper-body strength.',
    videoUrl: 'https://example.com/demo/bench-press',
  },
  {
    id: 'e2',
    name: 'One-Arm Row',
    description: 'Single-arm back exercise to build balanced pulling strength.',
    videoUrl: 'https://example.com/demo/row',
  },
  {
    id: 'e3',
    name: 'Goblet Squat',
    description: 'Squat variation focusing on control and depth.',
    videoUrl: 'https://example.com/demo/goblet-squat',
  },
  {
    id: 'e4',
    name: 'Romanian Deadlift',
    description: 'Hip hinge pattern to strengthen hamstrings and glutes.',
    videoUrl: 'https://example.com/demo/rdl',
  },
]

export const workoutDetails: Record<string, WorkoutDetails> = {
  w1: {
    ...workouts[0],
    exercises: [
      { exerciseId: 'e1', sets: 3, targetReps: '6–8', restSec: 120 },
      { exerciseId: 'e2', sets: 3, targetReps: '8–10', restSec: 90 },
    ],
  },
  w2: {
    ...workouts[1],
    exercises: [
      { exerciseId: 'e3', sets: 3, targetReps: '8–10', restSec: 120 },
      { exerciseId: 'e4', sets: 3, targetReps: '8–10', restSec: 120 },
    ],
  },
  w3: {
    ...workouts[2],
    exercises: [
      { exerciseId: 'e1', sets: 2, targetReps: '8–10', restSec: 90 },
      { exerciseId: 'e3', sets: 2, targetReps: '8–10', restSec: 90 },
    ],
  },
}

export const weeklySchedule: Record<
  'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun',
  string[]
> = {
  mon: ['w1'],
  tue: [],
  wed: ['w2'],
  thu: [],
  fri: ['w3'],
  sat: [],
  sun: [],
}

export const workoutLogs: WorkoutLog[] = [
  {
    id: 'l1',
    workoutId: 'w1',
    dateISO: '2026-01-08',
    durationMin: 44,
    completed: true,
    highlight: 'Bench press +2.5kg vs last week',
  },
  {
    id: 'l2',
    workoutId: 'w2',
    dateISO: '2026-01-06',
    durationMin: 39,
    completed: true,
    highlight: 'Front squat moved smoothly at working weight',
  },
]

