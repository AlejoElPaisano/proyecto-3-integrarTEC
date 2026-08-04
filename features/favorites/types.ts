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

export interface FavoriteState {
  favorites: FavoriteEntry[]
  unlocked: boolean
}

export interface FavoritesStore extends FavoriteState {
  addFavorite: (
    password: string,
    passphrase: string,
    metadata: FavoriteMetadata,
  ) => Promise<void>
  removeFavorite: (id: string) => void
  copyToClipboard: (id: string, passphrase: string) => Promise<string | null>
}
