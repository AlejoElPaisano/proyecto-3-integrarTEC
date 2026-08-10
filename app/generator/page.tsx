import { WizardLayout } from "@/shared/components/ui/WizardLayout"
import { GeneratorPageClient } from "@/features/generator/components/GeneratorPageClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Generador",
  description: "Personalizá la cantidad de palabras, separadores y opciones avanzadas para crear tu passphrase segura.",
}

export default function GeneratorPage() {
  return (
    <WizardLayout>
      <GeneratorPageClient />
    </WizardLayout>
  )
}
