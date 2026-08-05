import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  FavoriteEntry,
  FavoriteMetadata,
  FavoritesStore,
} from "./types"
import { encryptPassword, decryptPassword } from "@/services/crypto.service"

const STORAGE_KEY = "passfrases-favorites-v1"
const sessionPassphrases = new Map<string, string>()

interface PersistedData {
  formatVersion: number
  state: {
    favorites: FavoriteEntry[]
    unlocked: false
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isStrength(value: unknown): value is FavoriteMetadata["strength"] {
  return (
    value === "weak" ||
    value === "medium" ||
    value === "strong" ||
    value === "very-strong"
  )
}

function sanitizeFavorites(value: unknown): FavoriteEntry[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((favorite): FavoriteEntry[] => {
    if (!isRecord(favorite)) return []
    if (!isRecord(favorite.encrypted) || !isRecord(favorite.metadata)) return []

    const encrypted = favorite.encrypted
    const metadata = favorite.metadata
    if (
      typeof favorite.id !== "string" ||
      typeof encrypted.ciphertext !== "string" ||
      typeof encrypted.iv !== "string" ||
      typeof encrypted.salt !== "string" ||
      !isStrength(metadata.strength) ||
      !Number.isFinite(metadata.bits) ||
      !Number.isFinite(metadata.wordCount) ||
      !Number.isFinite(metadata.createdAt) ||
      !Number.isFinite(metadata.updatedAt)
    ) {
      return []
    }

    return [
      {
        id: favorite.id,
        encrypted: {
          ciphertext: encrypted.ciphertext,
          iv: encrypted.iv,
          salt: encrypted.salt,
        },
        metadata: {
          bits: metadata.bits as number,
          strength: metadata.strength,
          wordCount: metadata.wordCount as number,
          createdAt: metadata.createdAt as number,
          updatedAt: metadata.updatedAt as number,
        },
      },
    ]
  })
}

function migrateIfNeeded(): void {
  if (typeof window === "undefined") return
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  try {
    const data = JSON.parse(raw) as PersistedData
    if (data.formatVersion !== 1 && data.formatVersion !== 2) {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
}

migrateIfNeeded()

export const useFavoriteStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      unlocked: false,

      addFavorite: async (
        password: string,
        passphrase: string,
        metadata: FavoriteMetadata,
      ) => {
        const encrypted = await encryptPassword(password, passphrase)
        const entry: FavoriteEntry = {
          id: crypto.randomUUID(),
          encrypted,
          metadata: {
            ...metadata,
            createdAt: metadata.createdAt ?? Date.now(),
            updatedAt: Date.now(),
          },
        }
        set((state) => ({
          favorites: [entry, ...state.favorites],
        }))
        sessionPassphrases.set(entry.id, passphrase)
      },

      removeFavorite: (id: string) => {
        sessionPassphrases.delete(id)
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }))
      },

      copyToClipboard: async (
        id: string,
        passphrase?: string,
      ) => {
        const state = get()
        const entry = state.favorites.find((f) => f.id === id)
        if (!entry) return "not-found"

        const key = passphrase?.trim() || sessionPassphrases.get(id)
        if (!key) return "locked"

        const plaintext = await decryptPassword(entry.encrypted, key)
        if (plaintext === null) return "invalid-passphrase"

        try {
          if (!navigator.clipboard?.writeText) return "clipboard-unavailable"
          await navigator.clipboard.writeText(plaintext)
          sessionPassphrases.set(id, key)
          return "copied"
        } catch {
          return "clipboard-unavailable"
        }
      },

    }),
    {
      name: STORAGE_KEY,
      version: 2,
      migrate: (persistedState) => {
        const data = isRecord(persistedState) ? persistedState : {}
        const state = isRecord(data.state) ? data.state : {}

        return {
          formatVersion: 2,
          state: {
            favorites: sanitizeFavorites(state.favorites),
            unlocked: false,
          },
        }
      },
      partialize: (state) => ({
        formatVersion: 2,
        state: {
          favorites: sanitizeFavorites(state.favorites),
          unlocked: false,
        },
      }),
      merge: (persisted, current) => {
        const data = persisted as PersistedData
        if (data?.formatVersion === 2 && Array.isArray(data?.state?.favorites)) {
          return {
            ...current,
            favorites: sanitizeFavorites(data.state.favorites),
            unlocked: false,
          }
        }
        return current
      },
    },
  ),
)
