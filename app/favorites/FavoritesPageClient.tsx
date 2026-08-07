'use client'

import { useState } from "react"
import Link from "next/link"
import { WizardLayout } from "@/shared/components/ui/WizardLayout"
import { useFavorites } from "@/features/favorites/hooks/useFavorites"
import { useHasMounted } from "@/shared/hooks/useHasMounted"

export function FavoritesPageClient() {
  const hasMounted = useHasMounted()
  const { favorites, removeFavorite, copyToClipboard } = useFavorites()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [unlockId, setUnlockId] = useState<string | null>(null)
  const [unlockPassphrase, setUnlockPassphrase] = useState("")
  const [copyError, setCopyError] = useState<string | null>(null)

  async function handleCopy(id: string) {
    setCopyError(null)
    const status = await copyToClipboard(
      id,
      unlockId === id ? unlockPassphrase : undefined,
    )

    if (status === "copied") {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
      setUnlockId(null)
      setUnlockPassphrase("")
      return
    }

    if (status === "locked") {
      setUnlockId(id)
      setUnlockPassphrase("")
      return
    }

    if (status === "invalid-passphrase") {
      setCopyError("La contraseña no pudo desbloquear esta favorita.")
      return
    }

    if (status === "clipboard-unavailable") {
      setCopyError("No se pudo acceder al portapapeles en este navegador.")
      return
    }

    setCopyError("No se encontró la favorita seleccionada.")
  }

  if (!hasMounted) return null

  return (
    <WizardLayout currentStep={2}>
      <div className="flex flex-col gap-4 text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-(--color-border) pb-3">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-2xl">⭐</span>
            <h1 className="text-xl font-extrabold text-(--color-text)">
              Frases Favoritas
            </h1>
          </div>
          <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-[#ec4899] bg-[rgba(236,72,153,0.15)]">
            {favorites.length} guardadas
          </span>
        </div>

        {/* Error global de clipboard */}
        {copyError && !unlockId && (
          <p
            role="alert"
            className="rounded-lg px-3 py-2 text-xs font-semibold"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "var(--color-error)",
            }}
          >
            {copyError}
          </p>
        )}

        {/* Lista de favoritos */}
        {favorites.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl p-8 text-center"
            style={{
              background: "var(--color-accent-soft)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div aria-hidden="true" className="mb-3 text-4xl">⭐</div>
            <h2 className="mb-1 text-base font-bold text-(--color-text)">
              Aún no tenés frases favoritas
            </h2>
            <p className="mb-5 text-xs text-(--color-text-secondary)">
              Guardá tus contraseñas importantes haciendo clic en la estrella ⭐ en el generador.
            </p>
            <Link
              href="/generator"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-sans text-sm font-bold text-white shadow-md transition-all duration-150 ease-out hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #ec4899, #818cf8)" }}
            >
              ✨ Ir al generador
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="flex flex-col gap-2 rounded-xl p-3.5 transition-all duration-150 ease-out"
                style={{
                  background: "var(--color-accent-soft)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Icono */}
                  <div
                    className="shrink-0 grid place-items-center rounded-lg text-base"
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    🔒
                  </div>

                  {/* Label + bits */}
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span
                      className="truncate font-mono text-sm font-bold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {fav.metadata.label ?? `Passphrase (${fav.metadata.bits} bits)`}
                    </span>
                    <span className="text-[0.7rem]" style={{ color: "var(--color-text-tertiary)" }}>
                      {fav.metadata.bits} bits de entropía
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => void handleCopy(fav.id)}
                      aria-label={copiedId === fav.id ? "Favorita copiada" : "Copiar o desbloquear favorita"}
                      aria-live="polite"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs transition-colors duration-150 ease-out"
                      style={{
                        background: copiedId === fav.id ? "rgba(34, 197, 94, 0.15)" : "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        color: copiedId === fav.id ? "var(--color-success)" : "var(--color-text)",
                      }}
                    >
                      {copiedId === fav.id ? "✅" : "📋"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFavorite(fav.id)}
                      aria-label="Eliminar favorita"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs transition-colors duration-150 ease-out hover:text-red-400"
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

                {/* Formulario de desbloqueo inline */}
                {unlockId === fav.id && (
                  <form
                    onSubmit={(e) => { e.preventDefault(); void handleCopy(fav.id) }}
                    className="flex flex-col gap-2 border-t border-(--color-border) pt-3 mt-1"
                  >
                    <label
                      htmlFor={`favorite-passphrase-${fav.id}`}
                      className="text-xs font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Ingresá la contraseña original para desbloquear y copiar
                    </label>
                    <input
                      id={`favorite-passphrase-${fav.id}`}
                      type="password"
                      value={unlockPassphrase}
                      onChange={(e) => setUnlockPassphrase(e.target.value)}
                      autoComplete="current-password"
                      autoFocus
                      required
                      className="w-full rounded-lg px-3 py-2 font-mono text-xs"
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                    {copyError && (
                      <p
                        role="alert"
                        className="text-xs font-semibold"
                        style={{ color: "var(--color-error)" }}
                      >
                        {copyError}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-150"
                        style={{
                          background: "var(--color-accent-soft)",
                          border: "1px solid var(--color-accent)",
                          color: "var(--color-accent)",
                        }}
                      >
                        Desbloquear y copiar
                      </button>
                      <button
                        type="button"
                        onClick={() => { setUnlockId(null); setUnlockPassphrase(""); setCopyError(null) }}
                        className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-150"
                        style={{
                          background: "transparent",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex justify-center">
          <Link
            href="/generator"
            className="text-xs font-semibold text-(--color-pink) hover:underline"
          >
            ← Volver al generador
          </Link>
        </div>
      </div>
    </WizardLayout>
  )
}
