'use client'

export interface ToggleProps {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}

export function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 0.85rem",
        borderRadius: "10px",
        background: "transparent",
        border: "1px solid var(--color-border)",
        transition: "color, background-color, border-color, box-shadow var(--duration-fast) var(--ease-out)",
      }}
    >
      <div>
        <label
          htmlFor={id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--color-text)",
          }}
        >
          <span style={{ fontSize: "0.9rem" }}>
            {id === "includeNumbers"
              ? "🔢"
              : id === "includeSymbols"
                ? "🔣"
                : "🔠"}
          </span>
          {label}
        </label>
        <p
          style={{
            marginTop: "0.15rem",
            fontSize: "0.75rem",
            color: "var(--color-text-secondary)",
            marginLeft: "1.4rem",
          }}
        >
          {description}
        </p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-(--radius-pill) border-none transition-colors duration-[var(--duration-fast)] ease-(--ease-out) focus:shadow-[0_0_0_2px_var(--color-surface),0_0_0_4px_var(--color-accent)] focus:outline-none ${
          checked ? "bg-(--color-accent)" : "bg-(--color-text-tertiary)"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-[var(--duration-fast)] ease-(--ease-out) ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}

export const ToggleOption = Toggle
export type ToggleOptionProps = ToggleProps
