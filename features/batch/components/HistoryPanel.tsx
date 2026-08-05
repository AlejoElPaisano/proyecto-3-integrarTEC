'use client'

import { useState } from "react";
import { usePathname } from "next/navigation";
import { usePasswordStore } from "@/features/generator/store";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { FavoritesPanel } from "@/features/favorites/components/FavoritesPanel";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { useHasMounted } from "@/shared/hooks/useHasMounted";

function timeAgo(date: number): string {
	const sec = Math.floor((Date.now() - date) / 1000);
	if (sec < 5) return "recién";
	if (sec < 60) return `hace ${sec} seg`;
	const min = Math.floor(sec / 60);
	if (min === 1) return "hace 1 min";
	if (min < 60) return `hace ${min} min`;
	const hrs = Math.floor(min / 60);
	return `hace ${hrs} ${hrs === 1 ? "hora" : "horas"}`;
}

export default function HistoryPanel() {
	const hasMounted = useHasMounted();
	const pathname = usePathname();
	const sessionHistory = usePasswordStore((state) => state.sessionHistory);
	const clearHistory = usePasswordStore((state) => state.clearHistory);
	const removeFromHistory = usePasswordStore((state) => state.removeFromHistory);
	const historyOpen = usePasswordStore((state) => state.historyOpen);
	const toggleHistory = usePasswordStore((state) => state.toggleHistory);
	const hideButton = pathname === "/generator";
	const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
	const [copyErrorId, setCopyErrorId] = useState<string | null>(null);
	const [view, setView] = useState<"history" | "favorites">("history");
	const [confirmAction, setConfirmAction] = useState<{
		type: "clear" | "entry" | "favorite";
		id?: string;
	} | null>(null);

	const { favorites, removeFavorite } = useFavorites();

	function handleConfirmClear() {
		clearHistory();
		setConfirmAction(null);
	}

	function handleConfirmRemoveEntry() {
		if (confirmAction?.id) removeFromHistory(confirmAction.id);
		setConfirmAction(null);
	}

	function handleConfirmRemoveFavorite() {
		if (confirmAction?.id) removeFavorite(confirmAction.id);
		setConfirmAction(null);
	}

	function handleCancelConfirm() {
		setConfirmAction(null);
	}

	async function handleCopy(password: string, id: string) {
		setCopyErrorId(null);
		try {
			if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable")
			await navigator.clipboard.writeText(password)
			setCopiedIndex(id);
			setTimeout(() => setCopiedIndex(null), 2000);
		} catch {
			setCopiedIndex(null);
			setCopyErrorId(id);
		}
	}

	if (!hasMounted) return null;

	return (
		<>
			{!hideButton && (
				<button
					type="button"
					onClick={toggleHistory}
					aria-label="Abrir historial de sesión"
					aria-expanded={historyOpen}
					className="fixed bottom-6 right-6 z-[999] grid h-13 w-13 cursor-pointer place-items-center rounded-full border-none bg-[var(--gradient-cta)] text-lg text-white shadow-[0_4px_24px_var(--color-pink-glow)] transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-(--ease-out) hover:scale-110 hover:shadow-[0_6px_32px_var(--color-pink-glow)]"
				>
					{view === "favorites" ? "⭐" : "🤖"}
					{sessionHistory.length > 0 && view === "history" && (
						<span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-(--color-surface) bg-(--color-pink) font-mono text-[0.65rem] font-bold text-white">
							{sessionHistory.length}
						</span>
					)}
					{favorites.length > 0 && view === "favorites" && (
						<span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-(--color-surface) bg-(--color-pink) font-mono text-[0.65rem] font-bold text-white">
							{favorites.length}
						</span>
					)}
				</button>
			)}

			{historyOpen && (
				<div
					className="fixed inset-x-2 bottom-24 z-[1000] flex max-h-[min(70vh,460px)] w-[calc(100vw-1rem)] max-w-[340px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-(--color-border) bg-(--glass-bg) shadow-[var(--glass-shadow)] backdrop-blur-2xl animate-[fadeIn_300ms_ease-out] sm:right-6 sm:left-auto sm:w-[340px]"
					role="dialog"
					aria-label={
						view === "favorites" ? "Favoritos" : "Historial de sesión"
					}
				>
				<div
					className="flex flex-wrap items-center justify-between gap-2 border-b border-(--color-border) px-4 py-3 sm:px-5"
				>
					<h3
						className="flex items-center gap-2 text-[0.85rem] font-bold text-(--color-text)"
						>
							{view === "favorites"
								? "⭐ Favoritos"
								: "🤖 Historial de sesión"}
							<span
								className="text-[0.7rem] font-medium text-(--color-text-tertiary)"
							>
								({view === "favorites" ? favorites.length : sessionHistory.length})
							</span>
						</h3>
						<div className="flex flex-wrap justify-end gap-1.5">
							<button
								type="button"
								onClick={() =>
									setView(view === "favorites" ? "history" : "favorites")
								}
								aria-label={
									view === "favorites"
										? "Ver historial"
										: "Ver favoritos"
								}
								className="cursor-pointer rounded-[var(--radius-sm)] border border-(--color-border) bg-transparent px-2 py-1 text-xs text-(--color-accent) transition-colors duration-[var(--duration-fast)] hover:bg-(--color-accent-soft)"
							>
								{view === "favorites" ? "🤖 Historial" : "⭐ Favoritos"}
							</button>
							{view === "history" && sessionHistory.length > 0 && (
								<button
									type="button"
									onClick={() => setConfirmAction({ type: "clear" })}
									aria-label="Limpiar historial"
									className="cursor-pointer rounded-[var(--radius-sm)] border border-(--color-border) bg-transparent px-2 py-1 text-xs text-(--color-text-tertiary) transition-colors duration-[var(--duration-fast)] hover:border-(--color-error) hover:text-(--color-error)"
								>
									🗑 Limpiar
								</button>
							)}
							<button
								type="button"
								onClick={toggleHistory}
								aria-label="Cerrar"
								className="cursor-pointer rounded-[var(--radius-sm)] border-0 bg-transparent px-2 py-1 text-lg text-(--color-text-tertiary) transition-colors duration-[var(--duration-fast)] hover:bg-(--color-accent-soft) hover:text-(--color-text)"
							>
								✕
							</button>
						</div>
					</div>

					<div
						className="history-scroll min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5"
					>
						{view === "favorites" ? (
							favorites.length === 0 ? (
								<div
									className="rounded-[14px] border border-(--color-border) bg-(--color-accent-soft) px-4 py-8 text-center text-xs text-(--color-text-tertiary)"
								>
									<div className="mb-2 text-2xl">⭐</div>
									<p>No tenés favoritos guardados</p>
								</div>
							) : (
								<FavoritesPanel
									favorites={favorites}
									onRemove={(id: string) => setConfirmAction({ type: "favorite", id })}
								/>
							)
						) : sessionHistory.length === 0 ? (
							<div
								className="rounded-[14px] border border-(--color-border) bg-(--color-accent-soft) px-4 py-8 text-center text-xs text-(--color-text-tertiary)"
							>
								<div className="mb-2 text-2xl">📭</div>
								<p>Todavía no generaste ninguna frase</p>
							</div>
						) : (
							<div className="flex flex-col">
								{sessionHistory.map((entry, i) => (
									<div
										key={entry.id}
										className="mb-2 flex flex-wrap items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-accent-soft) px-3 py-3 transition-colors duration-[var(--duration-fast)] hover:border-(--color-border-hover) sm:px-4"
									>
										<span
											className="min-w-5 font-mono text-[0.65rem] font-bold text-(--color-text-tertiary)"
										>
											#{sessionHistory.length - i}
										</span>

										<span
											className="min-w-0 flex-1 break-all font-mono text-xs text-(--color-text)"
										>
											{entry.password ?? "No disponible tras recargar"}
										</span>

										<span
											className="min-w-14 whitespace-nowrap text-right text-[0.6rem] text-(--color-text-tertiary)"
										>
											{timeAgo(entry.timestamp)}
										</span>

										<button
											type="button"
											disabled={!entry.password}
											onClick={() => {
												if (entry.password) handleCopy(entry.password, entry.id);
											}}
										aria-label={`Copiar frase ${sessionHistory.length - i}`}
											aria-live="polite"
											className={`shrink-0 cursor-pointer rounded px-1 py-0.5 text-sm transition-colors duration-[var(--duration-fast)] ${copiedIndex === entry.id ? "text-(--color-success)" : "text-(--color-text-tertiary)"}`}
										>
											{copiedIndex === entry.id ? "✅" : "📋"}
										</button>

										{copyErrorId === entry.id && (
											<p
												role="alert"
												className="basis-full text-[0.7rem] text-(--color-error)"
											>
												No se pudo copiar esta frase. Verifica los permisos del navegador.
											</p>
										)}

										<button
											type="button"
											onClick={() => setConfirmAction({ type: "entry", id: entry.id })}
											aria-label="Eliminar del historial"
											className="shrink-0 cursor-pointer rounded px-1 py-0.5 text-xs text-(--color-text-tertiary) transition-colors duration-[var(--duration-fast)] hover:text-(--color-error)"
										>
											🗑️
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					<div
						className="border-t border-(--color-border) px-4 py-2.5 text-center text-[0.65rem] text-(--color-text-tertiary)"
					>
						{view === "history"
							? "El historial vive solo en memoria · No se persiste"
							: "Favoritos guardados de forma cifrada · Solo vos podés verlos"}
					</div>
				</div>
			)}

			{confirmAction?.type === "clear" && (
				<ConfirmDialog
					open
					title="Limpiar historial"
					message="¿Estás seguro que deseas borrar todo el historial de sesión? Esta acción no se puede deshacer."
					onConfirm={handleConfirmClear}
					onCancel={handleCancelConfirm}
				/>
			)}
			{confirmAction?.type === "entry" && (
				<ConfirmDialog
					open
					title="Eliminar entrada"
					message="¿Estás seguro que deseas borrar esta entrada del historial? Esta acción no se puede deshacer."
					onConfirm={handleConfirmRemoveEntry}
					onCancel={handleCancelConfirm}
				/>
			)}
			{confirmAction?.type === "favorite" && (
				<ConfirmDialog
					open
					title="Eliminar favorita"
					message="¿Estás seguro que deseas borrar esta contraseña de tus favoritos? Esta acción no se puede deshacer."
					onConfirm={handleConfirmRemoveFavorite}
					onCancel={handleCancelConfirm}
				/>
			)}
		</>
	);
}
