import Link from "next/link"

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        textAlign: "center",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          filter: "drop-shadow(0 0 20px rgba(99,102,241,0.3))",
        }}
      >
        🔐
      </div>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          background: "linear-gradient(135deg, #e2e2f0, #a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "0.5rem",
        }}
      >
        404 — Página no encontrada
      </h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "0.95rem",
          maxWidth: "420px",
          marginBottom: "2rem",
        }}
      >
        La frase que buscás no existe o fue movida. Volvé al generador para crear
        una nueva contraseña segura.
      </p>
      <Link
        href="/"
        className="rounded-sm border border-(--color-border) px-4 py-2 text-[0.9rem] font-medium text-(--color-accent) no-underline transition-colors duration-[var(--duration-fast)] hover:border-(--color-accent) hover:bg-(--color-accent-soft)"
      >
        ← Volver al inicio
      </Link>
    </div>
  )
}
