'use client'

import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  text?: string
  full?: boolean
  label?: string
  getText?: () => Promise<string>
}

export function CopyButton({ text, full, label, getText }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)

  const handleCopy = useCallback(async () => {
    try {
      const value = text ?? (getText ? await getText() : undefined)
      if (!value) return

      if (!navigator.clipboard?.writeText) {
        throw new Error("Portapapeles no disponible en este navegador")
      }

      await navigator.clipboard.writeText(value)
      setCopied(true)
      setCopyError(null)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? `No se pudo copiar al portapapeles: ${error.message}`
          : "No se pudo copiar al portapapeles. Verifica los permisos del navegador."
      setCopied(false)
      setCopyError(message)
    }
  }, [text, getText])

  return (
    <div style={{ flex: full ? 1 : undefined, display: full ? 'flex' : 'inline-block' }}>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!text && !getText}
        aria-label={copied ? 'Copiado' : 'Copiar'}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          padding: '0.85rem 1rem',
          flex: full ? 1 : undefined,
          width: full ? '100%' : 'auto',
          boxSizing: 'border-box',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          background: copied ? 'var(--color-success-soft)' : 'transparent',
          color: copied ? 'var(--color-success)' : 'var(--color-text)',
          fontSize: '0.9rem',
          fontWeight: 600,
          fontFamily: 'var(--font-sans)',
          transition: 'border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)',
          opacity: !text && !getText ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (text || getText) {
            e.currentTarget.style.borderColor = 'var(--color-accent)'
            e.currentTarget.style.background = 'var(--color-accent-soft)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.background = copied ? 'var(--color-success-soft)' : 'transparent'
        }}
      >
        {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        {copied ? 'Copiado' : label ?? 'Copiar'}
      </button>
      {copyError && (
        <p
          role="alert"
          style={{
            marginTop: '0.4rem',
            color: 'var(--color-error)',
            fontSize: '0.7rem',
            lineHeight: 1.4,
          }}
        >
          {copyError}
        </p>
      )}
    </div>
  )
}
