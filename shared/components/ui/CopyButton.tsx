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

  const handleCopy = useCallback(async () => {
    const value = text ?? (getText ? await getText() : undefined)
    if (!value) {
      return
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Portapapeles no disponible en este navegador")
      }

      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error)
      const message =
        error instanceof Error && error.message
          ? `No se pudo copiar al portapapeles: ${error.message}`
          : "No se pudo copiar al portapapeles. Verifica los permisos del navegador."
      alert(message)
      setCopied(false)
    }
  }, [text, getText])

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text && !getText}
      aria-label={copied ? 'Copiado' : 'Copiar'}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        padding: full ? '0.85rem' : '0.85rem 1.2rem',
        flex: full ? 1 : undefined,
        width: full ? 'auto' : undefined,
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
  )
}
