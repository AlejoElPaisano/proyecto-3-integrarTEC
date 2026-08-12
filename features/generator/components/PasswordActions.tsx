'use client'

import { useState } from "react";
import { CopyButton } from "@/shared/components/ui/CopyButton";
import { QRCodeButton } from "@/shared/components/ui/QRCodeButton";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { cn } from "@/shared/lib/cn";

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
			<div className="flex min-h-16 items-center justify-center break-all rounded-[14px] border border-(--color-border) bg-black/30 p-[1.25rem_1.5rem] text-center font-mono text-[1.4rem] font-bold tracking-[-0.01em] leading-[1.5] text-(--color-text) [user-select:all]">
				{password ?? "Generando…"}
			</div>

			<div className="mt-2 flex gap-3">
				<button
					type="button"
					onClick={onRegenerate}
					className="flex flex-1 cursor-pointer items-center justify-center gap-[0.4rem] rounded-xl bg-(--gradient-blue) p-[0.85rem] font-sans text-[0.9rem] font-semibold text-white transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
				>
					🔄 Generar nueva
				</button>

			<button
				type="button"
				onClick={handleSaveFavorite}
				disabled={!password || saved}
				aria-label={saved ? "Favorita guardada" : "Guardar como favorita"}
				className={cn(
					"cursor-pointer rounded-xl border border-(--color-border) px-[1rem] py-[0.85rem] font-sans text-[0.9rem] font-semibold transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
					saved
						? "bg-(--color-success-soft) text-(--color-success)"
						: "bg-transparent text-(--color-text) hover:border-(--color-accent) hover:bg-(--color-accent-soft)",
					!password && "opacity-50",
				)}
			>
				{saved ? "⭐ Guardada" : "⭐ Guardar"}
			</button>
			<span role="status" aria-live="polite" className="sr-only">
				{saved ? "La favorita fue guardada correctamente." : ""}
			</span>

				<QRCodeButton value={password} label="QR" />

				<CopyButton text={password} full label="Copiar" />
			</div>
			{saveError && (
				<p
					role="alert"
					className="mt-2 text-center text-[0.75rem] text-(--color-error)"
				>
					{saveError}
				</p>
			)}
		</>
	);
}
