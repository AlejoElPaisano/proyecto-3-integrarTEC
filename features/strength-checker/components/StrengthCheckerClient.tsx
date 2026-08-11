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
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            columnGap: '1rem',
            rowGap: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ minWidth: 0, flex: '1 1 auto' }}>
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
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              Pegá una contraseña para auditar su entropía y tiempo de crackeo
            </p>
          </div>
          <Link
            href="/generator"
            className="rounded-sm border border-(--color-border) px-3.5 py-1.5 text-[0.85rem] font-medium text-(--color-accent) no-underline transition-colors duration-[var(--duration-fast)] hover:border-(--color-accent) hover:bg-(--color-accent-soft)"
          >
            ← Generador simple
          </Link>
        </div>

        {/* Glass card */}
        <div
          className="glass-card"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
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
              className="block text-[0.8rem] font-medium"
              style={{
                color: 'var(--color-text-secondary)',
                marginBottom: '0.4rem',
              }}
            >
              Contraseña a verificar
            </label>
            <div className="flex gap-2">
              <input
                id="strength-input"
                type={visible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                placeholder="Escribí o pegá una contraseña"
                className="flex-1 rounded-lg px-3 py-2.5 font-mono text-sm outline-none transition-colors duration-150 ease-out"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={visible}
                className="cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors duration-150 ease-out"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
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
                className="cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                Limpiar
              </button>
            </div>
            <p
              className="mt-2 text-[0.65rem]"
              style={{ color: 'var(--color-text-tertiary)' }}
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
              className="flex flex-col gap-4"
            >
              <EntropyMeter bits={analysis.bits} />

              <div className="flex items-center justify-center">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: `${strengthConfig.color}14`,
                    border: `1px solid ${strengthConfig.color}33`,
                    color: strengthConfig.color,
                  }}
                >
                  <span aria-hidden="true">
                    {analysis.strength === 'weak'
                      ? '⚠️'
                      : analysis.strength === 'medium'
                        ? '⚡'
                        : '✓'}
                  </span>
                  {strengthConfig.label}
                </span>
              </div>

              <CrackTimeDisplay
                online={analysis.crackTimeOnline}
                offline={analysis.crackTimeOffline}
              />

              {/* Warnings */}
              <div>
                <h2
                  className="mb-2 text-[0.8rem] font-bold"
                  style={{ color: 'var(--color-text)' }}
                >
                  Análisis de patrones
                </h2>
                {analysis.warnings.length === 0 ? (
                  <p
                    role="status"
                    className="flex items-center gap-2 rounded-lg p-3 text-sm font-medium"
                    style={{
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
                    className="flex flex-col gap-1.5"
                  >
                    {analysis.warnings.map((warning, index) => (
                      <li
                        key={index}
                        role="listitem"
                        className="flex items-start gap-2 rounded-lg p-2.5 text-xs"
                        style={{
                          background: 'var(--color-accent-soft)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="shrink-0 font-bold"
                          style={{ color: 'var(--color-warning)' }}
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
            className="text-xs font-semibold text-(--color-pink) hover:underline"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
