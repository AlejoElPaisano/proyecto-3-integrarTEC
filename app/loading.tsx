export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem 1rem",
      }}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        aria-hidden="true"
        style={{
          fontSize: "2.5rem",
          animation: "fadeIn 600ms ease-out",
        }}
      >
        🔐
      </div>
      <span
        style={{
          fontSize: "0.9rem",
          color: "var(--color-text-secondary)",
        }}
      >
        Cargando PassFrases…
      </span>
      <div
        aria-hidden="true"
        style={{
          width: "180px",
          height: "6px",
          borderRadius: "var(--radius-pill)",
          background: "var(--color-accent-soft)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "40%",
            background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
            animation: "pf-loading-slide 1.1s var(--ease-out) infinite",
          }}
        />
      </div>
      <style>{`
        @keyframes pf-loading-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  )
}