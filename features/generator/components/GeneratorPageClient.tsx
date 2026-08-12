'use client'

import { useCallback, useEffect, useState } from "react"
import { usePasswordStore } from "@/features/generator/store"
import { useKeyboardShortcuts } from "@/shared/hooks/useKeyboardShortcuts"
import GeneratorPanel from "@/features/generator/components/GeneratorPanel"
import { ClippyAssistant } from "@/features/clippy/components/ClippyAssistant"

export function GeneratorPageClient() {
  const setStep = usePasswordStore((state) => state.setStep)
  const generate = usePasswordStore((state) => state.generate)
  const currentResult = usePasswordStore((state) => state.currentResult)
  const toggleHistory = usePasswordStore((state) => state.toggleHistory)
  const [activeTip, setActiveTip] = useState<string | null>(null)
  const [copyStatus, setCopyStatus] = useState<"copied" | "error" | null>(null)

  useEffect(() => {
    setStep(2)
  }, [setStep])

  const handleGenerate = useCallback(() => {
    generate()
    setStep(3)
  }, [generate, setStep])

  const handleCopy = useCallback(async () => {
    const password = currentResult?.password
    if (!password) return
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable")
      await navigator.clipboard.writeText(password)
      setCopyStatus("copied")
    } catch {
      setCopyStatus("error")
    }
    setTimeout(() => setCopyStatus(null), 2000)
  }, [currentResult])

  const handleToggleHistory = useCallback(() => {
    toggleHistory()
  }, [toggleHistory])

  useKeyboardShortcuts({
    onGenerate: handleGenerate,
    onCopy: handleCopy,
    onToggleHistory: handleToggleHistory,
  })

  return (
    <>
      <GeneratorPanel onActiveTip={setActiveTip} />
      <ClippyAssistant activeTip={activeTip} floating />
      {copyStatus && (
        <span role="status" aria-live="polite" className="sr-only">
          {copyStatus === "copied"
            ? "Passphrase copiada al portapapeles"
            : "No se pudo copiar la passphrase al portapapeles"}
        </span>
      )}
    </>
  )
}