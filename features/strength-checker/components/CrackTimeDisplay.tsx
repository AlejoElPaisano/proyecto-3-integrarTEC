'use client'

interface CrackTimeDisplayProps {
  online: string
  offline: string
}

const cardClass =
  "flex flex-col gap-1 rounded-(--radius-lg) border border-(--color-border) bg-(--color-accent-soft) p-3"

const labelClass =
  "flex items-center gap-1.5 text-[0.7rem] font-medium text-(--color-text-secondary)"

const valueClass = "font-mono text-sm font-bold text-(--color-text)"

const noteClass = "text-[0.65rem] text-(--color-text-tertiary)"

export function CrackTimeDisplay({ online, offline }: CrackTimeDisplayProps) {
  return (
    <div
      role="group"
      aria-labelledby="crack-time-heading"
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
    >
      <h3 id="crack-time-heading" className="sr-only">
        Tiempo estimado de crackeo
      </h3>

      <div className={cardClass}>
        <span className={labelClass}>
          <span aria-hidden="true">🌐</span> Ataque online
        </span>
        <span className={valueClass}>
          {online}
        </span>
        <span className={noteClass}>
          Supone rate-limit moderado (10^10 intentos/seg)
        </span>
      </div>

      <div className={cardClass}>
        <span className={labelClass}>
          <span aria-hidden="true">💻</span> Ataque offline (GPU)
        </span>
        <span className={valueClass}>
          {offline}
        </span>
        <span className={noteClass}>
          Supone un rig de GPUs moderno (10^12 intentos/seg)
        </span>
      </div>
    </div>
  )
}
