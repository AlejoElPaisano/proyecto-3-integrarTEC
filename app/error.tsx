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
      className="flex min-h-screen flex-col items-center justify-center p-[2rem_1rem] text-center"
      role="alert"
    >
      <div
        aria-hidden="true"
        className="mb-4 text-[2.5rem]"
      >
        ⚠️
      </div>
      <h1 className="mb-2 text-[1.6rem] font-extrabold tracking-[-0.03em]">
        Algo salió mal
      </h1>
      <p className="mb-6 max-w-[420px] text-[0.95rem] text-(--color-text-secondary)">
        Ocurrió un error inesperado al renderizar esta página. Intentá de nuevo;
        si persiste, volvé al inicio.
      </p>
      {error.digest ? (
        <p className="mb-6 text-[0.75rem] text-(--color-text-tertiary)">
          Código: {error.digest}
        </p>
      ) : null}
      <div className="flex gap-3">
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
