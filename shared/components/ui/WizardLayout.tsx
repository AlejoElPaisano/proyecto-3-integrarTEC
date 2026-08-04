import type { ReactNode } from 'react'
import { StepProgress } from '@/shared/components/ui/StepProgress'

interface WizardLayoutProps {
  children: ReactNode
  currentStep?: number
  glow?: boolean
}

export function WizardLayout({ children, currentStep = 1, glow = true }: WizardLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.25rem 1.5rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <StepProgress currentStep={currentStep} />

        <div
          className="glass-card"
          style={{
            background: glow ? 'var(--glass-bg)' : 'var(--color-card)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: glow ? '1px solid var(--glass-border)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--glass-shadow)',
            padding: '1.75rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {glow && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background:
                  'radial-gradient(circle at 30% 20%, rgba(99,102,241,0.03) 0%, transparent 50%)',
                pointerEvents: 'none',
              }}
            />
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
