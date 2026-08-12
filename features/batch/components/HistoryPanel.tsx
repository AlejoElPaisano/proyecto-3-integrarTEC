'use client'

import { useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { usePasswordStore } from "@/features/generator/store";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { FavoritesPanel } from "@/features/favorites/components/FavoritesPanel";
import { FavoritesBackupButtons } from "@/features/favorites/components/FavoritesBackupButtons";
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

	const { favorites, removeFavorite, mergeFavorites } = useFavorites();

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
					style={{
						position: "fixed",
						bottom: "1.5rem",
						right: "1.5rem",
						zIndex: 1000,
						width: "52px",
						height: "52px",
						borderRadius: "50%",
						background: "var(--gradient-cta)",
						display: "grid",
						placeItems: "center",
						fontSize: "1.4rem",
						boxShadow: "0 4px 24px var(--color-pink-glow)",
						border: "none",
						cursor: "pointer",
						transition: "transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "scale(1.1)";
						e.currentTarget.style.boxShadow = "0 6px 32px var(--color-pink-glow)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "scale(1)";
						e.currentTarget.style.boxShadow = "0 4px 24px var(--color-pink-glow)";
					}}
				>
					{view === "favorites" ? "⭐" : "🤖"}
					{sessionHistory.length > 0 && view === "history" && (
						<span
							style={{
								position: "absolute",
								top: "-4px",
								right: "-4px",
								display: "grid",
								width: "20px",
								height: "20px",
								placeItems: "center",
								borderRadius: "50%",
								border: "2px solid var(--color-surface)",
								background: "var(--color-pink)",
								fontFamily: "var(--font-mono)",
								fontSize: "0.65rem",
								fontWeight: 700,
								color: "#fff",
								lineHeight: 1,
							}}
						>
							{sessionHistory.length}
						</span>
					)}
					{favorites.length > 0 && view === "favorites" && (
						<span
							style={{
								position: "absolute",
								top: "-4px",
								right: "-4px",
								display: "grid",
								width: "20px",
								height: "20px",
								placeItems: "center",
								borderRadius: "50%",
								border: "2px solid var(--color-surface)",
								background: "var(--color-pink)",
								fontFamily: "var(--font-mono)",
								fontSize: "0.65rem",
								fontWeight: 700,
								color: "#fff",
								lineHeight: 1,
							}}
						>
							{favorites.length}
						</span>
					)}
				</button>
			)}

			{historyOpen && (
				<div
					role="dialog"
					aria-label={view === "favorites" ? "Favoritos" : "Historial de sesión"}
					style={{
						position: "fixed",
						bottom: "5rem",
						right: "1.5rem",
						zIndex: 1001,
						width: "calc(100vw - 3rem)",
						maxWidth: "390px",
						maxHeight: "min(72vh, 480px)",
						display: "flex",
						flexDirection: "column",
						borderRadius: "20px",
						background: "var(--color-card)",
						backdropFilter: "blur(24px)",
						WebkitBackdropFilter: "blur(24px)",
						border: "1px solid var(--glass-border)",
						boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
						overflow: "hidden",
					}}
				>
					{/* Header */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							padding: "0.85rem 1rem",
							borderBottom: "1px solid var(--color-border)",
							background: "rgba(255,255,255,0.02)",
						}}
					>
						{/* Tab Switcher Segmented Control */}
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								background: "var(--color-surface)",
								padding: "3px",
								borderRadius: "99px",
								border: "1px solid var(--color-border)",
							}}
						>
							<button
								type="button"
								onClick={() => setView("history")}
								style={{
									all: "unset",
									cursor: "pointer",
									padding: "0.3rem 0.75rem",
									borderRadius: "99px",
									fontSize: "0.78rem",
									fontWeight: 700,
									color: view === "history" ? "#ffffff" : "var(--color-text-secondary)",
									background: view === "history" ? "var(--gradient-cta)" : "transparent",
									transition: "all var(--duration-fast) var(--ease-out)",
								}}
							>
								🤖 Historial ({sessionHistory.length})
							</button>
							<button
								type="button"
								onClick={() => setView("favorites")}
								style={{
									all: "unset",
									cursor: "pointer",
									padding: "0.3rem 0.75rem",
									borderRadius: "99px",
									fontSize: "0.78rem",
									fontWeight: 700,
									color: view === "favorites" ? "#ffffff" : "var(--color-text-secondary)",
									background: view === "favorites" ? "var(--gradient-cta)" : "transparent",
									transition: "all var(--duration-fast) var(--ease-out)",
								}}
							>
								⭐ Favoritos ({favorites.length})
							</button>
						</div>

						{/* Actions (Clear & Close) */}
						<div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
							{view === "history" && sessionHistory.length > 0 && (
								<button
									type="button"
									onClick={() => setConfirmAction({ type: "clear" })}
									aria-label="Limpiar historial"
									title="Limpiar todo el historial"
									style={{
										all: "unset",
										cursor: "pointer",
										padding: "0.3rem 0.6rem",
										borderRadius: "8px",
										border: "1px solid var(--color-border)",
										fontSize: "0.75rem",
										color: "var(--color-text-tertiary)",
										background: "var(--color-accent-soft)",
										transition: "all var(--duration-fast) var(--ease-out)",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor = "var(--color-error)";
										e.currentTarget.style.color = "var(--color-error)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.borderColor = "var(--color-border)";
										e.currentTarget.style.color = "var(--color-text-tertiary)";
									}}
								>
									🗑 Limpiar
								</button>
							)}

							<button
								type="button"
								onClick={toggleHistory}
								aria-label="Cerrar modal"
								style={{
									all: "unset",
									cursor: "pointer",
									width: "26px",
									height: "26px",
									borderRadius: "50%",
									display: "grid",
									placeItems: "center",
									fontSize: "0.75rem",
									color: "var(--color-text-tertiary)",
									background: "var(--color-accent-soft)",
									border: "1px solid var(--color-border)",
									transition: "all var(--duration-fast) var(--ease-out)",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.color = "var(--color-text)";
									e.currentTarget.style.background = "rgba(255,255,255,0.15)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.color = "var(--color-text-tertiary)";
									e.currentTarget.style.background = "var(--color-accent-soft)";
								}}
							>
								✕
							</button>
						</div>
					</div>

					{/* Content Scrollable Body */}
					<div
						className="history-scroll"
						style={{
							flex: 1,
							overflowY: "auto",
							padding: "0.85rem",
							display: "flex",
							flexDirection: "column",
							gap: "0.6rem",
						}}
					>
						{view === "favorites" ? (
							<>
								<div style={{ paddingBottom: "0.5rem" }}>
									<FavoritesBackupButtons favorites={favorites} onMerge={mergeFavorites} />
								</div>
								{favorites.length === 0 ? (
									<div
										style={{
											borderRadius: "14px",
											border: "1px solid var(--color-border)",
											background: "var(--color-accent-soft)",
											padding: "2rem 1rem",
											textAlign: "center",
											fontSize: "0.85rem",
											color: "var(--color-text-tertiary)",
										}}
									>
										<div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>⭐</div>
										<p style={{ margin: 0, fontWeight: 600, color: "var(--color-text-secondary)" }}>
											No tenés favoritos guardados
										</p>
										<span style={{ fontSize: "0.75rem", marginTop: "0.2rem", display: "block" }}>
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
							<div
								style={{
									borderRadius: "14px",
									border: "1px solid var(--color-border)",
									background: "var(--color-accent-soft)",
									padding: "2rem 1rem",
									textAlign: "center",
									fontSize: "0.85rem",
									color: "var(--color-text-tertiary)",
								}}
							>
								<div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>📭</div>
								<p style={{ margin: 0, fontWeight: 600, color: "var(--color-text-secondary)" }}>
									Todavía no generaste ninguna frase
								</p>
								<span style={{ fontSize: "0.75rem", marginTop: "0.2rem", display: "block" }}>
									Tus pasphrases recién creadas aparecerán acá.
								</span>
							</div>
						) : (
							<div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
								{sessionHistory.map((entry, i) => (
									<div
										key={entry.id}
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "0.4rem",
											borderRadius: "12px",
											border: "1px solid var(--color-border)",
											background: "var(--color-accent-soft)",
											padding: "0.75rem 0.85rem",
											transition: "all var(--duration-fast) var(--ease-out)",
										}}
									>
										{/* Entry Header: Badge + Password */}
										<div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
											<span
												style={{
													fontFamily: "var(--font-mono)",
													fontSize: "0.68rem",
													fontWeight: 800,
													color: "var(--color-pink)",
													background: "rgba(236,72,153,0.15)",
													padding: "0.15rem 0.4rem",
													borderRadius: "6px",
													flexShrink: 0,
													marginTop: "2px",
												}}
											>
												#{sessionHistory.length - i}
											</span>
											<span
												style={{
													flex: 1,
													fontFamily: "var(--font-mono)",
													fontSize: "0.825rem",
													fontWeight: 600,
													color: "var(--color-text)",
													wordBreak: "break-all",
													lineHeight: 1.4,
												}}
											>
												{entry.password ?? "No disponible tras recargar"}
											</span>
										</div>

										{/* Entry Footer: Timestamp + Actions (Copy & Delete) */}
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												marginTop: "0.15rem",
												paddingTop: "0.4rem",
												borderTop: "1px solid rgba(255,255,255,0.05)",
											}}
										>
											<span
												style={{
													fontSize: "0.7rem",
													color: "var(--color-text-tertiary)",
												}}
											>
												⏱️ {timeAgo(entry.timestamp)}
											</span>

											<div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
												<button
													type="button"
													disabled={!entry.password}
													onClick={() => {
														if (entry.password) handleCopy(entry.password, entry.id);
													}}
													aria-label={`Copiar frase ${sessionHistory.length - i}`}
													style={{
														all: "unset",
														cursor: entry.password ? "pointer" : "default",
														display: "inline-flex",
														alignItems: "center",
														gap: "0.25rem",
														padding: "0.25rem 0.55rem",
														borderRadius: "6px",
														fontSize: "0.72rem",
														fontWeight: 600,
														background: copiedIndex === entry.id ? "rgba(34,197,94,0.15)" : "var(--color-surface)",
														border: copiedIndex === entry.id ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--color-border)",
														color: copiedIndex === entry.id ? "var(--color-success)" : "var(--color-text-secondary)",
														transition: "all var(--duration-fast) var(--ease-out)",
													}}
												>
													{copiedIndex === entry.id ? "✅ Copiado" : "📋 Copiar"}
												</button>

												<button
													type="button"
													onClick={() => setConfirmAction({ type: "entry", id: entry.id })}
													aria-label="Eliminar del historial"
													style={{
														all: "unset",
														cursor: "pointer",
														padding: "0.25rem 0.45rem",
														borderRadius: "6px",
														fontSize: "0.72rem",
														color: "var(--color-text-tertiary)",
														background: "var(--color-surface)",
														border: "1px solid var(--color-border)",
														transition: "all var(--duration-fast) var(--ease-out)",
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.borderColor = "var(--color-error)";
														e.currentTarget.style.color = "var(--color-error)";
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.borderColor = "var(--color-border)";
														e.currentTarget.style.color = "var(--color-text-tertiary)";
													}}
												>
													🗑️
												</button>
											</div>
										</div>

										{copyErrorId === entry.id && (
											<p
												role="alert"
												style={{
													color: "var(--color-error)",
													fontSize: "0.7rem",
													margin: 0,
												}}
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
					<div
						style={{
							padding: "0.6rem 0.85rem",
							borderTop: "1px solid var(--color-border)",
							background: "rgba(0,0,0,0.15)",
							textAlign: "center",
							fontSize: "0.7rem",
							color: "var(--color-text-tertiary)",
						}}
					>
						{view === "history"
							? "🔒 Historial temporal guardado en memoria de sesión"
							: "🔐 Favoritos guardados cifrados localmente en tu navegador"}
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
		</>,
		document.body
	);
}
