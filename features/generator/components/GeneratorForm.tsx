'use client'

import { useEffect, useState } from "react";
import { usePasswordStore } from "@/features/generator/store";
import type { PasswordConfig } from "@/features/generator/types";
import { CategoryChips } from "@/features/generator/components/CategoryChips";
import { Toggle } from "@/shared/components/ui/Toggle";

export function GeneratorForm({ onSettingChange }: { onSettingChange?: (key: string) => void }) {
	const config = usePasswordStore((state) => state.config);
	const generate = usePasswordStore((state) => state.generate);
	const setStep = usePasswordStore((state) => state.setStep);
	const setConfig = usePasswordStore((state) => state.setConfig);

	const [showAdvanced, setShowAdvanced] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setShowAdvanced(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const updateOption = <K extends keyof PasswordConfig>(
		key: K,
		value: PasswordConfig[K],
	) => {
		setConfig({ [key]: value });
	};

	const handleGenerate = () => {
		generate();
		setStep(3);
	};

	const btnStyles = `
.btn-generate {
  all: unset;
  cursor: pointer;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 14px;
  background: linear-gradient(135deg, #ec4899, #818cf8);
  color: #fff;
  font-size: 1.125rem;
  font-weight: 700;
  font-family: var(--font-sans);
  transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}
.btn-generate:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(236,72,153,0.35);
}
`;

	return (
		<>
			<style>{btnStyles}</style>
		<div
			style={{
				borderRadius: "var(--radius-lg)",
				border: "1px solid var(--color-border)",
				background: "var(--color-card)",
				padding: "1.25rem",
				boxShadow: "var(--glass-shadow)",
			}}
		>
			<h2
				style={{
					fontSize: "1.125rem",
					fontWeight: 600,
					color: "var(--color-text)",
					marginBottom: "0.75rem",
				}}
			>
				Personalizá tu contraseña
			</h2>

			<div
				style={{
					padding: "0.75rem 1rem",
					borderRadius: "12px",
					background: "transparent",
					border: "1px solid var(--color-border)",
					marginBottom: "0.5rem",
				}}
			>
				<label
					htmlFor="wordCount"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						marginBottom: "0.5rem",
						fontSize: "0.875rem",
						fontWeight: 500,
						color: "var(--color-text-secondary)",
					}}
				>
					<span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
						<span style={{ fontSize: "1rem" }}>📝</span>
						Cantidad de palabras
					</span>
					<span style={{ fontWeight: 700, color: "var(--color-accent)" }}>
						{config.wordCount}
					</span>
				</label>
				<input
					id="wordCount"
					type="range"
					min={2}
					max={6}
					step={1}
					value={config.wordCount}
					onChange={(e) => { updateOption("wordCount", Number(e.target.value)); onSettingChange?.("wordCount"); }}
					className="w-full cursor-pointer"
				/>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginTop: "0.5rem",
						fontSize: "0.75rem",
						color: "var(--color-text-tertiary)",
					}}
				>
					<span>2</span>
					<span>4</span>
					<span>6</span>
				</div>
			</div>

			<div
				style={{
					padding: "0.75rem 1rem",
					borderRadius: "12px",
					background: "transparent",
					border: "1px solid var(--color-border)",
					marginBottom: "0.5rem",
				}}
			>
				<label
					htmlFor="separator"
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
						marginBottom: "0.5rem",
						fontSize: "0.875rem",
						fontWeight: 500,
						color: "var(--color-text-secondary)",
					}}
				>
					<span style={{ fontSize: "1rem" }}>🔗</span>
					Separador
				</label>
				<select
					id="separator"
					value={config.separator}
					onChange={(e) => { updateOption("separator", e.target.value); onSettingChange?.("separator"); }}
					className="w-full cursor-pointer rounded-[12px] border border-(--color-border) bg-(--color-surface) px-3 py-2.5 font-sans text-sm text-(--color-text) transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-(--ease-out) focus:border-(--color-border-focus) focus:shadow-[0_0_0_1px_var(--color-border-focus)] focus:outline-none"
				>
					<option value="-">Guión ( - )</option>
					<option value=".">Punto ( . )</option>
					<option value="_">Guión bajo ( _ )</option>
					<option value=" ">Espacio</option>
				</select>
			</div>

			<div
				style={{
					padding: "0.75rem 1rem",
					borderRadius: "12px",
					background: "transparent",
					border: "1px solid var(--color-border)",
					marginBottom: "0.5rem",
				}}
			>
				<button
					type="button"
					onClick={() => setShowAdvanced(!showAdvanced)}
					style={{
						all: "unset",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
						marginBottom: showAdvanced ? "1rem" : 0,
						fontSize: "0.875rem",
						fontWeight: 600,
						color: "var(--color-accent)",
						transition: "color var(--duration-fast) var(--ease-out)",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.color = "var(--color-accent-hover)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.color = "var(--color-accent)";
					}}
				>
					<span style={{ fontSize: "1rem" }}>⚙️</span>
					{showAdvanced
						? "Ocultar opciones avanzadas ↑"
						: "Ver opciones avanzadas ↓"}
				</button>

				{showAdvanced && (
					<div className="flex flex-col gap-3">
						<Toggle
							id="includeNumbers"
							label="Incluir números"
							description="Agrega un número al final (ej: 42)"
							checked={config.includeNumbers}
							onChange={(val) => { updateOption("includeNumbers", val); onSettingChange?.(val ? "includeNumbers" : "noNumbers"); }}
						/>
						<Toggle
							id="includeSymbols"
							label="Incluir símbolos"
							description="Agrega un símbolo especial (ej: !)"
							checked={config.includeSymbols}
							onChange={(val) => { updateOption("includeSymbols", val); onSettingChange?.(val ? "includeSymbols" : "noSymbols"); }}
						/>
						<Toggle
							id="capitalize"
							label="Capitalizar"
							description="Primera letra en mayúscula"
							checked={config.capitalize}
							onChange={(val) => { updateOption("capitalize", val); onSettingChange?.(val ? "capitalize" : "noCapitalize"); }}
						/>
					</div>
				)}
			</div>

			<div
				style={{
					padding: "0.75rem 1rem",
					borderRadius: "12px",
					background: "transparent",
					border: "1px solid var(--color-border)",
					marginBottom: "0.5rem",
				}}
			>
				<p
					style={{
						fontSize: "0.8rem",
						color: "var(--color-text-secondary)",
						marginBottom: "0.5rem",
						fontWeight: 500,
					}}
				>
					Elegí las categorías que quieras incluir:
				</p>
				<CategoryChips />
			</div>

			<button
				type="button"
				onClick={handleGenerate}
				className="btn-generate"
				aria-label="Generar contraseña con las opciones seleccionadas"
			>
				✨ Generar frase mágica
			</button>
		</div>
		</>
	);
}
