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
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", textAlign: "left" }}>
      <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
        <div
          aria-hidden="true"
          style={{
            fontSize: "2.5rem",
            display: "inline-block",
            marginBottom: "0.4rem",
            filter: "drop-shadow(0 0 20px rgba(99,102,241,0.3))",
          }}
        >
          🎨
        </div>

        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #e2e2f0, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.3rem",
          }}
        >
          Personalizá tu contraseña
        </h1>

        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "0.95rem",
          }}
        >
          Ajustá la longitud, separadores y categorías a tu medida.
        </p>
      </div>

      <div
        style={{
          background: "var(--color-accent-soft)",
          border: "1px solid var(--color-border)",
          borderRadius: "14px",
          padding: "0.85rem 1rem",
        }}
      >
        <label
          htmlFor="wordCount"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--color-text)",
            marginBottom: "0.6rem",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>📝</span>
            Cantidad de palabras
          </span>
          <span
            style={{
              fontWeight: 800,
              fontSize: "0.95rem",
              color: "#ec4899",
              background: "rgba(236, 72, 153, 0.15)",
              padding: "0.15rem 0.6rem",
              borderRadius: "8px",
            }}
          >
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
          style={{
            width: "100%",
            cursor: "pointer",
            accentColor: "var(--color-pink)",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--color-text-tertiary)", fontWeight: 600 }}>
          <span>2 palabras</span>
          <span>4 palabras</span>
          <span>6 palabras</span>
        </div>
      </div>

      <div
        style={{
          background: "var(--color-accent-soft)",
          border: "1px solid var(--color-border)",
          borderRadius: "14px",
          padding: "0.85rem 1rem",
        }}
      >
        <label
          htmlFor="separator"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--color-text)",
            marginBottom: "0.5rem",
          }}
        >
          <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>🔗</span>
          Separador de palabras
        </label>
        <select
          id="separator"
          value={config.separator}
          onChange={(event) => {
            updateOption("separator", event.target.value)
            onSettingChange?.("separator")
          }}
          style={{
            width: "100%",
            cursor: "pointer",
            borderRadius: "10px",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            padding: "0.6rem 0.85rem",
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            color: "var(--color-text)",
            outline: "none",
          }}
        >
          <option value="-">Guión ( - )</option>
          <option value=".">Punto ( . )</option>
          <option value="_">Guión bajo ( _ )</option>
          <option value=" ">Espacio</option>
        </select>
      </div>

      <div
        style={{
          background: "var(--color-accent-soft)",
          border: "1px solid var(--color-border)",
          borderRadius: "14px",
          padding: "0.85rem 1rem",
        }}
      >
        <button
          type="button"
          onClick={() => setShowAdvanced((current) => !current)}
          aria-expanded={showAdvanced}
          style={{
            all: "unset",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--color-text)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>⚙️</span>
            Opciones avanzadas
          </span>
          <span style={{ fontSize: "0.85rem", color: "var(--color-pink)", fontWeight: 700 }}>
            {showAdvanced ? "Ocultar ↑" : "Mostrar ↓"}
          </span>
        </button>

        {showAdvanced && (
          <div style={{ marginTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
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

      <div
        style={{
          background: "var(--color-accent-soft)",
          border: "1px solid var(--color-border)",
          borderRadius: "14px",
          padding: "0.85rem 1rem",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--color-text)",
            marginBottom: "0.65rem",
          }}
        >
          <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>🏷️</span>
          Categorías de palabras
        </label>
        <CategoryChips />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        style={{
          all: "unset",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "0.5rem",
          padding: "1rem 2rem",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #ec4899, #818cf8)",
          color: "#fff",
          fontSize: "1.125rem",
          fontWeight: 700,
          fontFamily: "var(--font-sans)",
          transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 4px 20px rgba(236,72,153,0.25)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)"
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(236,72,153,0.35)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(236,72,153,0.25)"
        }}
        aria-label="Generar contraseña con las opciones seleccionadas"
      >
        ✨ Generar frase mágica
      </button>
    </div>
  )
}

