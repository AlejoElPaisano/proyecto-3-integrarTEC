'use client'

import { useState } from "react"
import Link from "next/link"
import { WizardLayout } from "@/shared/components/ui/WizardLayout"
import { usePasswordStore } from "@/features/generator/store"
import { useHasMounted } from "@/shared/hooks/useHasMounted"

export function HistoryPageClient() {
  const hasMounted = useHasMounted()
  const sessionHistory = usePasswordStore((state) => state.sessionHistory)
  const clearHistory = usePasswordStore((state) => state.clearHistory)
  const removeFromHistory = usePasswordStore((state) => state.removeFromHistory)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copyErrorId, setCopyErrorId] = useState<string | null>(null)

  const handleCopy = async (id: string, text: string) => {
    setCopyErrorId(null)
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable")
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setCopyErrorId(null)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setCopyErrorId(id)
    }
  }

  if (!hasMounted) return null

  return (
    <WizardLayout currentStep={2}>
      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-2xl">📜</span>
            <h1 className="text-xl font-extrabold text-text">
              Historial de frases
            </h1>
          </div>
          {sessionHistory.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="cursor-pointer rounded-lg px-3 py-1.5 font-sans text-xs font-semibold transition-colors duration-150 ease-out"
              style={{
                color: "var(--color-error)",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              Vaciar historial
            </button>
          )}
        </div>

        {sessionHistory.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl p-8 text-center"
            style={{
              background: "var(--color-accent-soft)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div aria-hidden="true" className="mb-3 text-4xl">
              🔍
            </div>
            <h2 className="mb-1 text-base font-bold text-text">
              No hay frases en el historial
            </h2>
            <p className="mb-5 text-xs text-text-secondary">
              Las contraseñas que generes en esta sesión aparecerán guardadas aquí.
            </p>
            <Link
              href="/generator"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-sans text-sm font-bold text-white shadow-md transition-all duration-150 ease-out hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #ec4899, #818cf8)",
              }}
            >
              ✨ Generar contraseña
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {sessionHistory.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-xl p-3.5 transition-all duration-150 ease-out"
                style={{
                  background: "var(--color-accent-soft)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className="shrink-0 rounded-md px-2 py-0.5 font-sans text-[0.7rem] font-extrabold"
                      style={{
                        background: "rgba(236, 72, 153, 0.15)",
                        color: "var(--color-pink)",
                      }}
                    >
                      #{sessionHistory.length - index}
                    </span>
                    <span
                      className="truncate font-mono text-sm font-bold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.password ?? "••••••••••••"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.password && (
                      <button
                        type="button"
                        onClick={() => void handleCopy(item.id, item.password!)}
                        aria-label={copiedId === item.id ? "Contraseña copiada" : "Copiar contraseña"}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg font-sans text-xs transition-colors duration-150 ease-out"
                        style={{
                          background: copiedId === item.id ? "rgba(34, 197, 94, 0.15)" : "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          color: copiedId === item.id ? "var(--color-success)" : "var(--color-text)",
                        }}
                      >
                        {copiedId === item.id ? "✅" : "📋"}
                      </button>
                    )}
                    {copyErrorId === item.id && (
                      <p
                        role="alert"
                        className="text-[0.65rem] font-semibold"
                        style={{ color: "var(--color-error)" }}
                      >
                        No se pudo copiar
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFromHistory(item.id)}
                      aria-label="Eliminar del historial"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg font-sans text-xs transition-colors duration-150 ease-out"
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[0.75rem]" style={{ color: "var(--color-text-tertiary)" }}>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span>{item.bits} bits de entropía</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Link
            href="/generator"
            className="text-xs font-semibold text-pink hover:underline"
          >
            ← Volver al generador
          </Link>
        </div>
      </div>
    </WizardLayout>
  )
}
