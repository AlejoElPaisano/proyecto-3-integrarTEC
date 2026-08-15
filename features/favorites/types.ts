import type { StrengthLevel } from "@/features/generator/types"
import type { EncryptedPayload } from "@/shared/types/crypto.types"

export interface FavoriteMetadata {
  bits: number
  strength: StrengthLevel
  wordCount: number
  createdAt: number
  updatedAt: number
  label?: string
}

export interface FavoriteEntry {
  id: string
  encrypted: EncryptedPayload
  metadata: FavoriteMetadata
}

export interface FavoritesBackup {
  formatVersion: 2
  exportedAt: number
  favorites: FavoriteEntry[]
}

export interface FavoriteState {
  favorites: FavoriteEntry[]
  unlocked: boolean
}

export type FavoriteCopyStatus =
  | "copied"
  | "not-found"
  | "locked"
  | "invalid-passphrase"
  | "clipboard-unavailable"

export interface FavoritesStore extends FavoriteState {
  addFavorite: (
    password: string,
    passphrase: string,
    metadata: FavoriteMetadata,
  ) => Promise<void>
  removeFavorite: (id: string) => void
  mergeFavorites: (incoming: FavoriteEntry[]) => number
  copyToClipboard: (
    id: string,
    passphrase?: string,
  ) => Promise<FavoriteCopyStatus>
}
