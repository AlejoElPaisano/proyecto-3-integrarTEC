'use client'

import { useState } from "react";
import { CopyButton } from "@/shared/components/ui/CopyButton";
import { QRCodeButton } from "@/shared/components/ui/QRCodeButton";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";

interface PasswordActionsProps {
	password: string;
	bits: number;
	strength: string;
	wordCount: number;
	onRegenerate: () => void;
}

export function PasswordActions({
	password,
	bits,
	strength,
	wordCount,
	onRegenerate,
}: PasswordActionsProps) {
	const [saved, setSaved] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const { addFavorite } = useFavorites();

	async function handleSaveFavorite() {
		setSaveError(null);
		try {
			await addFavorite(password, password, {
				bits,
				strength: strength as "weak" | "medium" | "strong" | "very-strong",
				wordCount,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} catch (error) {
			setSaved(false);
			setSaveError(
				error instanceof Error && error.message
					? `No se pudo guardar la favorita: ${error.message}`
					: "No se pudo guardar la favorita. Intenta nuevamente.",
			);
		}
	}

	return (
		<>
			<div
				style={{
					fontFamily: "var(--font-mono)",
					fontSize: "1.4rem",
					fontWeight: 700,
					letterSpacing: "-0.01em",
					padding: "1.25rem 1.5rem",
					background: "rgba(0,0,0,0.3)",
					border: "1px solid var(--color-border)",
					borderRadius: "14px",
					wordBreak: "break-all",
					lineHeight: 1.5,
					userSelect: "all",
					textAlign: "center",
					color: "var(--color-text)",
					minHeight: "4rem",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{password ?? "Generando…"}
			</div>

			<div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
				<button
					type="button"
					onClick={onRegenerate}
					style={{
						all: "unset",
						cursor: "pointer",
						flex: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "0.4rem",
						padding: "0.85rem",
						borderRadius: "12px",
						background: "var(--gradient-blue)",
						color: "#fff",
						fontSize: "0.9rem",
						fontWeight: 600,
						fontFamily: "var(--font-sans)",
						transition:
							"transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.boxShadow =
							"0 4px 20px rgba(99,102,241,0.3)";
						e.currentTarget.style.transform = "translateY(-1px)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.boxShadow = "";
						e.currentTarget.style.transform = "";
					}}
				>
					🔄 Generar nueva
				</button>

				<button
					type="button"
					onClick={handleSaveFavorite}
					disabled={!password || saved}
					aria-label={saved ? "Favorita guardada" : "Guardar como favorita"}
					aria-live="polite"
					style={{
						all: "unset",
						cursor: "pointer",
						padding: "0.85rem 1rem",
						borderRadius: "12px",
						border: "1px solid var(--color-border)",
						background: saved ? "var(--color-success-soft)" : "transparent",
						color: saved
							? "var(--color-success)"
							: "var(--color-text)",
						fontSize: "0.9rem",
						fontWeight: 600,
						fontFamily: "var(--font-sans)",
						opacity: !password ? 0.5 : 1,
						transition:
							"border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)",
					}}
					onMouseEnter={(e) => {
						if (password && !saved) {
							e.currentTarget.style.borderColor =
								"var(--color-accent)";
							e.currentTarget.style.background =
								"var(--color-accent-soft)";
						}
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.borderColor = "var(--color-border)";
						e.currentTarget.style.background = saved
							? "var(--color-success-soft)"
							: "transparent";
					}}
				>
					{saved ? "⭐ Guardada" : "⭐ Guardar"}
				</button>

				<QRCodeButton value={password} label="QR" />

				<CopyButton text={password} full label="Copiar" />
			</div>
			{saveError && (
				<p
					role="alert"
					style={{
						marginTop: "0.5rem",
						color: "var(--color-error)",
						fontSize: "0.75rem",
						textAlign: "center",
					}}
				>
					{saveError}
				</p>
			)}
		</>
	);
}
