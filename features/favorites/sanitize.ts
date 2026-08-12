import type { FavoriteEntry, FavoriteMetadata } from "./types"
import { favoritesArraySchema } from "./schema"

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function isStrength(value: unknown): value is FavoriteMetadata["strength"] {
  return (
    value === "weak" ||
    value === "medium" ||
    value === "strong" ||
    value === "very-strong"
  )
}

export function sanitizeFavorites(value: unknown): FavoriteEntry[] {
  const result = favoritesArraySchema.safeParse(value)
  return result.success ? result.data : []
}
