import type { Metadata } from "next"
import { FavoritesPageClient } from "./FavoritesPageClient"

export const metadata: Metadata = {
  title: "Frases Favoritas | PassFrases",
  description: "Gestioná y accedé a tus frases de contraseña guardadas en favoritas.",
}

export default function FavoritesPage() {
  return <FavoritesPageClient />
}
