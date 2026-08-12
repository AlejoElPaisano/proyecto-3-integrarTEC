import { z } from "zod"

export const strengthSchema = z.enum([
  "weak",
  "medium",
  "strong",
  "very-strong",
])

export const encryptedSchema = z.object({
  ciphertext: z.string(),
  iv: z.string(),
  salt: z.string(),
})

export const favoriteMetadataSchema = z.object({
  bits: z.number().finite(),
  strength: strengthSchema,
  wordCount: z.number().finite(),
  createdAt: z.number().finite(),
  updatedAt: z.number().finite(),
  label: z.string().optional(),
})

export const favoriteEntrySchema = z.object({
  id: z.string(),
  encrypted: encryptedSchema,
  metadata: favoriteMetadataSchema,
})

export const favoritesArraySchema = z.array(favoriteEntrySchema)

export const persistedDataSchema = z.object({
  formatVersion: z.union([z.literal(1), z.literal(2)]),
  state: z.object({
    favorites: favoritesArraySchema,
    unlocked: z.literal(false),
  }),
})

export const backupDataSchema = z.object({
  formatVersion: z.literal(2),
  exportedAt: z.number().optional(),
  favorites: favoritesArraySchema,
})
