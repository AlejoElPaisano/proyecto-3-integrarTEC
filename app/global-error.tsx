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
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          textAlign: "center",
          background: "var(--color-surface)",
          color: "var(--color-text)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div role="alert">
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "0.5rem",
            }}
          >
            Error crítico de la aplicación
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.95rem",
              maxWidth: "420px",
              marginBottom: "1.5rem",
            }}
          >
            Ocurrió un error grave que impidió cargar la interfaz. Intentá de
            nuevo; si persiste, recargá la página.
          </p>
          {error.digest ? (
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-tertiary)",
                marginBottom: "1.5rem",
              }}
            >
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