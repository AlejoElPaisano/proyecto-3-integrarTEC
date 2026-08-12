"use client"

import { useEffect } from "react"
import "./globals.css"

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-center justify-center bg-(--color-surface) p-[2rem_1rem] text-center font-sans text-(--color-text)">
        <div role="alert">
          <h1 className="mb-2 text-[1.6rem] font-extrabold tracking-[-0.03em]">
            Error crítico de la aplicación
          </h1>
          <p className="mb-6 max-w-[420px] text-[0.95rem] text-(--color-text-secondary)">
            Ocurrió un error grave que impidió cargar la interfaz. Intentá de
            nuevo; si persiste, recargá la página.
          </p>
          {error.digest ? (
            <p className="mb-6 text-[0.75rem] text-(--color-text-tertiary)">
              Código: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-sm border border-(--color-border) bg-(--color-accent-soft) px-4 py-2 text-[0.9rem] font-medium text-(--color-accent) transition-colors duration-[var(--duration-fast)] hover:border-(--color-accent)"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
