import Link from "next/link"
import BatchGenerator from "@/features/batch/components/BatchGenerator"
import { BatchStateController } from "@/features/batch/components/BatchStateController"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Generación por lote",
  description: "Generá múltiples passphrases seguras a la vez con detección automática de repetidas.",
}

export default function BatchPage() {
  return (
    <>
      <BatchStateController />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem 1rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "680px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #e2e2f0, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: "0.25rem",
                }}
              >
                Generación por lote
              </h1>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-text-secondary)",
                }}
              >
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

          <div
            className="glass-card"
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            <BatchGenerator />
          </div>

          <div
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--color-text-tertiary)",
              lineHeight: 1.6,
            }}
          >
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
