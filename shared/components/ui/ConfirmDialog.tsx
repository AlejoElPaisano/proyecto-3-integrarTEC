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
      className="fixed inset-0 m-auto z-[9999] flex w-[90vw] max-w-[380px] flex-col rounded-(--radius-lg) border border-(--color-border) bg-(--color-card) p-8 font-sans text-(--color-text) backdrop-blur-2xl [box-shadow:var(--glass-shadow),0_0_0_100vw_rgba(0,0,0,0.5)]"
      aria-labelledby={titleId}
      aria-describedby={messageId}
    >
      <p id={titleId} className="mb-3 text-[1.1rem] font-bold text-(--color-text)">
        {title}
      </p>
      <p
        id={messageId}
        className="mb-6 text-[0.85rem] leading-[1.5] text-(--color-text-secondary)"
      >
        {message}
      </p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-(--radius-sm) border border-(--color-border) bg-transparent px-5 py-2 text-[0.85rem] font-medium text-(--color-text-secondary) transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-(--color-accent-soft)"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="cursor-pointer rounded-(--radius-sm) border-0 bg-(--color-error) px-5 py-2 text-[0.85rem] font-semibold text-white transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:opacity-85"
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
