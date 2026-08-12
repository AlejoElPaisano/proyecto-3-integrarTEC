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
        padding: "0.6rem 0.85rem",
        borderRadius: "10px",
        background: checked ? "rgba(236, 72, 153, 0.08)" : "var(--color-surface)",
        border: checked ? "1px solid rgba(236, 72, 153, 0.25)" : "1px solid var(--color-border)",
        transition: "all var(--duration-fast) var(--ease-out)",
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
        style={{
          position: "relative",
          display: "inline-flex",
          height: "1.5rem",
          width: "2.75rem",
          flexShrink: 0,
          alignItems: "center",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          background: checked ? "linear-gradient(135deg, #ec4899, #818cf8)" : "var(--color-text-tertiary)",
          transition: "background var(--duration-fast) var(--ease-out)",
          padding: "2px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            height: "1.25rem",
            width: "1.25rem",
            borderRadius: "50%",
            background: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            transform: checked ? "translateX(1.25rem)" : "translateX(0)",
            transition: "transform var(--duration-fast) var(--ease-out)",
          }}
        />
      </button>
    </div>
  )
}

export const ToggleOption = Toggle
export type ToggleOptionProps = ToggleProps
