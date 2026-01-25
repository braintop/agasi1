import { CardTitle, CardDescription } from '../../app/ui/card'

export function WelcomePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--primary-dark)] text-3xl font-semibold text-bg shadow-card">
          Y
        </div>
      </div>
      <CardTitle className="mb-3 text-2xl sm:text-3xl font-semibold">
        ברוכים הבאים ל‑Younger
      </CardTitle>
      <CardDescription className="max-w-xl text-[15px] text-text-secondary">
        המסע האישי שלך לחוזק, חיוניות ואריכות ימים מתחיל כאן.
      </CardDescription>
      <p className="mt-2 max-w-xl text-xs sm:text-sm text-text-secondary/80">
        בוא נכיר אותך קצת יותר טוב כדי שנוכל לבנות עבורך תוכנית מושלמת.
      </p>
    </div>
  )
}
