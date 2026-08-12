'use client'

interface CrackTimeDisplayProps {
  online: string
  offline: string
}

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

      <div
        className="flex flex-col gap-1 rounded-lg p-3"
        style={{
          background: 'var(--color-accent-soft)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <span
          className="flex items-center gap-1.5 text-[0.7rem] font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <span aria-hidden="true">🌐</span> Ataque online
        </span>
        <span
          className="font-mono text-sm font-bold"
          style={{ color: 'var(--color-text)' }}
        >
          {online}
        </span>
        <span
          className="text-[0.65rem]"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Supone rate-limit moderado (10^10 intentos/seg)
        </span>
      </div>

      <div
        className="flex flex-col gap-1 rounded-lg p-3"
        style={{
          background: 'var(--color-accent-soft)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <span
          className="flex items-center gap-1.5 text-[0.7rem] font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <span aria-hidden="true">💻</span> Ataque offline (GPU)
        </span>
        <span
          className="font-mono text-sm font-bold"
          style={{ color: 'var(--color-text)' }}
        >
          {offline}
        </span>
        <span
          className="text-[0.65rem]"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Supone un rig de GPUs moderno (10^12 intentos/seg)
        </span>
      </div>
    </div>
  )
}
