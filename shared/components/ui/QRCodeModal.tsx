'use client';

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { CopyButton } from "./CopyButton";
import { Eye, EyeOff, QrCode, X, Smartphone, ShieldCheck } from "lucide-react";

interface QRCodeModalProps {
  open: boolean;
  value: string;
  onClose: () => void;
}

export function QRCodeModal({ open, value, onClose }: QRCodeModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (open && !el.open) {
      el.showModal();
      setShowPassword(false);
    } else if (!open && el.open) {
      el.close();
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
          dark: "#0f172a",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      },
      (error) => {
        if (error) {
          console.error("Error al generar código QR:", error);
          setQrError("No se pudo generar el código QR. La frase puede ser demasiado larga.");
        }
      }
    );
  }, [open, value]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      style={{
        position: "fixed",
        inset: 0,
        margin: "auto",
        padding: "1.75rem",
        borderRadius: "var(--radius-lg, 16px)",
        background: "var(--color-card, #1e293b)",
        border: "1px solid var(--color-border, rgba(255,255,255,0.1))",
        backdropFilter: "blur(16px)",
        boxShadow: "var(--glass-shadow, 0 20px 40px rgba(0,0,0,0.5)), 0 0 0 100vw rgba(0,0,0,0.65)",
        maxWidth: "420px",
        width: "92vw",
        color: "var(--color-text, #f8fafc)",
        fontFamily: "var(--font-sans)",
        zIndex: 9999,
      }}
      aria-labelledby="qr-title"
      aria-describedby="qr-instructions"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <QrCode className="w-5 h-5" style={{ color: "var(--color-accent, #6366f1)" }} />
          <h2 id="qr-title" style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
            Transferir al Celular
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          style={{
            all: "unset",
            cursor: "pointer",
            padding: "0.4rem",
            borderRadius: "50%",
            color: "var(--color-text-secondary, #94a3b8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--color-text-secondary, #94a3b8)";
          }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Contenedor del QR Canvas */}
        <div
          style={{
            background: "#ffffff",
            padding: "0.75rem",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <canvas ref={canvasRef} style={{ display: qrError ? "none" : "block", borderRadius: "8px" }} />
          {qrError && (
            <div style={{ color: "#ef4444", fontSize: "0.85rem", padding: "1rem", textAlign: "center", maxWidth: "240px" }}>
              {qrError}
            </div>
          )}
        </div>

        {/* Instrucción rápida */}
        <div
          id="qr-instructions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.82rem",
            color: "var(--color-text-secondary, #94a3b8)",
            textAlign: "center",
            background: "rgba(99, 102, 241, 0.1)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            padding: "0.6rem 0.85rem",
            borderRadius: "10px",
            width: "100%",
          }}
        >
          <Smartphone className="w-4 h-4 shrink-0" style={{ color: "#818cf8" }} />
          <span>Escanea la pantalla con la cámara de tu celular para copiar la frase al instante.</span>
        </div>

        {/* Vista previa de la contraseña */}
        <div
          style={{
            width: "100%",
            background: "rgba(0,0,0,0.25)",
            border: "1px solid var(--color-border, rgba(255,255,255,0.1))",
            borderRadius: "12px",
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              fontWeight: 600,
              wordBreak: "break-all",
              color: showPassword ? "var(--color-text, #f8fafc)" : "var(--color-text-secondary, #94a3b8)",
              letterSpacing: showPassword ? "normal" : "0.15em",
            }}
          >
            {showPassword ? value : "••••••••••••••••"}
          </span>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "0.35rem",
              borderRadius: "6px",
              color: "var(--color-text-secondary, #94a3b8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Badge de Cero Conocimiento */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.75rem",
            color: "var(--color-success, #10b981)",
          }}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Generación 100% local (sin servidores ni internet)</span>
        </div>

        {/* Botones de acción */}
        <div style={{ display: "flex", gap: "0.75rem", width: "100%", marginTop: "0.25rem" }}>
          <div style={{ flex: 1 }}>
            <CopyButton text={value} full label="Copiar texto" />
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "0.6rem 1.25rem",
              borderRadius: "10px",
              border: "1px solid var(--color-border, rgba(255,255,255,0.1))",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--color-text-secondary, #94a3b8)",
              textAlign: "center",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-secondary, #94a3b8)";
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </dialog>
  );
}
