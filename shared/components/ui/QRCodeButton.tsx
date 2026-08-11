'use client';

import { useState } from "react";
import { QrCode } from "lucide-react";
import { QRCodeModal } from "./QRCodeModal";

interface QRCodeButtonProps {
  value: string;
  label?: string;
  disabled?: boolean;
}

export function QRCodeButton({ value, label = "Ver QR", disabled = false }: QRCodeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabled || !value}
        aria-label="Mostrar código QR para escanear en celular"
        title="Mostrar código QR para transferir al celular"
        style={{
          all: "unset",
          cursor: disabled || !value ? "not-allowed" : "pointer",
          opacity: disabled || !value ? 0.5 : 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          padding: "0.85rem 1rem",
          borderRadius: "12px",
          border: "1px solid var(--color-border, rgba(255,255,255,0.1))",
          background: "transparent",
          color: "var(--color-text, #f8fafc)",
          fontSize: "0.9rem",
          fontWeight: 600,
          fontFamily: "var(--font-sans)",
          transition: "border-color 0.2s, background 0.2s, color 0.2s, transform 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!disabled && value) {
            e.currentTarget.style.borderColor = "var(--color-accent, #6366f1)";
            e.currentTarget.style.background = "var(--color-accent-soft, rgba(99,102,241,0.1))";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border, rgba(255,255,255,0.1))";
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.transform = "";
        }}
      >
        <QrCode className="w-4 h-4 shrink-0" />
        <span>{label}</span>
      </button>

      <QRCodeModal open={isOpen} value={value} onClose={() => setIsOpen(false)} />
    </>
  );
}
