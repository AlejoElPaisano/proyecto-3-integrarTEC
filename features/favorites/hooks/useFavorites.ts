import { useCallback } from "react"
import { useFavoriteStore } from "@/features/favorites/store"
import type { FavoriteMetadata } from "@/features/favorites/types"

export function useFavorites() {
  const favorites = useFavoriteStore((s) => s.favorites)
  const addFavorite = useFavoriteStore((s) => s.addFavorite)
  const removeFavorite = useFavoriteStore((s) => s.removeFavorite)
  const copyToClipboard = useFavoriteStore((s) => s.copyToClipboard)
  const handleAdd = useCallback(
    async (password: string, passphrase: string, metadata: FavoriteMetadata) => {
      await addFavorite(password, passphrase, metadata)
    },
    [addFavorite],
  )

  const handleRemove = useCallback(
    (id: string) => {
      removeFavorite(id)
    },
    [removeFavorite],
  )

  const handleCopy = useCallback(
    async (id: string, passphrase: string): Promise<string | null> => {
      return copyToClipboard(id, passphrase)
    },
    [copyToClipboard],
  )

  return {
    favorites,
    addFavorite: handleAdd,
    removeFavorite: handleRemove,
    copyToClipboard: handleCopy,
  }
}
