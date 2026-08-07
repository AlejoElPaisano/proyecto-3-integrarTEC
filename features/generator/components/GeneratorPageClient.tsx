'use client'

import { useEffect, useState } from "react"
import { usePasswordStore } from "@/features/generator/store"
import GeneratorPanel from "@/features/generator/components/GeneratorPanel"
import { ClippyAssistant } from "@/features/clippy/components/ClippyAssistant"

export function GeneratorPageClient() {
  const setStep = usePasswordStore((state) => state.setStep)
  const [activeTip, setActiveTip] = useState<string | null>(null)

  useEffect(() => {
    setStep(2)
  }, [setStep])

  return (
    <>
      <GeneratorPanel onActiveTip={setActiveTip} />
      <ClippyAssistant activeTip={activeTip} floating />
    </>
  )
}
