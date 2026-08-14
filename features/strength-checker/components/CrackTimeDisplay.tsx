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
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "0.75rem",
      }}
    >
      <h3 id="crack-time-heading" className="sr-only">
        Tiempo estimado de crackeo
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          background: "var(--color-accent-soft)",
          border: "1px solid var(--color-border)",
          borderRadius: "14px",
          padding: "0.85rem 1rem",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.825rem",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
          }}
        >
          <span aria-hidden="true">🌐</span> Ataque online
        </span>
        <span
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
          }}
        >
          {online}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            lineHeight: 1.4,
            color: "var(--color-text-tertiary)",
          }}
        >
          Supone rate-limit moderado (10^10 intentos/seg)
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          background: "var(--color-accent-soft)",
          border: "1px solid var(--color-border)",
          borderRadius: "14px",
          padding: "0.85rem 1rem",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.825rem",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
          }}
        >
          <span aria-hidden="true">💻</span> Ataque offline (GPU)
        </span>
        <span
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
          }}
        >
          {offline}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            lineHeight: 1.4,
            color: "var(--color-text-tertiary)",
          }}
        >
          Supone un rig de GPUs moderno (10^12 intentos/seg)
        </span>
      </div>
    </div>
  )
}
