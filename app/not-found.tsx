import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-[2rem_1rem] text-center">
      <div
        aria-hidden="true"
        className="mb-4 text-[3rem] [filter:drop-shadow(0_0_20px_rgba(99,102,241,0.3))]"
      >
        🔐
      </div>
      <h1 className="mb-2 bg-clip-text text-[2rem] font-extrabold tracking-[-0.03em] text-transparent [background-image:linear-gradient(135deg,#e2e2f0,#a78bfa)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
        404 — Página no encontrada
      </h1>
      <p className="mb-8 max-w-[420px] text-[0.95rem] text-(--color-text-secondary)">
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
