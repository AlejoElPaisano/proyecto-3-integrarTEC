'use client'

import { useEffect } from "react"
import { usePasswordStore } from "@/features/generator/store"
import { useHasMounted } from "@/shared/hooks/useHasMounted"

export function BatchStateController() {
  const hasMounted = useHasMounted()
  const setStep = usePasswordStore((state) => state.setStep)
  const generateBatch = usePasswordStore((state) => state.generateBatch)

  useEffect(() => {
    if (!hasMounted) return

    setStep(3)
    generateBatch()
  }, [generateBatch, hasMounted, setStep])

  return null
}
