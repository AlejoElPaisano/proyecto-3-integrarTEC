'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePasswordStore } from '@/features/generator/store'
import { WizardLayout } from '@/shared/components/ui/WizardLayout'
import GeneratorPanel from '@/features/generator/components/GeneratorPanel'
import { ClippyAssistant } from '@/features/clippy/components/ClippyAssistant'

export default function GeneratorPage() {
  const router = useRouter()
  const currentStep = usePasswordStore((state) => state.currentStep)
  const setStep = usePasswordStore((state) => state.setStep)
  const [activeTip, setActiveTip] = useState<string | null>(null)

  useEffect(() => {
    setStep(2)
  }, [setStep])

  function handleBack() {
    setStep(1)
    router.push('/')
  }

  return (
    <>
      <WizardLayout currentStep={currentStep}>
        {/* Botón volver */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="Volver al inicio"
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '1.25rem',
            fontFamily: 'var(--font-sans)',
            transition: `color var(--duration-fast) var(--ease-out)`,
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
        >
          ← Volver
        </button>

        <GeneratorPanel onActiveTip={setActiveTip} />
      </WizardLayout>
      <ClippyAssistant activeTip={activeTip} floating />
    </>
  )
}
