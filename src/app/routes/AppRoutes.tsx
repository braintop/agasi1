import { Navigate, Route, Routes } from 'react-router-dom'
import { OnboardingLayout } from '../layout/OnboardingLayout'
import { ProfileSetupLayout } from '../layout/ProfileSetupLayout'
import { UserLayout } from '../layout/UserLayout'
import { WelcomePage } from '../../pages/onboarding/WelcomePage'
import { BasicsPage } from '../../pages/onboarding/BasicsPage'
import { GoalsPage } from '../../pages/onboarding/GoalsPage'
import { FitnessPage } from '../../pages/onboarding/FitnessPage'
import { LifestylePage } from '../../pages/onboarding/LifestylePage.tsx'
import { NutritionPage } from '../../pages/onboarding/NutritionPage'
import { CompletePage } from '../../pages/onboarding/CompletePage'
import { ProfileFitnessPage } from '../../pages/onboarding/ProfileFitnessPage'
import { ProfileNutritionPage } from '../../pages/onboarding/ProfileNutritionPage'
import { DashboardPage } from '../../pages/user/DashboardPage'
import { NutritionPage as UserNutritionPage } from '../../pages/user/NutritionPage'
import { WorkoutsPage } from '../../pages/user/WorkoutsPage'
import { WorkoutSessionPage } from '../../pages/user/WorkoutSessionPage'
import { CardioPage } from '../../pages/user/CardioPage'
import { DailyCheckInPage } from '../../pages/user/DailyCheckInPage'
import { ProgressPage } from '../../pages/user/ProgressPage'
import { AIInsightsPage } from '../../pages/user/AIInsightsPage'
import { DailyControlCenterPage } from '../../pages/user/DailyControlCenterPage'
import { DailyHabitsPage } from '../../pages/user/DailyHabitsPage'
import { TrainingPage } from '../../pages/user/TrainingPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<OnboardingLayout />}>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/basics" element={<BasicsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/fitness" element={<FitnessPage />} />
        <Route path="/lifestyle" element={<LifestylePage />} />
        <Route path="/onboarding/nutrition" element={<NutritionPage />} />
        <Route path="/complete" element={<CompletePage />} />
      </Route>

      <Route element={<ProfileSetupLayout />}>
        <Route path="/profile/fitness" element={<ProfileFitnessPage />} />
        <Route path="/profile/nutrition" element={<ProfileNutritionPage />} />
      </Route>

      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dailycenter" element={<DailyControlCenterPage />} />
        <Route path="/habits" element={<DailyHabitsPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/nutrition" element={<UserNutritionPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/workouts/:id" element={<WorkoutSessionPage />} />
        <Route path="/cardio" element={<CardioPage />} />
        <Route path="/dailycheckin" element={<DailyCheckInPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/aiinsights" element={<AIInsightsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}

