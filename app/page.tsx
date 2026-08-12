import type { Metadata } from "next"
import Link from "next/link"
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

export default function Home() {
  return (
    <>
      <WizardLayout currentStep={1}>
        <div className="text-center">
          <div
            aria-hidden="true"
            className="mb-3 inline-block text-[2.5rem] [filter:drop-shadow(0_0_20px_rgba(99,102,241,0.3))]"
          >
            🔐
          </div>

          <h1 className="mb-[0.4rem] bg-clip-text text-[1.8rem] font-extrabold tracking-[-0.03em] text-transparent [background-image:linear-gradient(135deg,#e2e2f0,#a78bfa)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            Tu contraseña perfecta
          </h1>

          <p className="mb-8 text-[0.95rem] text-(--color-text-secondary)">
            Fácil de recordar, imposible de adivinar. En 3 simples pasos.
          </p>

          <div className="mb-8 flex flex-col gap-3 text-left">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-[0.85rem] rounded-[14px] border border-(--color-border) bg-(--color-accent-soft) p-[0.85rem_1rem] transition-[color,background-color,border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)]"
              >
                <div
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-(--color-accent-soft) text-[1.3rem]"
                >
                  {benefit.icon}
                </div>

                <div>
                  <strong className="mb-[0.1rem] block text-[0.9rem]">
                    {benefit.title}
                  </strong>
                  <span className="text-[0.8rem] text-(--color-text-secondary)">
                    {benefit.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <StartButton />

          <div className="mt-3 text-center">
            <Link
              href="/strength-checker"
              className="rounded-sm border border-(--color-border) px-4 py-2 text-[0.85rem] font-medium text-(--color-text-secondary) no-underline transition-colors duration-[var(--duration-fast)] hover:border-(--color-accent) hover:bg-(--color-accent-soft)"
            >
              🔍 Verificar contraseña existente
            </Link>
          </div>
        </div>
      </WizardLayout>
      <ClippyAssistant floating />
    </>
  )
}
