import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../app/ui/card'
import { Input } from '../../app/ui/input'
import { Button } from '../../app/ui/button'
import { cn } from '../../app/utils/cn'
import { type BasicsInfo, emptyBasicsInfo } from '../../app/types/onboarding'
import { getJSON, setJSON } from '../../app/utils/storage'

const STORAGE_KEY = 'onboarding.basics'

export function BasicsPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<BasicsInfo>(() =>
    getJSON<BasicsInfo>(STORAGE_KEY, emptyBasicsInfo),
  )

  useEffect(() => {
    setJSON(STORAGE_KEY, form)
  }, [form])

  const isFullNameValid = useMemo(
    () => form.fullName.trim().length >= 2,
    [form.fullName],
  )

  const handleTextChange =
    (field: keyof BasicsInfo) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

  const handleNumberChange =
    (field: keyof BasicsInfo) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setForm((prev) => ({
        ...prev,
        [field]: value === '' ? undefined : Number(value),
      }))
    }

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setForm((prev) => ({
      ...prev,
      gender: gender,
    }))
  }

  const handleContinue = () => {
    if (!isFullNameValid) return
    navigate('/goals')
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">
            Basic Information
          </CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            Tell us about yourself
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary/90">
              Full Name <span className="text-danger">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Asaf Amir"
              value={form.fullName}
              onChange={handleTextChange('fullName')}
            />
            {!isFullNameValid && (
              <p className="text-xs text-danger/80">
                Please enter your full name.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary/90">
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="+1 234 567 8900"
              value={form.phone ?? ''}
              onChange={handleTextChange('phone')}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary/90">
                Age
              </label>
              <Input
                type="number"
                min={10}
                max={100}
                placeholder="30"
                value={form.age ?? ''}
                onChange={handleNumberChange('age')}
              />
              <p className="text-[11px] text-text-secondary/70">
                Optional, but helps us tailor your program.
              </p>
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-medium text-text-primary/90">
                Gender
              </span>
              <div className="flex gap-3">
                {[
                  { id: 'male', label: 'Male' },
                  { id: 'female', label: 'Female' },
                ].map((option) => {
                  const isSelected = form.gender === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        handleGenderSelect(option.id as 'male' | 'female')
                      }
                      className={cn(
                        'flex-1 rounded-xl border px-3 py-2 text-sm transition-colors',
                        'border-border bg-surface-2 text-text-secondary',
                        isSelected &&
                          'border-[#10B981] bg-surface text-text-primary',
                      )}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary/90">
                Height (cm)
              </label>
              <Input
                type="number"
                min={120}
                max={230}
                placeholder="175"
                value={form.heightCm ?? ''}
                onChange={handleNumberChange('heightCm')}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary/90">
                Weight (kg)
              </label>
              <Input
                type="number"
                min={35}
                max={250}
                placeholder="75"
                value={form.weightKg ?? ''}
                onChange={handleNumberChange('weightKg')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 -mx-4 mt-8 border-t border-border bg-bg/95 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full max-w-[160px]"
            onClick={() => navigate('/welcome')}
          >
            Back
          </Button>
          <Button
            size="lg"
            className="w-full max-w-[220px]"
            onClick={handleContinue}
            disabled={!isFullNameValid}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

