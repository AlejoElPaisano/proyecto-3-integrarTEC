'use client'

import { useEffect, useState } from "react"
import { usePasswordStore } from "@/features/generator/store"
import type { PasswordConfig } from "@/features/generator/types"
import { CategoryChips } from "@/features/generator/components/CategoryChips"
import { Toggle } from "@/shared/components/ui/Toggle"
import { useHasMounted } from "@/shared/hooks/useHasMounted"

const cardClass =
  "rounded-[14px] border border-(--color-border) bg-(--color-accent-soft) p-[0.85rem_1rem]"

const labelRowClass =
  "mb-[0.5rem] flex items-center gap-2 text-[0.9rem] font-semibold text-(--color-text)"

const emojiClass = "text-[1.1rem]"

export function GeneratorForm({ onSettingChange }: { onSettingChange?: (key: string) => void }) {
  const hasMounted = useHasMounted()
  const config = usePasswordStore((state) => state.config)
  const generate = usePasswordStore((state) => state.generate)
  const setStep = usePasswordStore((state) => state.setStep)
  const setConfig = usePasswordStore((state) => state.setConfig)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowAdvanced(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const updateOption = <K extends keyof PasswordConfig>(
    key: K,
    value: PasswordConfig[K],
  ) => {
    setConfig({ [key]: value })
  }

  const handleGenerate = () => {
    generate()
    setStep(3)
  }

  if (!hasMounted) return null

  return (
    <div className="flex flex-col gap-[0.85rem] text-left">
      <div className="mb-2 text-center">
        <div
          aria-hidden="true"
          className="mb-[0.4rem] inline-block text-[2.5rem] [filter:drop-shadow(0_0_20px_rgba(99,102,241,0.3))]"
        >
          🎨
        </div>

        <h1 className="mb-[0.3rem] bg-clip-text text-[1.8rem] font-extrabold tracking-[-0.03em] text-transparent [background-image:linear-gradient(135deg,#e2e2f0,#a78bfa)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
          Personalizá tu contraseña
        </h1>

        <p className="text-[0.95rem] text-(--color-text-secondary)">
          Ajustá la longitud, separadores y categorías a tu medida.
        </p>
      </div>

      <div className={cardClass}>
        <label
          htmlFor="wordCount"
          className="mb-[0.6rem] flex items-center justify-between text-[0.9rem] font-semibold text-(--color-text)"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className={emojiClass}>📝</span>
            Cantidad de palabras
          </span>
          <span className="rounded-lg bg-[rgba(236,72,153,0.15)] px-[0.6rem] py-[0.15rem] text-[0.95rem] font-extrabold text-[#ec4899]">
            {config.wordCount}
          </span>
        </label>
        <input
          id="wordCount"
          type="range"
          min={2}
          max={6}
          step={1}
          value={config.wordCount}
          onChange={(event) => {
            updateOption("wordCount", Number(event.target.value))
            onSettingChange?.("wordCount")
          }}
          className="w-full cursor-pointer [accent-color:var(--color-pink)]"
        />
        <div className="mt-[0.4rem] flex justify-between text-[0.75rem] font-semibold text-(--color-text-tertiary)">
          <span>2 palabras</span>
          <span>4 palabras</span>
          <span>6 palabras</span>
        </div>
      </div>

      <div className={cardClass}>
        <label htmlFor="separator" className={labelRowClass}>
          <span aria-hidden="true" className={emojiClass}>🔗</span>
          Separador de palabras
        </label>
        <select
          id="separator"
          value={config.separator}
          onChange={(event) => {
            updateOption("separator", event.target.value)
            onSettingChange?.("separator")
          }}
          className="w-full cursor-pointer rounded-[10px] border border-(--color-border) bg-(--color-surface) px-[0.85rem] py-[0.6rem] font-sans text-[0.875rem] text-(--color-text) outline-none"
        >
          <option value="-">Guión ( - )</option>
          <option value=".">Punto ( . )</option>
          <option value="_">Guión bajo ( _ )</option>
          <option value=" ">Espacio</option>
        </select>
      </div>

      <div className={cardClass}>
        <button
          type="button"
          onClick={() => setShowAdvanced((current) => !current)}
          aria-expanded={showAdvanced}
          className="flex w-full cursor-pointer items-center justify-between text-[0.9rem] font-semibold text-(--color-text)"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className={emojiClass}>⚙️</span>
            Opciones avanzadas
          </span>
          <span className="text-[0.85rem] font-bold text-(--color-pink)">
            {showAdvanced ? "Ocultar ↑" : "Mostrar ↓"}
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-[0.85rem] flex flex-col gap-[0.6rem]">
            <Toggle
              id="includeNumbers"
              label="Incluir números"
              description="Agrega un número al final (ej: 42)"
              checked={config.includeNumbers}
              onChange={(value) => {
                updateOption("includeNumbers", value)
                onSettingChange?.(value ? "includeNumbers" : "noNumbers")
              }}
            />
            <Toggle
              id="includeSymbols"
              label="Incluir símbolos"
              description="Agrega un símbolo especial (ej: !)"
              checked={config.includeSymbols}
              onChange={(value) => {
                updateOption("includeSymbols", value)
                onSettingChange?.(value ? "includeSymbols" : "noSymbols")
              }}
            />
            <Toggle
              id="capitalize"
              label="Capitalizar"
              description="Primera letra en mayúscula"
              checked={config.capitalize}
              onChange={(value) => {
                updateOption("capitalize", value)
                onSettingChange?.(value ? "capitalize" : "noCapitalize")
              }}
            />
          </div>
        )}
      </div>

      <div className={cardClass}>
        <label className="mb-[0.65rem] flex items-center gap-2 text-[0.9rem] font-semibold text-(--color-text)">
          <span aria-hidden="true" className={emojiClass}>🏷️</span>
          Categorías de palabras
        </label>
        <CategoryChips />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-(--gradient-cta) px-8 py-4 font-sans text-[1.125rem] font-bold text-white transition-all duration-[150ms] ease-[cubic-bezier(0.16,1,0.3,1)] [box-shadow:0_4px_20px_rgba(236,72,153,0.25)] hover:-translate-y-0.5 hover:[box-shadow:0_8px_32px_rgba(236,72,153,0.35)]"
        aria-label="Generar contraseña con las opciones seleccionadas"
      >
        ✨ Generar frase mágica
      </button>
    </div>
  )
}
