'use client'

import { useState } from "react"
import type { FavoriteEntry } from "@/features/favorites/types"
import { useHasMounted } from "@/shared/hooks/useHasMounted"

interface FavoritesPanelProps {
  favorites: FavoriteEntry[]
  onRemove: (id: string) => void
  compact?: boolean
}

export function FavoritesPanel({
  favorites,
  onRemove,
  compact,
}: FavoritesPanelProps) {
  const hasMounted = useHasMounted()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function handleCopy(id: string, ciphertext: string) {
    try {
      await navigator.clipboard.writeText(ciphertext)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // silent
    }
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
              onClick={() => handleCopy(fav.id, fav.encrypted.ciphertext)}
              aria-label="Copiar favorita"
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
          </div>
        ))}
      </div>
    </div>
  )
}
