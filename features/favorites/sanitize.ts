import type { FavoriteEntry, FavoriteMetadata } from "./types"

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