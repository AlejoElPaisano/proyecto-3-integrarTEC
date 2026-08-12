'use client'

import { cn } from "@/shared/lib/cn"

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
      className={cn(
        "flex items-center justify-between rounded-[10px] p-[0.6rem_0.85rem] transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]",
        checked
          ? "border border-[rgba(236,72,153,0.25)] bg-[rgba(236,72,153,0.08)]"
          : "border border-(--color-border) bg-(--color-surface)",
      )}
    >
      <div>
        <label
          htmlFor={id}
          className="flex cursor-pointer items-center gap-2 text-[0.875rem] font-semibold text-(--color-text)"
        >
          <span className="text-[0.9rem]">
            {id === "includeNumbers"
              ? "🔢"
              : id === "includeSymbols"
                ? "🔣"
                : "🔠"}
          </span>
          {label}
        </label>
        <p className="ml-[1.4rem] mt-[0.15rem] text-[0.75rem] text-(--color-text-secondary)">
          {description}
        </p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-[2.75rem] shrink-0 cursor-pointer items-center rounded-full border-none p-[2px] transition-[background] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
          checked ? "bg-(--gradient-cta)" : "bg-(--color-text-tertiary)",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white [box-shadow:0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)]",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  )
}

export const ToggleOption = Toggle
export type ToggleOptionProps = ToggleProps
