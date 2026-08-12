"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function ErrorPage({
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        textAlign: "center",
      }}
      role="alert"
    >
      <div
        aria-hidden="true"
        style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
      >
        ⚠️
      </div>
      <h1
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: "0.5rem",
        }}
      >
        Algo salió mal
      </h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "0.95rem",
          maxWidth: "420px",
          marginBottom: "1.5rem",
        }}
      >
        Ocurrió un error inesperado al renderizar esta página. Intentá de nuevo;
        si persiste, volvé al inicio.
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
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-sm border border-(--color-border) bg-(--color-accent-soft) px-4 py-2 text-[0.9rem] font-medium text-(--color-accent) transition-colors duration-[var(--duration-fast)] hover:border-(--color-accent)"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-sm border border-(--color-border) px-4 py-2 text-[0.9rem] font-medium text-(--color-text-secondary) no-underline transition-colors duration-[var(--duration-fast)] hover:border-(--color-accent)"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}