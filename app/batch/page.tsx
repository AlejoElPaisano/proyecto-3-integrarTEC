import type { Metadata } from "next"
import Link from "next/link"
import BatchGenerator from "@/features/batch/components/BatchGenerator"
import { BatchStateController } from "@/features/batch/components/BatchStateController"

export const metadata: Metadata = {
  title: "Generación por lote",
  description:
    "Generá múltiples passphrases de una sola vez con detección de similitud entre frases, y agregalas automáticamente al historial de sesión.",
  alternates: { canonical: "/batch" },
}

export default function BatchPage() {
  return (
    <>
      <BatchStateController />
      <div className="flex min-h-screen flex-col items-center p-[2rem_1rem]">
        <div className="w-full max-w-[680px]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-1 bg-clip-text text-[1.5rem] font-extrabold tracking-[-0.03em] text-transparent [background-image:linear-gradient(135deg,#e2e2f0,#a78bfa)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                Generación por lote
              </h1>
              <p className="text-[0.85rem] text-(--color-text-secondary)">
                Generá múltiples frases de una sola vez
              </p>
            </div>
            <Link
              href="/generator"
              className="rounded-sm border border-(--color-border) px-3.5 py-1.5 text-[0.85rem] font-medium text-(--color-accent) no-underline transition-colors duration-[var(--duration-fast)] hover:border-(--color-accent) hover:bg-(--color-accent-soft)"
            >
              ← Generador simple
            </Link>
          </div>

          <div className="glass-card rounded-(--radius-xl) border border-(--color-border) bg-(--color-card) p-10 backdrop-blur-2xl [box-shadow:var(--glass-shadow)]">
            <BatchGenerator />
          </div>

          <div className="mt-6 text-center text-[0.75rem] leading-[1.6] text-(--color-text-tertiary)">
            <p>
              Las frases generadas se agregan automáticamente al historial de sesión
            </p>
            <p>Usá el botón 🤖 (abajo a la derecha) para ver el historial</p>
          </div>
        </div>
      </div>
    </>
  )
}
