export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4 p-[2rem_1rem]"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        aria-hidden="true"
        className="text-[2.5rem] [animation:fadeIn_600ms_ease-out]"
      >
        🔐
      </div>
      <span className="text-[0.9rem] text-(--color-text-secondary)">
        Cargando PassFrases…
      </span>
      <div
        aria-hidden="true"
        className="relative h-[6px] w-[180px] overflow-hidden rounded-(--radius-pill) bg-(--color-accent-soft)"
      >
        <div className="absolute inset-0 w-2/5 bg-[linear-gradient(90deg,transparent,var(--color-accent),transparent)] [animation:pf-loading-slide_1.1s_var(--ease-out)_infinite]" />
      </div>
    </div>
  )
}
