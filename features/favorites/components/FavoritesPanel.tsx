'use client'

import { useState } from "react"
import type { FavoriteEntry } from "@/features/favorites/types"
import { useHasMounted } from "@/shared/hooks/useHasMounted"
import { useFavorites } from "@/features/favorites/hooks/useFavorites"

interface FavoritesPanelProps {
  favorites?: FavoriteEntry[]
  onRemove?: (id: string) => void
  compact?: boolean
}

export function FavoritesPanel({
  favorites: propsFavorites,
  onRemove: propsOnRemove,
  compact,
}: FavoritesPanelProps) {
  const hasMounted = useHasMounted()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [unlockId, setUnlockId] = useState<string | null>(null)
  const [unlockPassphrase, setUnlockPassphrase] = useState("")
  const [copyError, setCopyError] = useState<string | null>(null)
  const storeFavorites = useFavorites()

  const favorites = propsFavorites ?? storeFavorites.favorites
  const onRemove = propsOnRemove ?? storeFavorites.removeFavorite

  async function handleCopy(id: string) {
    setCopyError(null)
    const status = await storeFavorites.copyToClipboard(
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

  if (!hasMounted || favorites.length === 0) return null

  return (
    <div
      style={{
        borderTop: compact ? "1px solid var(--color-border)" : undefined,
        marginTop: compact ? "0.75rem" : undefined,
        paddingTop: compact ? "0.75rem" : undefined,
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          margin: "0 0 0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
        }}
      >
        ⭐ Tus favoritas ({favorites.length})
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {favorites.slice(0, compact ? 3 : undefined).map((fav) => (
          <div
            key={fav.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              padding: compact ? "0.5rem 0.75rem" : "0.75rem 1rem",
              borderRadius: compact ? "10px" : "12px",
              background: "var(--color-accent-soft)",
              border: "1px solid var(--color-border)",
              transition: "color, background-color, border-color, box-shadow var(--duration-fast) var(--ease-out)",
            }}
          >
            <div
              style={{
                width: compact ? "28px" : "36px",
                height: compact ? "28px" : "36px",
                borderRadius: compact ? "8px" : "10px",
                display: "grid",
                placeItems: "center",
                background: "var(--color-accent-soft)",
                flexShrink: 0,
                fontSize: compact ? "0.75rem" : "0.9rem",
              }}
            >
              🔒
            </div>

            <span
              style={{
                flex: 1,
                color: "var(--color-text)",
                fontFamily: "var(--font-mono)",
                fontSize: compact ? "0.7rem" : "0.8rem",
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fav.metadata.label ?? `Passphrase (${fav.metadata.bits} bits)`}
            </span>

            <span style={{ fontSize: "0.6rem", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>
              {fav.metadata.bits}b
            </span>

            <button
              type="button"
              onClick={() => void handleCopy(fav.id)}
              aria-label={
                copiedId === fav.id
                  ? "Favorita copiada"
                  : "Copiar o desbloquear favorita"
              }
              aria-live="polite"
              style={{
                all: "unset",
                cursor: "pointer",
                fontSize: compact ? "0.7rem" : "0.85rem",
                color:
                  copiedId === fav.id
                    ? "var(--color-success)"
                    : "var(--color-text-tertiary)",
                padding: "0.15rem 0.3rem",
                borderRadius: "4px",
                transition: "color var(--duration-fast) var(--ease-out)",
              }}
            >
              {copiedId === fav.id ? "✅" : "📋"}
            </button>

            <button
              type="button"
              onClick={() => onRemove(fav.id)}
              aria-label="Eliminar favorita"
              style={{
                all: "unset",
                cursor: "pointer",
                fontSize: compact ? "0.65rem" : "0.75rem",
                color: "var(--color-text-tertiary)",
                padding: "0.15rem 0.3rem",
                borderRadius: "4px",
                transition: "color var(--duration-fast) var(--ease-out)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-error)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-tertiary)"
              }}
            >
              🗑️
            </button>

            {unlockId === fav.id && (
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleCopy(fav.id)
                }}
                style={{
                  flexBasis: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                  marginTop: "0.5rem",
                }}
              >
                <label
                  htmlFor={`favorite-passphrase-${fav.id}`}
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Ingresá la contraseña original para desbloquear y copiar
                </label>
                <input
                  id={`favorite-passphrase-${fav.id}`}
                  type="password"
                  value={unlockPassphrase}
                  onChange={(event) => setUnlockPassphrase(event.target.value)}
                  autoComplete="current-password"
                  autoFocus
                  required
                  style={{
                    width: "100%",
                    padding: "0.45rem 0.6rem",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                  }}
                />
                {copyError && (
                  <p
                    role="alert"
                    style={{
                      color: "var(--color-error)",
                      fontSize: "0.7rem",
                    }}
                  >
                    {copyError}
                  </p>
                )}
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    type="submit"
                    style={{
                      cursor: "pointer",
                      padding: "0.35rem 0.6rem",
                      border: "1px solid var(--color-accent)",
                      borderRadius: "6px",
                      background: "var(--color-accent-soft)",
                      color: "var(--color-accent)",
                      fontSize: "0.7rem",
                    }}
                  >
                    Desbloquear y copiar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUnlockId(null)
                      setUnlockPassphrase("")
                      setCopyError(null)
                    }}
                    style={{
                      cursor: "pointer",
                      padding: "0.35rem 0.6rem",
                      border: "1px solid var(--color-border)",
                      borderRadius: "6px",
                      background: "transparent",
                      color: "var(--color-text-secondary)",
                      fontSize: "0.7rem",
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
    </div>
  )
}
