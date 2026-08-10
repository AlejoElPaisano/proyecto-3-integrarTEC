import { Shield } from 'lucide-react'
import type { ReactNode } from 'react'
import Link from 'next/link'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Skip link accesibilidad */}
      <a href="#main-content" className="skip-link">Saltar al contenido</a>

      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        background: 'rgba(6,11,24,0.7)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Shield size={22} style={{ color: 'var(--color-accent)' }} />
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #e2e2f0, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            PassFrases
          </span>
        </div>

        {/* Nav + security badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <nav aria-label="Navegación principal">
            <Link
              href="/strength-checker"
              className="rounded-sm border border-(--color-border) px-3 py-1.5 text-[0.8rem] font-medium text-(--color-text-secondary) no-underline transition-colors duration-[var(--duration-fast)] hover:border-(--color-accent) hover:text-(--color-accent)"
            >
              🔍 Verificar
            </Link>
          </nav>

          {/* Badge seguridad */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.8rem',
            background: 'var(--color-success-soft)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '99px',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--color-success)',
          }}>
            <span aria-hidden="true">🔒</span>
            100% local
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        id="main-content"
        style={{ flex: 1 }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '0.75rem',
        borderTop: '1px solid var(--color-border)',
        background: 'rgba(6,11,24,0.85)',
        fontSize: '0.75rem',
        color: 'var(--color-text-tertiary)',
      }}>
        PassFrases · Contraseñas generadas localmente, nunca enviadas a servidores
      </footer>

    </div>
  )
}
