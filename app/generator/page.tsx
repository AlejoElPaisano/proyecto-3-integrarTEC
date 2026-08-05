import { WizardLayout } from "@/shared/components/ui/WizardLayout"
import { GeneratorPageClient } from "@/features/generator/components/GeneratorPageClient"

export default function GeneratorPage() {
  return (
    <WizardLayout>
      <GeneratorPageClient />
    </WizardLayout>
  )
}
