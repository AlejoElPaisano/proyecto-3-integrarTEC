import type { Metadata } from "next"
import { HistoryPageClient } from "./HistoryPageClient"

export const metadata: Metadata = {
  title: "Historial de frases | PassFrases",
  description: "Revisá las frases y contraseñas que generaste en tu sesión activa de PassFrases.",
  alternates: { canonical: "/history" },
}

export default function HistoryPage() {
  return <HistoryPageClient />
}
