export type BasicsGender = 'male' | 'female'

export interface BasicsInfo {
  fullName: string
  phone?: string
  age?: number
  gender?: BasicsGender
  heightCm?: number
  weightKg?: number
}

export const emptyBasicsInfo: BasicsInfo = {
  fullName: '',
}

export interface GoalsInfo {
  goals: string[]
}

export const emptyGoalsInfo: GoalsInfo = {
  goals: [],
}

export type FitnessExperience = 'beginner' | 'intermediate' | 'advanced'
export type FitnessLocation = 'gym' | 'home' | 'both'
export type FitnessFocus = 'strength' | 'hypertrophy' | 'endurance' | 'mixed'

export interface FitnessInfo {
  experience?: FitnessExperience
  location?: FitnessLocation
  daysPerWeek?: number
  focus?: FitnessFocus
  limitations?: string
}

export const emptyFitnessInfo: FitnessInfo = {}

export type LifestyleSleep = 'poor' | 'average' | 'good'
export type LifestyleSteps = '<3k' | '3-6k' | '6-10k' | '10k+'
export type LifestyleNutrition = 'not' | 'somewhat' | 'very'

export interface LifestyleInfo {
  sleep?: LifestyleSleep
  stress?: number
  steps?: LifestyleSteps
  nutrition?: LifestyleNutrition
  notes?: string
}

export const emptyLifestyleInfo: LifestyleInfo = {}


