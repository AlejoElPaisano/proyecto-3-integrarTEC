'use client'

import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { QRCodeModal } from './QRCodeModal'

interface QRCodeButtonProps {
  value: string
  label?: string
  disabled?: boolean
  ariaLabel?: string
}

export function QRCodeButton({
  value,
  label = 'Ver QR',
  disabled = false,
  ariaLabel,
}: QRCodeButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isDisabled = disabled || !value

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={isDisabled}
        aria-label={ariaLabel ?? 'Mostrar código QR para escanear en celular'}
        title="Mostrar código QR para transferir al celular"
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-(--color-border) px-4 py-3 text-[0.9rem] font-semibold text-(--color-text) transition-all duration-150 ease-out hover:border-(--color-accent) hover:bg-(--color-accent-soft) disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-(--color-border) disabled:hover:bg-transparent"
      >
        <QrCode className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </button>

      <QRCodeModal open={isOpen} value={value} onClose={() => setIsOpen(false)} />
    </>
  )
}