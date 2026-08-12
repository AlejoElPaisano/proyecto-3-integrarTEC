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
    <div className="flex min-h-screen flex-col items-center p-[2rem_1rem]">
      <div className="w-full max-w-[680px]">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="min-w-0 flex-[1_1_auto]">
            <h1 className="mb-1 bg-clip-text text-[1.5rem] font-extrabold tracking-[-0.03em] text-transparent [background-image:linear-gradient(135deg,#e2e2f0,#a78bfa)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
              Verificador de fortaleza
            </h1>
            <p className="text-[0.85rem] text-(--color-text-secondary)">
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
        <div className="glass-card rounded-(--radius-xl) border border-(--glass-border) bg-(--glass-bg) p-10 backdrop-blur-2xl [box-shadow:var(--glass-shadow)]">
          {/* Emoji header */}
          <div
            aria-hidden="true"
            className="mb-3 inline-block text-[2.5rem] [filter:drop-shadow(0_0_24px_rgba(99,102,241,0.35))]"
          >
            🔍
          </div>

          {/* Input + toggle */}
          <div className="mb-5">
            <label
              htmlFor="strength-input"
              className="mb-[0.4rem] block text-[0.8rem] font-medium text-(--color-text-secondary)"
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
                className="flex-1 rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2.5 font-mono text-sm text-(--color-text) outline-none transition-colors duration-150 ease-out"
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={visible}
                className="cursor-pointer rounded-lg border border-(--color-border) bg-(--color-surface) px-3 text-xs font-semibold text-(--color-text-secondary) transition-colors duration-150 ease-out"
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
                className="cursor-pointer rounded-lg border border-(--color-border) bg-(--color-surface) px-3 text-xs font-semibold text-(--color-text-tertiary) transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50"
              >
                Limpiar
              </button>
            </div>
            <p className="mt-2 text-[0.65rem] text-(--color-text-tertiary)">
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
                <h2 className="mb-2 text-[0.8rem] font-bold text-(--color-text)">
                  Análisis de patrones
                </h2>
                {analysis.warnings.length === 0 ? (
                  <p
                    role="status"
                    className="flex items-center gap-2 rounded-lg border border-[rgba(34,197,94,0.2)] bg-(--color-success-soft) p-3 text-sm font-medium text-(--color-success)"
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
                        className="flex items-start gap-2 rounded-lg border border-(--color-border) bg-(--color-accent-soft) p-2.5 text-xs text-(--color-text-secondary)"
                      >
                        <span
                          aria-hidden="true"
                          className="shrink-0 font-bold text-(--color-warning)"
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

        <div className="mt-6 text-center">
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
