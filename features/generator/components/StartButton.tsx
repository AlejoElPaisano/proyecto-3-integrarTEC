'use client'

import { useRouter } from "next/navigation"
import { usePasswordStore } from "@/features/generator/store"

export function StartButton() {
  const router = useRouter()
  const setStep = usePasswordStore((state) => state.setStep)

  function handleStart() {
    setStep(2)
    router.push("/generator")
  }

  return (
    <button
      type="button"
      onClick={handleStart}
      aria-label="Comenzar a personalizar tu contraseña"
      className="btn-start"
    >
      Comenzar →
    </button>
  )
}
