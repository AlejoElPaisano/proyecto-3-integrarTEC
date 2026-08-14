'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { CopyButton } from './CopyButton';
import { Eye, EyeOff, QrCode, X, Smartphone, ShieldCheck } from 'lucide-react';

interface QRCodeModalProps {
  open: boolean;
  value: string;
  onClose: () => void;
}

export function QRCodeModal({ open, value, onClose }: QRCodeModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (open && !el.open) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      el.showModal();
      setShowPassword(false);
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open || !value || !canvasRef.current) return;

    setQrError(null);
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
          setQrError('No se pudo generar el código QR. La frase puede ser demasiado larga.');
        }
      },
    );
  }, [open, value]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="qr-title"
      aria-describedby="qr-instructions"
      style={{
        position: 'fixed',
        inset: 0,
        margin: 'auto',
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg, 16px)',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'var(--glass-shadow), 0 0 0 100vw rgba(0,0,0,0.65)',
        maxWidth: '420px',
        width: '92vw',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-sans)',
        zIndex: 9999,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <QrCode className="h-5 w-5" style={{ color: 'var(--color-accent)' }} />
          <h2
            id="qr-title"
            style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}
          >
            Transferir al Celular
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="flex cursor-pointer items-center justify-center rounded-full p-[0.4rem] text-text-secondary transition-colors duration-150 ease-out hover:bg-white/10 hover:text-text"
          style={{ all: 'unset' }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        {/* Contenedor del QR Canvas */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px',
            background: '#ffffff',
            padding: '0.75rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ display: qrError ? 'none' : 'block', borderRadius: '8px' }}
          />
          {qrError && (
            <div
              style={{
                maxWidth: '240px',
                padding: '1rem',
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'var(--color-error)',
              }}
            >
              {qrError}
            </div>
          )}
        </div>

        {/* Instrucción rápida */}
        <div
          id="qr-instructions"
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: '10px',
            border: '1px solid rgba(129,140,248,0.2)',
            background: 'rgba(129,140,248,0.1)',
            padding: '0.6rem 0.85rem',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Smartphone className="h-4 w-4 shrink-0" style={{ color: 'var(--color-accent)' }} />
          <span>Escanea la pantalla con la cámara de tu celular para copiar la frase al instante.</span>
        </div>

        {/* Vista previa de la contraseña */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            background: 'rgba(0,0,0,0.25)',
            padding: '0.75rem 1rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              fontWeight: 600,
              wordBreak: 'break-all',
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
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-md p-[0.35rem] text-text-secondary transition-colors duration-150 ease-out hover:text-text"
            style={{ all: 'unset' }}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Badge de Cero Conocimiento */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: 'var(--color-success)',
          }}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Generación 100% local (sin servidores ni internet)</span>
        </div>

        {/* Botones de acción */}
        <div style={{ marginTop: '0.25rem', display: 'flex', width: '100%', gap: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <CopyButton text={value} full label="Copiar texto" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="transition-colors duration-150 ease-out hover:bg-white/10 hover:text-text"
            style={{
              all: 'unset',
              cursor: 'pointer',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              padding: '0.6rem 1.25rem',
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </dialog>
  );
}