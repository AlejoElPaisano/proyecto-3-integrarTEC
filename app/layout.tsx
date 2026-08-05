import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/shared/components/ui/AppLayout";
import HistoryPanel from "@/features/batch/components/HistoryPanel";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PassFrases | Tu contraseña perfecta",
    template: "%s | PassFrases",
  },
  description:
    "Generá passphrases matemáticamente seguras, fáciles de recordar y cifradas localmente en el navegador.",
  openGraph: {
    title: "PassFrases | Generador de Contraseñas Seguras",
    description:
      "Crea passphrases de alta entropía y gestión de favoritos cifrados.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <AppLayout>{children}</AppLayout>
        <HistoryPanel />
      </body>
    </html>
  );
}
