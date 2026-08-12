'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { CopyButton } from './CopyButton'
import { Eye, EyeOff, QrCode, X, Smartphone, ShieldCheck } from 'lucide-react'

interface QRCodeModalProps {
  open: boolean
  value: string
  onClose: () => void
}

export function QRCodeModal({ open, value, onClose }: QRCodeModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return

    if (open && !el.open) {
      previousActiveElement.current = document.activeElement as HTMLElement
      el.showModal()
      setShowPassword(false)
    } else if (!open && el.open) {
      el.close()
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
        previousActiveElement.current = null
      }
    }
  }, [open])

  useEffect(() => {
    if (!open || !value || !canvasRef.current) return

    setQrError(null)
    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: 250,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      },
      (error) => {
        if (error) {
          setQrError('No se pudo generar el código QR. La frase puede ser demasiado larga.')
        }
      },
    )
  }, [open, value])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="qr-title"
      aria-describedby="qr-instructions"
      className="fixed inset-0 m-auto rounded-(--radius-lg) border border-(--color-border) bg-(--color-card) p-7 text-(--color-text) font-sans backdrop-blur-lg"
      style={{
        boxShadow: 'var(--glass-shadow), 0 0 0 100vw rgba(0,0,0,0.65)',
        maxWidth: '420px',
        width: '92vw',
        zIndex: 9999,
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-(--color-accent)" />
          <h2
            id="qr-title"
            className="m-0 text-[1.15rem] font-bold"
          >
            Transferir al Celular
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="flex cursor-pointer items-center justify-center rounded-full p-[0.4rem] text-(--color-text-secondary) transition-colors duration-150 ease-out hover:bg-white/10 hover:text-(--color-text)"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Contenedor del QR Canvas */}
        <div
          className="flex items-center justify-center rounded-2xl bg-white p-3"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
        >
          <canvas
            ref={canvasRef}
            className="rounded-lg"
            style={{ display: qrError ? 'none' : 'block' }}
          />
          {qrError && (
            <div
              className="max-w-[240px] p-4 text-center text-[0.85rem] text-(--color-error)"
            >
              {qrError}
            </div>
          )}
        </div>

        {/* Instrucción rápida */}
        <div
          id="qr-instructions"
          className="flex w-full items-center gap-2 rounded-[10px] border border-[rgba(99,102,241,0.2)] bg-[rgba(99,102,241,0.1)] p-[0.6rem_0.85rem] text-center text-[0.82rem] text-(--color-text-secondary)"
        >
          <Smartphone className="h-4 w-4 shrink-0 text-(--color-accent)" />
          <span>Escanea la pantalla con la cámara de tu celular para copiar la frase al instante.</span>
        </div>

        {/* Vista previa de la contraseña */}
        <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-black/25 px-4 py-3">
          <span
            className="font-mono text-[0.9rem] font-semibold break-all"
            style={{
              color: showPassword ? 'var(--color-text)' : 'var(--color-text-secondary)',
              letterSpacing: showPassword ? 'normal' : '0.15em',
            }}
          >
            {showPassword ? value : '••••••••••••••••'}
          </span>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-md p-[0.35rem] text-(--color-text-secondary) transition-colors duration-150 ease-out hover:text-(--color-text)"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Badge de Cero Conocimiento */}
        <div className="flex items-center gap-[0.4rem] text-[0.75rem] text-(--color-success)">
          <ShieldCheck className="h-4 w-4" />
          <span>Generación 100% local (sin servidores ni internet)</span>
        </div>

        {/* Botones de acción */}
        <div className="mt-1 flex w-full gap-3">
          <div className="flex-1">
            <CopyButton text={value} full label="Copiar texto" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-[10px] border border-(--color-border) px-5 py-[0.6rem] text-center text-[0.85rem] font-semibold text-(--color-text-secondary) transition-colors duration-150 ease-out hover:bg-white/8 hover:text-(--color-text)"
          >
            Cerrar
          </button>
        </div>
      </div>
    </dialog>
  )
}