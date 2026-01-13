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

export type TrainingFrequency = 'no' | 'sometimes' | 'regular'
export type SessionsPerWeek = 1 | 2 | 3 | 4

export type StrengthPriority = 'strength' | 'hypertrophy' | 'endurance' | 'mixed'

export type CardioType =
  | 'walking'
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'rowing'
  | 'other'

export type CardioStyle = 'zone2' | 'hiit' | 'mixed' | 'unknown'
export type CardioHeartRateData = 'zone2' | 'unknown'

export type DailyStepsRange = 'lt5k' | '5-7.5k' | '7.5-10k' | '10k+'

export type PerceivedFitnessState = 'strong' | 'ok' | 'tired' | 'unfit'

export interface StrengthTrainingInfo {
  currently?: TrainingFrequency
  sessionsPerWeek?: SessionsPerWeek
  experience?: FitnessExperience
  priorities?: StrengthPriority[]
  limitations?: string
}

export interface CardioTrainingInfo {
  currently?: TrainingFrequency
  sessionsPerWeek?: SessionsPerWeek
  types?: CardioType[]
  styles?: CardioStyle[]
  avgDurationMin?: number
  avgDistanceKm?: number
  heartRateData?: CardioHeartRateData
}

export interface FitnessInfo {
  // Legacy (existing questionnaire) — kept for backward compatibility
  experience?: FitnessExperience
  location?: FitnessLocation
  daysPerWeek?: number
  focus?: FitnessFocus
  limitations?: string

  // New (added questionnaire)
  strength?: StrengthTrainingInfo
  cardio?: CardioTrainingInfo
  dailySteps?: DailyStepsRange
  perceivedState?: PerceivedFitnessState
}

export const emptyFitnessInfo: FitnessInfo = {
  strength: {},
  cardio: {},
}

export type LifestyleSleep = 'poor' | 'average' | 'good'
export type LifestyleSteps = '<3k' | '3-6k' | '6-10k' | '10k+'
export type LifestyleNutrition = 'not' | 'somewhat' | 'very'

export type LifestyleFrequency3 = 'no' | 'sometimes' | 'regular'
export type SaunaPerWeek = 1 | 2 | 3 | 'unknown'
export type ColdExposureType = 'iceBath' | 'coldShowers' | 'seaNature' | 'other'
export type DailyMovement = 'mostlySitting' | 'mixed' | 'mostlyMoving'
export type AlcoholFrequency = 'none' | '1-2' | '3+'
export type SmokingFrequency = 'no' | 'sometimes' | 'yes'
export type SupplementsFrequency = 'no' | 'basic' | 'regular'

export interface LifestyleInfo {
  sleep?: LifestyleSleep
  stress?: number
  steps?: LifestyleSteps
  nutrition?: LifestyleNutrition
  notes?: string

  sauna?: {
    currently?: LifestyleFrequency3
    timesPerWeek?: SaunaPerWeek
  }
  coldExposure?: {
    currently?: LifestyleFrequency3
    types?: ColdExposureType[]
  }
  dailyMovement?: DailyMovement
  alcohol?: AlcoholFrequency
  smoking?: SmokingFrequency
  supplements?: SupplementsFrequency
}

export const emptyLifestyleInfo: LifestyleInfo = {}


