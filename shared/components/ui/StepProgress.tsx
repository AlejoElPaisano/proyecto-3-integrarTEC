 'use client'

import { usePasswordStore } from '@/features/generator/store'

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
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1.5rem',
        position: 'relative',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '20px',
          left: 'calc(50% - 160px)',
          right: 'calc(50% - 160px)',
          height: '2px',
          background: 'var(--color-border)',
          borderRadius: '1px',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '20px',
          left: 'calc(50% - 160px)',
          height: '2px',
          width: PROGRESS_WIDTH[activeStep] ?? '0%',
          maxWidth: '320px',
          background: 'linear-gradient(90deg, var(--color-pink), var(--color-accent))',
          borderRadius: '1px',
          transition: `width var(--duration-slow) var(--ease-out)`,
        }}
      />

      {STEPS.map((step) => {
        const isActive = activeStep === step.number
        const isDone   = activeStep > step.number

        return (
          <div
            key={step.number}
            id={`step${step.number}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel${step.number}`}
            tabIndex={isActive ? 0 : -1}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              position: 'relative',
              zIndex: 2,
              width: '100px',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontSize: '0.9rem',
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
                transition: `all var(--duration-normal) var(--ease-out)`,
                background: isActive
                  ? 'var(--gradient-cta)'
                  : isDone
                  ? 'var(--gradient-blue)'
                  : 'rgba(12,18,40,0.8)',
                border: isActive
                  ? '2px solid var(--color-pink)'
                  : isDone
                  ? '2px solid var(--color-accent)'
                  : '2px solid var(--color-border)',
                color: isActive || isDone ? '#fff' : 'var(--color-text-tertiary)',
                boxShadow: isActive
                  ? '0 0 20px var(--color-pink-glow)'
                  : 'none',
              }}
            >
              {step.number}
            </div>

            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                transition: `color var(--duration-fast) var(--ease-out)`,
                color: isActive
                  ? 'var(--color-pink)'
                  : isDone
                  ? 'var(--color-accent)'
                  : 'var(--color-text-tertiary)',
              }}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
