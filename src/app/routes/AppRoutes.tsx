import { Navigate, Route, Routes } from 'react-router-dom'
import { OnboardingLayout } from '../layout/OnboardingLayout'
import { UserLayout } from '../layout/UserLayout'
import { WelcomePage } from '../../pages/onboarding/WelcomePage'
import { BasicsPage } from '../../pages/onboarding/BasicsPage'
import { GoalsPage } from '../../pages/onboarding/GoalsPage'
import { FitnessPage } from '../../pages/onboarding/FitnessPage'
import { LifestylePage } from '../../pages/onboarding/LifestylePage.tsx'
import { CompletePage } from '../../pages/onboarding/CompletePage'
import { DashboardPage } from '../../pages/user/DashboardPage'
import { WorkoutsPage } from '../../pages/user/WorkoutsPage'
import { WorkoutSessionPage } from '../../pages/user/WorkoutSessionPage'
import { CardioPage } from '../../pages/user/CardioPage'
import { DailyCheckInPage } from '../../pages/user/DailyCheckInPage'
import { ProgressPage } from '../../pages/user/ProgressPage'
import { AIInsightsPage } from '../../pages/user/AIInsightsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<OnboardingLayout />}>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/basics" element={<BasicsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/fitness" element={<FitnessPage />} />
        <Route path="/lifestyle" element={<LifestylePage />} />
        <Route path="/complete" element={<CompletePage />} />
      </Route>

      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
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

