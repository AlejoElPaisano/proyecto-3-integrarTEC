'use client'

import { usePasswordStore } from "@/features/generator/store";
import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
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

const SHORTCUTS = [
	{ keys: ["G"], label: "Generar nueva passphrase" },
	{ keys: ["C"], label: "Copiar passphrase actual" },
	{ keys: ["B"], label: "Abrir o cerrar historial" },
] as const;

export function ClippyAssistant({ activeTip, floating = true }: { activeTip?: string | null; floating?: boolean }) {
	const hasMounted = useHasMounted();
	const pathname = usePathname();
	const currentStep = usePasswordStore((state) => state.currentStep);
	const currentResult = usePasswordStore((state) => state.currentResult);
	const historyOpen = usePasswordStore((state) => state.historyOpen);
	const sessionHistory = usePasswordStore((state) => state.sessionHistory);
	const toggleHistory = usePasswordStore((state) => state.toggleHistory);
	const [dismissedTipKey, setDismissedTipKey] = useState<string | null>(null);
	const [shortcutsOpen, setShortcutsOpen] = useState(false);

	const shortcutsEnabled = pathname === "/generator";
	const modKey = useMemo(() => {
		if (typeof navigator === "undefined") return "Ctrl";
		return /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? "⌘" : "Ctrl";
	}, []);

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

	const showBubble = autoTip && !historyOpen && !isDismissed && !shortcutsOpen;

	return createPortal(
		<div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-3">
			{shortcutsEnabled && shortcutsOpen && !historyOpen && (
				<div
					role="dialog"
					aria-label="Atajos de teclado"
					className="flex w-[calc(100vw-3rem)] max-w-[340px] flex-col gap-3 rounded-[18px] border border-(--glass-border) bg-(--color-card) p-4 text-[0.875rem] backdrop-blur-2xl"
					style={{ boxShadow: "var(--glass-shadow)" }}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-[0.95rem] font-bold text-(--color-text)">
							<span className="text-[1rem]">⌨️</span>
							Atajos de teclado
						</div>
						<button
							type="button"
							onClick={() => setShortcutsOpen(false)}
							aria-label="Cerrar lista de atajos"
							className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-full border border-(--color-border) bg-(--color-accent-soft) text-[0.8rem] text-(--color-text-tertiary) transition-colors duration-150 ease-out hover:bg-white/15 hover:text-(--color-text)"
						>
							✕
						</button>
					</div>
					<ul role="list" className="flex flex-col gap-2">
						{SHORTCUTS.map((shortcut) => (
							<li
								key={shortcut.keys[0]}
								role="listitem"
								className="flex items-center justify-between gap-2 rounded-xl border border-(--color-border) bg-(--color-accent-soft) p-2.5"
							>
								<span className="text-[0.825rem] text-(--color-text-secondary)">
									{shortcut.label}
								</span>
								<kbd className="rounded-md border border-(--color-border) bg-(--color-surface) px-2 py-0.5 font-mono text-[0.75rem] font-semibold text-(--color-text)">
									{modKey} + {shortcut.keys.join(" + ")}
								</kbd>
							</li>
						))}
					</ul>
				</div>
			)}

			{showBubble && (
				<div
					role="status"
					className="flex w-[calc(100vw-3rem)] max-w-[380px] flex-col gap-3.5 rounded-[18px] border border-(--glass-border) bg-(--color-card) p-4 text-[0.875rem] backdrop-blur-2xl"
					style={{ boxShadow: "var(--glass-shadow)" }}
				>
					<div className="flex items-start gap-3.5">
						<div
							aria-hidden="true"
							className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl border border-(--color-border) bg-(--color-accent-soft) text-[1.3rem]"
						>
							{autoTip.icon}
						</div>
						<div className="flex-1">
							<strong className="mb-[0.2rem] block text-[0.95rem] font-bold leading-[1.3] text-(--color-text)">
								{autoTip.title}
							</strong>
							<span className="block text-[0.85rem] leading-[1.45] text-(--color-text-secondary)">
								{autoTip.text}
							</span>
						</div>
						<button
							type="button"
							onClick={() => setDismissedTipKey(tipKey)}
							aria-label="Descartar tip"
							className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-full border border-(--color-border) bg-(--color-accent-soft) text-[0.8rem] text-(--color-text-tertiary) transition-colors duration-150 ease-out hover:bg-white/15 hover:text-(--color-text)"
						>
							✕
						</button>
					</div>

					{autoTip.type === "result" && autoTip.recommendations.length > 0 && (
						<div className="mt-1 flex flex-col gap-2.5 border-t border-(--color-border) pt-3">
							<div className="flex items-center gap-2 text-[0.85rem] font-bold text-(--color-text)">
								<span className="text-[1rem]">🛡️</span>
								Sugerencias de seguridad
							</div>
							{autoTip.recommendations.map((rec) => (
								<div
									key={rec.id}
									className="flex items-start gap-2.5 rounded-xl border border-(--color-border) bg-(--color-accent-soft) p-3 text-[0.8rem]"
								>
									<span className="mt-px shrink-0 text-[0.95rem]">
										{rec.icon === "shield" ? "🛡️" : rec.icon === "warning" ? "⚠️" : "ℹ️"}
									</span>
									<div>
										<strong className="mb-[0.15rem] block text-[0.825rem] text-(--color-text)">
											{rec.title}
										</strong>
										{rec.detail && (
											<span className="text-[0.78rem] leading-[1.4] text-(--color-text-secondary)">
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

			<div className="flex items-center gap-2">
				{shortcutsEnabled && (
					<button
						type="button"
						onClick={() => setShortcutsOpen((v) => !v)}
						aria-label={shortcutsOpen ? "Cerrar lista de atajos" : "Ver atajos de teclado"}
						aria-expanded={shortcutsOpen}
						className="flex cursor-pointer items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-card) px-3 py-2 text-[0.72rem] font-semibold text-(--color-text-secondary) backdrop-blur-md transition-colors duration-150 ease-out hover:border-(--color-accent) hover:text-(--color-text)"
					>
						<span aria-hidden="true">⌨️</span>
						Atajos
					</button>
				)}

				<button
					type="button"
					onClick={toggleHistory}
					aria-label={historyOpen ? "Cerrar historial" : "Abrir historial de sesión"}
					aria-expanded={historyOpen}
					className="relative grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-full bg-(--gradient-cta) text-[1.4rem] transition-transform duration-150 ease-out hover:scale-110"
					style={{ boxShadow: "0 4px 24px var(--color-pink-glow)" }}
				>
					🤖
					{sessionHistory.length > 0 && (
						<span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-(--color-surface) bg-(--color-pink) font-mono text-[0.65rem] font-bold leading-none text-white">
							{sessionHistory.length}
						</span>
					)}
				</button>
			</div>
		</div>,
		document.body
	);
}