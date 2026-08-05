'use client'

import { useEffect, useState } from "react"
import { usePasswordStore } from "@/features/generator/store"
import type { PasswordConfig } from "@/features/generator/types"
import { CategoryChips } from "@/features/generator/components/CategoryChips"
import { Toggle } from "@/shared/components/ui/Toggle"
import { useHasMounted } from "@/shared/hooks/useHasMounted"

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
    <div className="rounded-[var(--radius-lg)] border border-(--color-border) bg-(--color-card) p-4 shadow-[var(--glass-shadow)] sm:p-5">
      <h2 className="mb-3 text-lg font-semibold text-(--color-text)">
        Personalizá tu contraseña
      </h2>

      <div className="mb-2 rounded-xl border border-(--color-border) p-3 sm:px-4">
        <label
          htmlFor="wordCount"
          className="mb-2 flex items-center justify-between text-sm font-medium text-(--color-text-secondary)"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="text-base">📝</span>
            Cantidad de palabras
          </span>
          <span className="font-bold text-(--color-accent)">{config.wordCount}</span>
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
          className="w-full cursor-pointer accent-(--color-accent)"
        />
        <div className="mt-2 flex justify-between text-xs text-(--color-text-tertiary)">
          <span>2</span>
          <span>4</span>
          <span>6</span>
        </div>
      </div>

      <div className="mb-2 rounded-xl border border-(--color-border) p-3 sm:px-4">
        <label
          htmlFor="separator"
          className="mb-2 flex items-center gap-2 text-sm font-medium text-(--color-text-secondary)"
        >
          <span aria-hidden="true" className="text-base">🔗</span>
          Separador
        </label>
        <select
          id="separator"
          value={config.separator}
          onChange={(event) => {
            updateOption("separator", event.target.value)
            onSettingChange?.("separator")
          }}
          className="w-full cursor-pointer rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-2.5 font-sans text-sm text-(--color-text) transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-(--ease-out) focus:border-(--color-border-focus) focus:shadow-[0_0_0_1px_var(--color-border-focus)] focus:outline-none"
        >
          <option value="-">Guión ( - )</option>
          <option value=".">Punto ( . )</option>
          <option value="_">Guión bajo ( _ )</option>
          <option value=" ">Espacio</option>
        </select>
      </div>

      <div className="mb-2 rounded-xl border border-(--color-border) p-3 sm:px-4">
        <button
          type="button"
          onClick={() => setShowAdvanced((current) => !current)}
          aria-expanded={showAdvanced}
          className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-sm font-semibold text-(--color-accent) transition-colors duration-[var(--duration-fast)] hover:text-(--color-accent-hover)"
        >
          <span aria-hidden="true" className="text-base">⚙️</span>
          {showAdvanced ? "Ocultar opciones avanzadas ↑" : "Ver opciones avanzadas ↓"}
        </button>

        {showAdvanced && (
          <div className="mt-4 flex flex-col gap-3">
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

      <div className="mb-3 rounded-xl border border-(--color-border) p-3 sm:px-4">
        <p className="mb-2 text-xs font-medium text-(--color-text-secondary)">
          Elegí las categorías que quieras incluir:
        </p>
        <CategoryChips />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border-0 bg-[image:var(--gradient-cta)] px-8 py-4 text-lg font-bold text-white transition-[transform,box-shadow] duration-150 ease-(--ease-out) hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(236,72,153,0.35)]"
        aria-label="Generar contraseña con las opciones seleccionadas"
      >
        ✨ Generar frase mágica
      </button>
    </div>
  )
}
