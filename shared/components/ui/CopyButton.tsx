'use client'

import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

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

  const disabled = !text && !getText

  return (
    <div className={cn(full && 'flex-1')}>
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        aria-label={copied ? 'Copiado' : 'Copiar'}
        className={cn(
          'group flex cursor-pointer items-center justify-center gap-[0.4rem] rounded-xl border border-(--color-border) bg-transparent font-sans text-[0.9rem] font-semibold text-(--color-text) transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
          full ? 'flex-1 p-[0.85rem]' : 'px-[1.2rem] py-[0.85rem]',
          copied
            ? 'bg-(--color-success-soft) text-(--color-success) hover:bg-(--color-success-soft)'
            : 'hover:border-(--color-accent) hover:bg-(--color-accent-soft)',
          disabled && 'opacity-50',
        )}
      >
        {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        {copied ? 'Copiado' : label ?? 'Copiar'}
      </button>
      {copyError && (
        <p
          role="alert"
          className="mt-[0.4rem] text-[0.7rem] leading-[1.4] text-(--color-error)"
        >
          {copyError}
        </p>
      )}
    </div>
  )
}
