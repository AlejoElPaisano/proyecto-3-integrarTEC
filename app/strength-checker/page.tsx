import type { Metadata } from "next"
import { StrengthCheckerClient } from "@/features/strength-checker/components/StrengthCheckerClient"

export const metadata: Metadata = {
  title: "Verificador de fortaleza",
  description:
    "Analizá la entropía y el tiempo estimado de crackeo de cualquier contraseña. 100% local: tu contraseña nunca se envía a ningún servidor ni se persiste.",
  alternates: { canonical: "/strength-checker" },
}

export default function StrengthCheckerPage() {
  return <StrengthCheckerClient />
}
