import type { Metadata } from "next"
import { WizardLayout } from "@/shared/components/ui/WizardLayout"
import { StartButton } from "@/features/generator/components/StartButton"
import { ClippyAssistant } from "@/features/clippy/components/ClippyAssistant"

export const metadata: Metadata = {
  title: "Generador de passphrases seguras",
  description:
    "PassFrases crea passphrases matemáticamente seguras y fáciles de recordar, cifradas localmente en tu navegador. Sin servidores, sin telemetría.",
  alternates: { canonical: "/" },
}

const BENEFITS = [
  {
    icon: "🔑",
    title: "Fácil de recordar",
    desc: "Frases con sentido, no contraseñas al azar.",
  },
  {
    icon: "🛡️",
    title: "Matemáticamente segura",
    desc: "Alta entropía que resiste ataques de fuerza bruta.",
  },
  {
    icon: "⚡",
    title: "Un clic y listo",
    desc: "Generar, copiar y usar al instante.",
  },
]

const styles = `
.btn-start {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem 2rem;
  border-radius: 14px;
  background: linear-gradient(135deg, #ec4899, #818cf8);
  color: #fff;
  font-size: 1.125rem;
  font-weight: 700;
  font-family: var(--font-sans);
  transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(236,72,153,0.35);
}
`

export default function Home() {
  return (
    <>
      <WizardLayout currentStep={1}>
        <style>{styles}</style>
        <div style={{ textAlign: "center" }}>
          <div
            aria-hidden="true"
            style={{
              fontSize: "2.5rem",
              display: "inline-block",
              marginBottom: "0.75rem",
              filter: "drop-shadow(0 0 20px rgba(99,102,241,0.3))",
            }}
          >
            🔐
          </div>

          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #e2e2f0, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.4rem",
            }}
          >
            Tu contraseña perfecta
          </h1>

          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.95rem",
              marginBottom: "2rem",
            }}
          >
            Fácil de recordar, imposible de adivinar. En 3 simples pasos.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              textAlign: "left",
              marginBottom: "2rem",
            }}
          >
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                  padding: "0.85rem 1rem",
                  background: "var(--color-accent-soft)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "14px",
                  transition:
                    "color, background-color, border-color, box-shadow var(--duration-fast) var(--ease-out)",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                    background: "var(--color-accent-soft)",
                    flexShrink: 0,
                    fontSize: "1.3rem",
                  }}
                >
                  {benefit.icon}
                </div>

                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      marginBottom: "0.1rem",
                    }}
                  >
                    {benefit.title}
                  </strong>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {benefit.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <StartButton />
        </div>
      </WizardLayout>
      <ClippyAssistant floating />
    </>
  )
}

