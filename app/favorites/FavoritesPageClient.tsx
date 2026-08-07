'use client'

import Link from "next/link"
import { WizardLayout } from "@/shared/components/ui/WizardLayout"
import { FavoritesPanel } from "@/features/favorites/components/FavoritesPanel"
import { useFavorites } from "@/features/favorites/hooks/useFavorites"
import { useHasMounted } from "@/shared/hooks/useHasMounted"

export function FavoritesPageClient() {
  const hasMounted = useHasMounted()
  const { favorites } = useFavorites()

  if (!hasMounted) return null

  return (
    <WizardLayout currentStep={2}>
      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between border-b border-(--color-border) pb-3">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-2xl">⭐</span>
            <h1 className="text-xl font-extrabold text-(--color-text)">
              Frases Favoritas
            </h1>
          </div>
          <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-[#ec4899] bg-[rgba(236,72,153,0.15)]">
            {favorites.length} guardadas
          </span>
        </div>

        {favorites.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl p-8 text-center"
            style={{
              background: "var(--color-accent-soft)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div aria-hidden="true" className="mb-3 text-4xl">
              ⭐
            </div>
            <h2 className="mb-1 text-base font-bold text-(--color-text)">
              Aún no tenés frases favoritas
            </h2>
            <p className="mb-5 text-xs text-(--color-text-secondary)">
              Guardá tus contraseñas importantes haciendo clic en la estrella ⭐ en el generador.
            </p>
            <Link
              href="/generator"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-sans text-sm font-bold text-white shadow-md transition-all duration-150 ease-out hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #ec4899, #818cf8)",
              }}
            >
              ✨ Ir al generador
            </Link>
          </div>
        ) : (
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--color-accent-soft)",
              border: "1px solid var(--color-border)",
            }}
          >
            <FavoritesPanel />
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Link
            href="/generator"
            className="text-xs font-semibold text-(--color-pink) hover:underline"
          >
            ← Volver al generador
          </Link>
        </div>
      </div>
    </WizardLayout>
  )
}
