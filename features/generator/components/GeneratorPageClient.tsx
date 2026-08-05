'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { usePasswordStore } from "@/features/generator/store"
import GeneratorPanel from "@/features/generator/components/GeneratorPanel"
import { ClippyAssistant } from "@/features/clippy/components/ClippyAssistant"

export function GeneratorPageClient() {
  const router = useRouter()
  const setStep = usePasswordStore((state) => state.setStep)
  const [activeTip, setActiveTip] = useState<string | null>(null)

  useEffect(() => {
    setStep(2)
  }, [setStep])

  function handleBack() {
    setStep(1)
    router.push("/")
  }

  return (
    <>
      <button
        type="button"
        onClick={handleBack}
        aria-label="Volver al inicio"
        className="mb-5 inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[0.8rem] font-sans text-(--color-text-secondary) transition-colors duration-[var(--duration-fast)] hover:text-(--color-text)"
      >
        ← Volver
      </button>

      <GeneratorPanel onActiveTip={setActiveTip} />
      <ClippyAssistant activeTip={activeTip} floating />
    </>
  )
}
