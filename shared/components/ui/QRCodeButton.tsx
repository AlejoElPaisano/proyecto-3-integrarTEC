'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { QrCode } from 'lucide-react';

const QRCodeModal = dynamic(() => import('./QRCodeModal').then((m) => m.QRCodeModal), {
  ssr: false,
  loading: () => null,
});

interface QRCodeButtonProps {
  value: string;
  label?: string;
  disabled?: boolean;
  full?: boolean;
  ariaLabel?: string;
}

export function QRCodeButton({
  value,
  label = 'Ver QR',
  disabled = false,
  full = false,
  ariaLabel,
}: QRCodeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDisabled = disabled || !value;

  return (
    <div style={{ flex: full ? 1 : undefined, display: full ? 'flex' : 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={isDisabled}
        aria-label={ariaLabel ?? 'Mostrar código QR para escanear en celular'}
        title="Mostrar código QR para transferir al celular"
        className="transition-all duration-150 ease-out hover:border-accent hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          all: 'unset',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          padding: '0.85rem 1rem',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          background: 'transparent',
          color: 'var(--color-text)',
          fontSize: '0.9rem',
          fontWeight: 600,
          fontFamily: 'var(--font-sans)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          width: full ? '100%' : 'auto',
          boxSizing: 'border-box',
        }}
      >
        <QrCode className="h-4 w-4 shrink-0" />
        {label && <span>{label}</span>}
      </button>

      <QRCodeModal open={isOpen} value={value} onClose={() => setIsOpen(false)} />
    </div>
  );
}