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
        className="transition-colors duration-150 ease-out hover:border-accent hover:bg-accent-soft"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          padding: "0.5rem 1.25rem",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--color-border)",
          background: "transparent",
          color: "var(--color-accent)",
          fontSize: "0.9rem",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        ← Volver al inicio
      </Link>
    </div>
  )
}
