import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { FavoriteEntry, FavoriteMetadata, FavoritesStore } from "./types"
import { encryptPassword, decryptPassword } from "@/services/crypto.service"

const STORAGE_KEY = "passfrases-favorites-v1"

interface PersistedData {
  formatVersion: number
  state: {
    favorites: FavoriteEntry[]
    unlocked: false
  }
}

function migrateIfNeeded(): void {
  if (typeof window === "undefined") return
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  try {
    const data = JSON.parse(raw) as PersistedData
    if (data.formatVersion !== 1) {
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
      },

      removeFavorite: (id: string) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }))
      },

      copyToClipboard: async (
        id: string,
        passphrase: string,
      ): Promise<string | null> => {
        const state = get()
        const entry = state.favorites.find((f) => f.id === id)
        if (!entry) return null

        const plaintext = await decryptPassword(entry.encrypted, passphrase)
        if (plaintext === null) return null

        try {
          await navigator.clipboard.writeText(plaintext)
          return plaintext
        } catch {
          return plaintext
        }
      },

    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        formatVersion: 1,
        state: {
          favorites: state.favorites,
          unlocked: false,
        },
      }),
      merge: (persisted, current) => {
        const data = persisted as PersistedData
        if (data?.formatVersion === 1 && Array.isArray(data?.state?.favorites)) {
          return {
            ...current,
            favorites: data.state.favorites,
            unlocked: false,
          }
        }
        return current
      },
    },
  ),
)
