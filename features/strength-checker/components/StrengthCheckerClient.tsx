'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { EntropyMeter } from '@/shared/components/ui/EntropyMeter'
import { useHasMounted } from '@/shared/hooks/useHasMounted'
import { analyzeArbitraryPassword } from '@/shared/lib/strength'
import { STRENGTH_CONFIG } from '@/features/generator/types'
import { CrackTimeDisplay } from './CrackTimeDisplay'

export function StrengthCheckerClient() {
  const hasMounted = useHasMounted()
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)

  const analysis = useMemo(
    () => (password.length > 0 ? analyzeArbitraryPassword(password) : null),
    [password],
  )

  if (!hasMounted) return null

  const strengthConfig = analysis ? STRENGTH_CONFIG[analysis.strength] : null

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '680px' }}>
        {/* Header */}
        <div
          style={{
            marginBottom: '1.5rem',
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #e2e2f0, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.25rem',
            }}
          >
            Verificador de fortaleza
          </h1>
          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.5,
              color: 'var(--color-text-secondary)',
            }}
          >
            Pegá una contraseña para auditar su entropía y tiempo de crackeo
          </p>
        </div>

        {/* Glass card */}
        <div
          className="glass-card"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1.25rem, 5vw, 2.5rem)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          {/* Emoji header */}
          <div
            aria-hidden="true"
            style={{
              fontSize: '2.5rem',
              display: 'inline-block',
              marginBottom: '0.75rem',
              filter: 'drop-shadow(0 0 24px rgba(99,102,241,0.35))',
            }}
          >
            🔍
          </div>

          {/* Input + toggle */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="strength-input"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                marginBottom: '0.45rem',
              }}
            >
              Contraseña a verificar
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'stretch' }}>
              <input
                id="strength-input"
                type={visible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                placeholder="Escribí o pegá una contraseña"
                style={{
                  flex: '1 1 200px',
                  minWidth: 0,
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem',
                  letterSpacing: '0.01em',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={visible}
                className="transition-colors duration-150 ease-out hover:border-accent hover:text-text"
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  flex: '0 0 auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              >
                {visible ? '🙈' : '👁️'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPassword('')
                  setVisible(false)
                }}
                disabled={password.length === 0}
                aria-label="Limpiar campo"
                className="transition-colors duration-150 ease-out hover:border-accent hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  all: 'unset',
                  cursor: password.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: password.length === 0 ? 0.5 : 1,
                  flex: '0 0 auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-tertiary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              >
                Limpiar
              </button>
            </div>
            <p
              style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}
            >
              🔒 100% local: la contraseña no se envía ni se persiste. Se borra
              de la memoria al cerrar la página.
            </p>
          </div>

          {/* Result */}
          {analysis && strengthConfig && (
            <div
              role="status"
              aria-live="polite"
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <EntropyMeter bits={analysis.bits} />

              <CrackTimeDisplay
                online={analysis.crackTimeOnline}
                offline={analysis.crackTimeOffline}
              />

              {/* Warnings */}
              <div>
                <h2
                  style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.6rem' }}
                >
                  Análisis de patrones
                </h2>
                {analysis.warnings.length === 0 ? (
                  <p
                    role="status"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      lineHeight: 1.45,
                      background: 'var(--color-success-soft)',
                      border: '1px solid rgba(34,197,94,0.2)',
                      color: 'var(--color-success)',
                    }}
                  >
                    <span aria-hidden="true">✓</span>
                    No detectamos patrones débiles. Buena variedad de charset y
                    sin secuencias comunes.
                  </p>
                ) : (
                  <ul
                    role="list"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      padding: 0,
                      margin: 0,
                      listStyle: 'none',
                    }}
                  >
                    {analysis.warnings.map((warning, index) => (
                      <li
                        key={index}
                        role="listitem"
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.6rem',
                          padding: '0.7rem 0.9rem',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-accent-soft)',
                          color: 'var(--color-text-secondary)',
                          fontSize: '0.875rem',
                          lineHeight: 1.45,
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{ color: 'var(--color-warning)', fontWeight: 700, flexShrink: 0 }}
                        >
                          ⚠️
                        </span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
          }}
        >
          <Link
            href="/"
            className="transition-colors duration-150 ease-out hover:border-accent hover:bg-accent-soft"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.5rem 1.1rem',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-accent)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
