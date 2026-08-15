import type { FavoritesBackup, FavoriteEntry } from "@/features/favorites/types"
import { backupDataSchema } from "@/features/favorites/schema"

const MAX_FAVORITES = 500
const BACKUP_FORMAT_VERSION = 2

export function serializeBackup(favorites: FavoriteEntry[]): FavoritesBackup {
  return {
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: Date.now(),
    favorites,
  }
}

export function parseBackup(
  raw: string,
): { ok: true; favorites: FavoriteEntry[] } | { ok: false; error: string } {
  try {
    const parsed: unknown = JSON.parse(raw)
    const result = backupDataSchema.safeParse(parsed)
    if (!result.success) {
      return {
        ok: false,
        error: "El archivo no es un backup válido de PassFrases.",
      }
    }
    const favorites = result.data.favorites.slice(0, MAX_FAVORITES)
    if (favorites.length === 0) {
      return {
        ok: false,
        error: "El archivo no contiene favoritos válidos.",
      }
    }
    return { ok: true, favorites }
  } catch {
    return {
      ok: false,
      error: "No se pudo leer el archivo. Verificá que sea un JSON válido.",
    }
  }
}