import { Shield } from 'lucide-react'
import type { ReactNode } from 'react'
import Link from 'next/link'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative z-[1] flex min-h-screen flex-col">

      {/* Skip link accesibilidad */}
      <a href="#main-content" className="skip-link">Saltar al contenido</a>

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-(--color-border) bg-[rgba(6,11,24,0.7)] p-[0.75rem_1.25rem] backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-[0.6rem]">
          <Shield size={22} className="text-(--color-accent)" />
          <span className="bg-clip-text text-[1.1rem] font-extrabold tracking-[-0.03em] text-transparent [background-image:linear-gradient(135deg,#e2e2f0,#a78bfa)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            PassFrases
          </span>
        </div>

        {/* Nav + security badge */}
        <div className="flex items-center gap-3">
          <nav aria-label="Navegación principal" className="hidden sm:block">
            <Link
              href="/strength-checker"
              className="rounded-sm border border-(--color-border) px-3 py-1.5 text-[0.8rem] font-medium text-(--color-text-secondary) no-underline transition-colors duration-[var(--duration-fast)] hover:border-(--color-accent) hover:text-(--color-accent)"
            >
              🔍 Verificar
            </Link>
          </nav>

          {/* Badge seguridad */}
          <div className="flex items-center gap-[0.4rem] rounded-full border border-[rgba(34,197,94,0.2)] bg-(--color-success-soft) px-[0.8rem] py-[0.35rem] text-[0.75rem] font-medium text-(--color-success)">
            <span aria-hidden="true">🔒</span>
            100% local
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        id="main-content"
        className="flex-1"
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-(--color-border) bg-[rgba(6,11,24,0.85)] p-3 text-center text-[0.75rem] text-(--color-text-tertiary)">
        PassFrases · Contraseñas generadas localmente, nunca enviadas a servidores
      </footer>

    </div>
  )
}
