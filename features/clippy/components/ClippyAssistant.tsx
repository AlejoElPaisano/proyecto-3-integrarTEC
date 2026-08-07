'use client'

import { usePasswordStore } from "@/features/generator/store";
import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useHasMounted } from "@/shared/hooks/useHasMounted";

const TIPS: Record<string, { icon: string; title: string; text: string }[]> = {
	1: [
		{
			icon: "💡",
			title: "¿Qué es un passphrase?",
			text: "Una frase de varias palabras al azar. Fácil de recordar, difícil de adivinar.",
		},
		{
			icon: "🔐",
			title: "Más palabras = más seguro",
			text: "Cada palabra adicional multiplica la entropía. Recomendamos 4 o más.",
		},
	],
	2: [
		{
			icon: "💬",
			title: "¡Hola!",
			text: "Bienvenido a la personalización. Mové el slider o probá los toggles y te explico cada opción.",
		},
	],
	3: [
		{
			icon: "✅",
			title: "Verificá la entropía",
			text: "Buscá al menos 60 bits para cuentas importantes, 80+ para máxima seguridad.",
		},
		{
			icon: "📋",
			title: "Copiá y guardá",
			text: "Usá el botón de copiar y almacená tu frase de forma segura.",
		},
	],
};

const SETTING_TIPS: Record<string, { icon: string; title: string; text: string }> = {
	wordCount: {
		icon: "📏",
		title: "Cantidad de palabras",
		text: "¡Excelente! Cada palabra extra suma ~3-4 bits de entropía. Con 4 palabras tenés ~44 bits, suficiente para cuentas diarias. Con 6 llegás a ~66 bits, ideal para cosas importantes.",
	},
	separator: {
		icon: "🔗",
		title: "Separador",
		text: "¡Bien elegido! Los separadores distinguen visualmente cada palabra y evitan errores al leer o tipear. Guiones y puntos son los más usados por su claridad.",
	},
	includeNumbers: {
		icon: "🔢",
		title: "Números",
		text: "¡Números activados! Un número de 2 dígitos suma ~6.5 bits extra. Cero esfuerzo para tu memoria, gran ganancia de seguridad.",
	},
	includeSymbols: {
		icon: "🔣",
		title: "Símbolos",
		text: "¡Símbolos activados! Un símbolo suma ~3 bits. Combinado con números, son ~10 bits extras. Hack de seguridad gratuito.",
	},
	capitalize: {
		icon: "🔠",
		title: "Capitalizar",
		text: "¡Mayúsculas activadas! Cada inicial mayúscula suma 1 bit por palabra. En 4 palabras son 4 bits regalados sin que cambies tu forma de recordar.",
	},
	noNumbers: {
		icon: "🔢",
		title: "Sin números",
		text: "Los números suman ~6.5 bits extra sin esfuerzo. Recomendamos activarlos para mayor seguridad.",
	},
	noSymbols: {
		icon: "🔣",
		title: "Sin símbolos",
		text: "Agregar un símbolo aporta ~3 bits adicionales. Es una mejora sencilla que fortalece tu contraseña.",
	},
	noCapitalize: {
		icon: "🔠",
		title: "Sin mayúsculas",
		text: "Las mayúsculas aportan 1 bit por palabra. Activarlas no afecta la memorabilidad pero sí la seguridad.",
	},
};

export function ClippyAssistant({ activeTip, floating = true }: { activeTip?: string | null; floating?: boolean }) {
	const hasMounted = useHasMounted();
	const currentStep = usePasswordStore((state) => state.currentStep);
	const currentResult = usePasswordStore((state) => state.currentResult);
	const historyOpen = usePasswordStore((state) => state.historyOpen);
	const sessionHistory = usePasswordStore((state) => state.sessionHistory);
	const toggleHistory = usePasswordStore((state) => state.toggleHistory);
	const [dismissedTipKey, setDismissedTipKey] = useState<string | null>(null);

	const tipKey = useMemo(() => {
		if (currentStep === 2) return `step2-${activeTip ?? ""}`;
		if (currentStep === 3) return `step3-${currentResult?.password ?? ""}-${currentResult?.bits ?? 0}`;
		return "init";
	}, [currentStep, activeTip, currentResult?.password, currentResult?.bits]);

	const isDismissed = dismissedTipKey === tipKey;

	const autoTip = useMemo(() => {
		if (currentStep === 2) {
			if (activeTip && SETTING_TIPS[activeTip]) {
				return { type: "setting" as const, ...SETTING_TIPS[activeTip] };
			}
			const array = new Uint32Array(1);
			crypto.getRandomValues(array);
			const tip = TIPS[2][array[0] % TIPS[2].length];
			return { type: "tip" as const, ...tip };
		}

		if (currentStep === 3 && currentResult) {
			const array = new Uint32Array(1);
			crypto.getRandomValues(array);
			const tip = TIPS[3][array[0] % TIPS[3].length];
			return {
				type: "result" as const,
				...tip,
				bits: currentResult.bits,
				recommendations: currentResult.analysis?.recommendations ?? [],
			};
		}

		return null;
	}, [currentStep, activeTip, currentResult]);

	if (!hasMounted || !floating) return null;

	const showBubble = autoTip && !historyOpen && !isDismissed;

	return createPortal(
		<div
			style={{
				position: "fixed",
				bottom: "1.5rem",
				right: "1.5rem",
				zIndex: 1000,
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-end",
				gap: "0.75rem",
			}}
		>
			{showBubble && (
				<div
					role="status"
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "0.85rem",
						padding: "1.1rem 1.25rem",
						borderRadius: "18px",
						background: "var(--color-card)",
						backdropFilter: "blur(20px)",
						WebkitBackdropFilter: "blur(20px)",
						border: "1px solid var(--glass-border)",
						boxShadow: "var(--glass-shadow)",
						fontSize: "0.875rem",
						maxWidth: "380px",
						width: "calc(100vw - 3rem)",
					}}
				>
					<div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
						<div
							aria-hidden="true"
							style={{
								width: "42px",
								height: "42px",
								borderRadius: "12px",
								display: "grid",
								placeItems: "center",
								background: "var(--color-accent-soft)",
								border: "1px solid var(--color-border)",
								flexShrink: 0,
								fontSize: "1.3rem",
							}}
						>
							{autoTip.icon}
						</div>
						<div style={{ flex: 1 }}>
							<strong
								style={{
									display: "block",
									fontSize: "0.95rem",
									fontWeight: 700,
									color: "var(--color-text)",
									marginBottom: "0.2rem",
									lineHeight: 1.3,
								}}
							>
								{autoTip.title}
							</strong>
							<span
								style={{
									fontSize: "0.85rem",
									color: "var(--color-text-secondary)",
									lineHeight: 1.45,
									display: "block",
								}}
							>
								{autoTip.text}
							</span>
						</div>
						<button
							type="button"
							onClick={() => setDismissedTipKey(tipKey)}
							aria-label="Descartar tip"
							style={{
								all: "unset",
								cursor: "pointer",
								flexShrink: 0,
								width: "24px",
								height: "24px",
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
								e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.color = "var(--color-text-tertiary)";
								e.currentTarget.style.background = "var(--color-accent-soft)";
							}}
						>
							✕
						</button>
					</div>

					{autoTip.type === "result" && autoTip.recommendations.length > 0 && (
						<div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.25rem", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border)" }}>
							<div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)" }}>
								<span style={{ fontSize: "1rem" }}>🛡️</span>
								Sugerencias de seguridad
							</div>
							{autoTip.recommendations.map((rec) => (
								<div
									key={rec.id}
									style={{
										display: "flex",
										alignItems: "flex-start",
										gap: "0.65rem",
										padding: "0.65rem 0.85rem",
										borderRadius: "12px",
										background: "var(--color-accent-soft)",
										border: "1px solid var(--color-border)",
										fontSize: "0.8rem",
									}}
								>
									<span style={{ fontSize: "0.95rem", flexShrink: 0, marginTop: "1px" }}>
										{rec.icon === "shield" ? "🛡️" : rec.icon === "warning" ? "⚠️" : "ℹ️"}
									</span>
									<div>
										<strong style={{ display: "block", marginBottom: "0.15rem", color: "var(--color-text)", fontSize: "0.825rem" }}>
											{rec.title}
										</strong>
										{rec.detail && (
											<span style={{ color: "var(--color-text-secondary)", lineHeight: 1.4, fontSize: "0.78rem" }}>
												{rec.detail}
											</span>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			<button
				type="button"
				onClick={toggleHistory}
				aria-label={historyOpen ? "Cerrar historial" : "Abrir historial de sesión"}
				aria-expanded={historyOpen}
				style={{
					all: "unset",
					cursor: "pointer",
					width: "52px",
					height: "52px",
					borderRadius: "50%",
					background: "var(--gradient-cta)",
					display: "grid",
					placeItems: "center",
					fontSize: "1.4rem",
					boxShadow: "0 4px 24px var(--color-pink-glow)",
					transition: "transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
					position: "relative",
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
				🤖
				{sessionHistory.length > 0 && (
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
			</button>
		</div>,
		document.body
	);
}
