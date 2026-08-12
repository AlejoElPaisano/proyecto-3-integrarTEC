'use client'

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { usePasswordStore } from "@/features/generator/store";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { FavoritesPanel } from "@/features/favorites/components/FavoritesPanel";
import { FavoritesBackupButtons } from "@/features/favorites/components/FavoritesBackupButtons";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { useHasMounted } from "@/shared/hooks/useHasMounted";
import { cn } from "@/shared/lib/cn";

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

const badgeClass =
	"absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-(--color-surface) bg-(--color-pink) font-mono text-[0.65rem] font-bold leading-none text-white";

const emptyCardClass =
	"rounded-[14px] border border-(--color-border) bg-(--color-accent-soft) p-[2rem_1rem] text-center text-[0.85rem] text-(--color-text-tertiary)";

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

	const { favorites, removeFavorite, mergeFavorites } = useFavorites();

	const dialogRef = useRef<HTMLDialogElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const el = dialogRef.current;
		if (!el) return;
		if (historyOpen && !el.open) {
			previousActiveElement.current = document.activeElement as HTMLElement;
			el.showModal();
		} else if (!historyOpen && el.open) {
			el.close();
		}
	}, [historyOpen]);

	useEffect(() => {
		if (!historyOpen && previousActiveElement.current) {
			previousActiveElement.current.focus();
			previousActiveElement.current = null;
		}
	}, [historyOpen]);

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

	return createPortal(
		<>
			{!hideButton && (
				<button
					type="button"
					onClick={toggleHistory}
					aria-label="Abrir historial de sesión"
					aria-expanded={historyOpen}
					className="fixed bottom-6 right-6 z-[1000] grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-full border-none bg-(--gradient-cta) text-[1.4rem] [box-shadow:0_4px_24px_var(--color-pink-glow)] transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:scale-110 hover:[box-shadow:0_6px_32px_var(--color-pink-glow)]"
				>
					{view === "favorites" ? "⭐" : "🤖"}
					{sessionHistory.length > 0 && view === "history" && (
						<span className={badgeClass}>
							{sessionHistory.length}
						</span>
					)}
					{favorites.length > 0 && view === "favorites" && (
						<span className={badgeClass}>
							{favorites.length}
						</span>
					)}
				</button>
			)}

			{historyOpen && (
				<dialog
					ref={dialogRef}
					onClose={toggleHistory}
					aria-label={view === "favorites" ? "Favoritos" : "Historial de sesión"}
					className="fixed bottom-25 right-6 z-[1001] flex max-h-[min(72vh,480px)] w-[calc(100vw-3rem)] max-w-[390px] flex-col overflow-hidden rounded-[20px] border border-(--glass-border) bg-(--color-card) p-0 backdrop-blur-2xl text-(--color-text) [box-shadow:0_12px_40px_rgba(0,0,0,0.4),0_0_0_100vw_rgba(0,0,0,0.55)]"
				>
					{/* Header */}
					<div className="flex items-center justify-between border-b border-(--color-border) bg-[rgba(255,255,255,0.02)] p-[0.85rem_1rem]">
						{/* Tab Switcher Segmented Control */}
						<div
							role="tablist"
							aria-label="Vistas del panel"
							className="inline-flex items-center gap-0.5 rounded-full border border-(--color-border) bg-(--color-surface) p-[3px]"
						>
							<button
								type="button"
								role="tab"
								aria-selected={view === "history"}
								onClick={() => setView("history")}
								className={cn(
									"cursor-pointer rounded-full px-3 py-[0.3rem] text-[0.78rem] font-bold transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]",
									view === "history"
										? "bg-(--gradient-cta) text-white"
										: "bg-transparent text-(--color-text-secondary)",
								)}
							>
								🤖 Historial ({sessionHistory.length})
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={view === "favorites"}
								onClick={() => setView("favorites")}
								className={cn(
									"cursor-pointer rounded-full px-3 py-[0.3rem] text-[0.78rem] font-bold transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]",
									view === "favorites"
										? "bg-(--gradient-cta) text-white"
										: "bg-transparent text-(--color-text-secondary)",
								)}
							>
								⭐ Favoritos ({favorites.length})
							</button>
						</div>

						{/* Actions (Clear & Close) */}
						<div className="flex items-center gap-[0.4rem]">
							{view === "history" && sessionHistory.length > 0 && (
								<button
									type="button"
									onClick={() => setConfirmAction({ type: "clear" })}
									aria-label="Limpiar historial"
									title="Limpiar todo el historial"
									className="cursor-pointer rounded-lg border border-(--color-border) bg-(--color-accent-soft) px-[0.6rem] py-[0.3rem] text-[0.75rem] text-(--color-text-tertiary) transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-(--color-error) hover:text-(--color-error)"
								>
									🗑 Limpiar
								</button>
							)}

							<button
								type="button"
								onClick={toggleHistory}
								aria-label="Cerrar modal"
								className="grid h-[26px] w-[26px] cursor-pointer place-items-center rounded-full border border-(--color-border) bg-(--color-accent-soft) text-[0.75rem] text-(--color-text-tertiary) transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-[rgba(255,255,255,0.15)] hover:text-(--color-text)"
							>
								✕
							</button>
						</div>
					</div>

					{/* Content Scrollable Body */}
					<div
						className="history-scroll flex flex-1 flex-col gap-[0.6rem] overflow-y-auto p-[0.85rem]"
					>
						{view === "favorites" ? (
							<>
								<div className="pb-2">
									<FavoritesBackupButtons favorites={favorites} onMerge={mergeFavorites} />
								</div>
								{favorites.length === 0 ? (
									<div className={emptyCardClass}>
										<div className="mb-[0.4rem] text-[2rem]">⭐</div>
										<p className="m-0 font-semibold text-(--color-text-secondary)">
											No tenés favoritos guardados
										</p>
										<span className="mt-[0.2rem] block text-[0.75rem]">
											Importá un backup o guardá tus frases preferidas para verlas acá.
										</span>
									</div>
								) : (
									<FavoritesPanel
										favorites={favorites}
										onRemove={(id: string) => setConfirmAction({ type: "favorite", id })}
									/>
								)}
							</>
						) : sessionHistory.length === 0 ? (
							<div className={emptyCardClass}>
								<div className="mb-[0.4rem] text-[2rem]">📭</div>
								<p className="m-0 font-semibold text-(--color-text-secondary)">
									Todavía no generaste ninguna frase
								</p>
								<span className="mt-[0.2rem] block text-[0.75rem]">
									Tus pasphrases recién creadas aparecerán acá.
								</span>
							</div>
						) : (
							<div className="flex flex-col gap-[0.6rem]">
								{sessionHistory.map((entry, i) => (
									<div
										key={entry.id}
										className="flex flex-col gap-[0.4rem] rounded-xl border border-(--color-border) bg-(--color-accent-soft) p-[0.75rem_0.85rem] transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]"
									>
										{/* Entry Header: Badge + Password */}
										<div className="flex items-start gap-2">
											<span className="mt-[2px] shrink-0 rounded-md bg-[rgba(236,72,153,0.15)] px-[0.4rem] py-[0.15rem] font-mono text-[0.68rem] font-extrabold text-(--color-pink)">
												#{sessionHistory.length - i}
											</span>
											<span className="flex-1 break-all font-mono text-[0.825rem] font-semibold leading-[1.4] text-(--color-text)">
												{entry.password ?? "No disponible tras recargar"}
											</span>
										</div>

										{/* Entry Footer: Timestamp + Actions (Copy & Delete) */}
										<div className="mt-[0.15rem] flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-[0.4rem]">
											<span className="text-[0.7rem] text-(--color-text-tertiary)">
												⏱️ {timeAgo(entry.timestamp)}
											</span>

											<div className="flex items-center gap-[0.3rem]">
												<button
													type="button"
													disabled={!entry.password}
													onClick={() => {
														if (entry.password) handleCopy(entry.password, entry.id);
													}}
													aria-label={`Copiar frase ${sessionHistory.length - i}`}
													className={cn(
														"inline-flex cursor-pointer items-center gap-[0.25rem] rounded-md border px-[0.55rem] py-[0.25rem] text-[0.72rem] font-semibold transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]",
														copiedIndex === entry.id
															? "border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.15)] text-(--color-success)"
															: "border-(--color-border) bg-(--color-surface) text-(--color-text-secondary)",
														!entry.password && "cursor-default",
													)}
												>
													{copiedIndex === entry.id ? "✅ Copiado" : "📋 Copiar"}
												</button>

												<button
													type="button"
													onClick={() => setConfirmAction({ type: "entry", id: entry.id })}
													aria-label="Eliminar del historial"
													className="cursor-pointer rounded-md border border-(--color-border) bg-(--color-surface) px-[0.45rem] py-[0.25rem] text-[0.72rem] text-(--color-text-tertiary) transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-(--color-error) hover:text-(--color-error)"
												>
													🗑️
												</button>
											</div>
										</div>

										{copyErrorId === entry.id && (
											<p
												role="alert"
												className="m-0 text-[0.7rem] text-(--color-error)"
											>
												No se pudo copiar esta frase. Verifica los permisos del navegador.
											</p>
										)}
									</div>
								))}
							</div>
						)}
					</div>

					{/* Footer Note */}
					<div className="border-t border-(--color-border) bg-[rgba(0,0,0,0.15)] p-[0.6rem_0.85rem] text-center text-[0.7rem] text-(--color-text-tertiary)">
						{view === "history"
							? "🔒 Historial temporal guardado en memoria de sesión"
							: "🔐 Favoritos guardados cifrados localmente en tu navegador"}
					</div>
				</dialog>
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
		</>,
		document.body
	);
}
