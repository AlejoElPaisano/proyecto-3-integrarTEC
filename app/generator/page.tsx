import type { Metadata } from "next"
import { WizardLayout } from "@/shared/components/ui/WizardLayout"
import { GeneratorPageClient } from "@/features/generator/components/GeneratorPageClient"

export const metadata: Metadata = {
  title: "Generador simple",
  description:
    "Configurá palabras, separadores, mayúsculas, números y símbolos para generar una passphrase de alta entropía con entropía en bits calculada en tiempo real.",
  alternates: { canonical: "/generator" },
}

export default function GeneratorPage() {
  return (
    <WizardLayout>
      <GeneratorPageClient />
    </WizardLayout>
  )
}
