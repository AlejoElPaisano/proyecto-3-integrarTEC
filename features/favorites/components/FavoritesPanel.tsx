'use client'

import { useState } from "react"
import type { FavoriteEntry } from "@/features/favorites/types"
import { useHasMounted } from "@/shared/hooks/useHasMounted"
import { useFavorites } from "@/features/favorites/hooks/useFavorites"
import { cn } from "@/shared/lib/cn"

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
    <div className={cn(compact && "mt-3 border-t border-(--color-border) pt-3")}>
      <p className="mb-2 flex items-center gap-[0.35rem] text-[0.75rem] font-semibold text-(--color-text-secondary)">
        ⭐ Tus favoritas ({favorites.length})
      </p>

      <div className="flex flex-col gap-2">
        {favorites.slice(0, compact ? 3 : undefined).map((fav) => (
          <div
            key={fav.id}
            className={cn(
              "flex flex-wrap items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-accent-soft) transition-[color,background-color,border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
              compact ? "px-3 py-2" : "px-4 py-3",
            )}
          >
            <div
              className={cn(
                "grid shrink-0 place-items-center rounded-[10px] bg-(--color-accent-soft)",
                compact ? "h-7 w-7 text-[0.75rem]" : "h-9 w-9 text-[0.9rem]",
              )}
            >
              🔒
            </div>

            <span
              className={cn(
                "flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono font-semibold text-(--color-text)",
                compact ? "text-[0.7rem]" : "text-[0.8rem]",
              )}
            >
              {fav.metadata.label ?? `Passphrase (${fav.metadata.bits} bits)`}
            </span>

            <span className="whitespace-nowrap text-[0.6rem] text-(--color-text-tertiary)">
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
              className={cn(
                "cursor-pointer rounded px-[0.3rem] py-[0.15rem] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                compact ? "text-[0.7rem]" : "text-[0.85rem]",
                copiedId === fav.id
                  ? "text-(--color-success)"
                  : "text-(--color-text-tertiary)",
              )}
            >
              {copiedId === fav.id ? "✅" : "📋"}
            </button>

            <button
              type="button"
              onClick={() => onRemove(fav.id)}
              aria-label="Eliminar favorita"
              className={cn(
                "cursor-pointer rounded px-[0.3rem] py-[0.15rem] text-(--color-text-tertiary) transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-(--color-error)",
                compact ? "text-[0.65rem]" : "text-[0.75rem]",
              )}
            >
              🗑️
            </button>

            {unlockId === fav.id && (
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleCopy(fav.id)
                }}
                className="mt-2 flex w-full basis-full flex-col gap-[0.4rem]"
              >
                <label
                  htmlFor={`favorite-passphrase-${fav.id}`}
                  className="text-[0.7rem] text-(--color-text-secondary)"
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
                  className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-[0.6rem] py-[0.45rem] font-mono text-[0.75rem] text-(--color-text)"
                />
                {copyError && (
                  <p role="alert" className="text-[0.7rem] text-(--color-error)">
                    {copyError}
                  </p>
                )}
                <div className="flex gap-[0.4rem]">
                  <button
                    type="submit"
                    className="cursor-pointer rounded-md border border-(--color-accent) bg-(--color-accent-soft) px-[0.6rem] py-[0.35rem] text-[0.7rem] text-(--color-accent)"
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
                    className="cursor-pointer rounded-md border border-(--color-border) bg-transparent px-[0.6rem] py-[0.35rem] text-[0.7rem] text-(--color-text-secondary)"
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
