'use client'

import { useCallback } from "react"
import { useFavoriteStore } from "@/features/favorites/store"
import type {
  FavoriteCopyStatus,
  FavoriteEntry,
  FavoriteMetadata,
} from "@/features/favorites/types"

export function useFavorites() {
  const favorites = useFavoriteStore((s) => s.favorites)
  const addFavorite = useFavoriteStore((s) => s.addFavorite)
  const removeFavorite = useFavoriteStore((s) => s.removeFavorite)
  const copyToClipboard = useFavoriteStore((s) => s.copyToClipboard)
  const mergeFavorites = useFavoriteStore((s) => s.mergeFavorites)
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
    async (
      id: string,
      passphrase?: string,
    ): Promise<FavoriteCopyStatus> => {
      return copyToClipboard(id, passphrase)
    },
    [copyToClipboard],
  )

  const handleMerge = useCallback(
    (incoming: FavoriteEntry[]): number => mergeFavorites(incoming),
    [mergeFavorites],
  )

  return {
    favorites,
    addFavorite: handleAdd,
    removeFavorite: handleRemove,
    copyToClipboard: handleCopy,
    mergeFavorites: handleMerge,
  }
}
