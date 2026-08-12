'use client'

import { useEffect, useId, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Borrar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        margin: "auto",
        padding: "2rem",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        backdropFilter: "blur(16px)",
        boxShadow: "var(--glass-shadow), 0 0 0 100vw rgba(0,0,0,0.5)",
        maxWidth: "380px",
        width: "90vw",
        color: "var(--color-text)",
        fontFamily: "var(--font-sans)",
        zIndex: 9999,
      }}
      aria-labelledby={titleId}
      aria-describedby={messageId}
    >
      <p
        id={titleId}
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          marginBottom: "0.75rem",
        }}
      >
        {title}
      </p>
      <p
        id={messageId}
        style={{
          fontSize: "0.85rem",
          color: "var(--color-text-secondary)",
          marginBottom: "1.5rem",
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.75rem",
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            all: "unset",
            cursor: "pointer",
            padding: "0.5rem 1.25rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "var(--color-text-secondary)",
            transition: "color, background-color var(--duration-fast) var(--ease-out)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-accent-soft)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          style={{
            all: "unset",
            cursor: "pointer",
            padding: "0.5rem 1.25rem",
            borderRadius: "var(--radius-sm)",
            background: "var(--color-error)",
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 600,
            transition: "opacity var(--duration-fast) var(--ease-out)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
