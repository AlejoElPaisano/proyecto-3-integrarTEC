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
      className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-(--gradient-cta) px-8 py-4 font-sans text-[1.125rem] font-bold text-white transition-all duration-[150ms] ease-[cubic-bezier(0.16,1,0.3,1)] [box-shadow:0_4px_20px_rgba(236,72,153,0.25)] hover:-translate-y-0.5 hover:[box-shadow:0_8px_32px_rgba(236,72,153,0.35)]"
    >
      Comenzar →
    </button>
  )
}
