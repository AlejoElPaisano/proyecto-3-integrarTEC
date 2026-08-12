import type { ReactNode } from 'react'
import { StepProgress } from '@/shared/components/ui/StepProgress'
import { cn } from '@/shared/lib/cn'

interface WizardLayoutProps {
  children: ReactNode
  currentStep?: number
  glow?: boolean
}

export function WizardLayout({ children, currentStep, glow = true }: WizardLayoutProps) {
  return (
    <div className="relative z-[1] flex min-h-screen flex-col items-center p-[1.25rem_1.5rem]">
      <div className="w-full max-w-[520px]">
        <StepProgress currentStep={currentStep} />

        <div
          className={cn(
            "glass-card relative overflow-hidden rounded-(--radius-xl) p-7 backdrop-blur-2xl [box-shadow:var(--glass-shadow)]",
            glow
              ? "border border-(--glass-border) bg-(--glass-bg)"
              : "border border-(--color-border) bg-(--color-card)",
          )}
        >
          {glow && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-1/2 -top-1/2 h-[200%] w-[200%] [background:radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.03)_0%,transparent_50%)]"
            />
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
