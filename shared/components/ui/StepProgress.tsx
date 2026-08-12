'use client'

import { usePasswordStore } from '@/features/generator/store'
import { cn } from '@/shared/lib/cn'

interface StepProgressProps {
  currentStep?: number
}

const STEPS = [
  { number: 1, label: 'Inicio' },
  { number: 2, label: 'Personalizar' },
  { number: 3, label: 'Resultado' },
]

const PROGRESS_WIDTH: Record<number, string> = {
  1: '0%',
  2: '50%',
  3: '100%',
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const storeStep = usePasswordStore((state) => state.currentStep)
  const activeStep = currentStep ?? storeStep

  return (
    <div
      role="tablist"
      aria-label="Pasos del asistente"
      className="relative mb-6 flex items-center justify-center"
    >
      <div
        aria-hidden="true"
        className="absolute left-[calc(50%-160px)] right-[calc(50%-160px)] top-5 h-0.5 rounded-[1px] bg-(--color-border)"
      />

      <div
        aria-hidden="true"
        className="absolute left-[calc(50%-160px)] top-5 h-0.5 max-w-[320px] rounded-[1px] bg-[linear-gradient(90deg,var(--color-pink),var(--color-accent))] transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out)]"
        style={{ width: PROGRESS_WIDTH[activeStep] ?? '0%' }}
      />

      {STEPS.map((step) => {
        const isActive = activeStep === step.number
        const isDone = activeStep > step.number

        return (
          <div
            key={step.number}
            id={`step${step.number}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel${step.number}`}
            tabIndex={isActive ? 0 : -1}
            className="relative z-[2] flex w-[100px] flex-col items-center gap-2"
          >
            <div
              aria-hidden="true"
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full text-[0.9rem] font-bold backdrop-blur-md transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]",
                isActive
                  ? "border-2 border-(--color-pink) bg-(--gradient-cta) text-white [box-shadow:0_0_20px_var(--color-pink-glow)]"
                  : isDone
                    ? "border-2 border-(--color-accent) bg-(--gradient-blue) text-white"
                    : "border-2 border-(--color-border) bg-[rgba(12,18,40,0.8)] text-(--color-text-tertiary)",
              )}
            >
              {step.number}
            </div>

            <span
              className={cn(
                "text-[0.7rem] font-medium uppercase tracking-[0.06em] transition-[color] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                isActive
                  ? "text-(--color-pink)"
                  : isDone
                    ? "text-(--color-accent)"
                    : "text-(--color-text-tertiary)",
              )}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
