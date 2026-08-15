'use client'

import { useRouter } from "next/navigation";
import { GeneratorForm } from "@/features/generator/components/GeneratorForm";
import { usePasswordStore } from "@/features/generator/store";
import { EntropyMeter } from "@/shared/components/ui/EntropyMeter";
import { FunStats } from "@/shared/components/ui/FunStats";
import { PasswordActions } from "@/features/generator/components/PasswordActions";
import { useHasMounted } from "@/shared/hooks/useHasMounted";

export default function GeneratorPanel({ onActiveTip }: { onActiveTip?: (key: string | null) => void }) {
	const hasMounted = useHasMounted();
	const currentResult = usePasswordStore((state) => state.currentResult);
	const currentStep = usePasswordStore((state) => state.currentStep);
	const config = usePasswordStore((state) => state.config);
	const generate = usePasswordStore((state) => state.generate);
	const setStep = usePasswordStore((state) => state.setStep);
	const router = useRouter();

	function handleGenerate() {
		generate();
		setStep(3);
	}

	function handleBackToStep2() {
		setStep(2);
	}

	function handleBackToStart() {
		setStep(1);
		router.push("/");
	}

	if (!hasMounted) return null;

	if (currentStep === 2) {
		return (
			<div style={{ textAlign: "center" }}>
				<div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
					<GeneratorForm onSettingChange={(key) => onActiveTip?.(key)} />

					<button
						type="button"
						onClick={handleBackToStart}
						style={{
							all: "unset",
							cursor: "pointer",
							textAlign: "center",
							marginTop: "0.25rem",
							fontSize: "0.85rem",
							color: "var(--color-text-tertiary)",
							fontFamily: "var(--font-sans)",
							padding: "4px 0",
							transition: "color var(--duration-fast) var(--ease-out)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.color = "var(--color-pink)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.color = "var(--color-text-tertiary)";
						}}
					>
						← Volver a inicio
					</button>
				</div>
			</div>
		);
	}

	return (
		<div style={{ textAlign: "center" }}>
			<div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
				<div
					style={{
						fontSize: "2.8rem",
						display: "inline-block",
						marginBottom: "0.5rem",
						filter: "drop-shadow(0 0 24px rgba(99,102,241,0.35))",
					}}
				>
					🛡️
				</div>

				<PasswordActions
					password={currentResult?.password ?? ""}
					bits={currentResult?.bits ?? 0}
					strength={currentResult?.strength ?? "medium"}
					wordCount={config.wordCount}
					onRegenerate={handleGenerate}
				/>

				{currentResult && (
					<>
						<EntropyMeter bits={currentResult.bits} />
						<FunStats
							wordCount={config.wordCount}
							bits={currentResult.bits}
							hasNumbers={config.includeNumbers}
							hasSymbols={config.includeSymbols}
							hasCapitalize={config.capitalize}
						/>
					</>
				)}

				<button
					type="button"
					onClick={handleBackToStep2}
					style={{
						all: "unset",
						cursor: "pointer",
						textAlign: "center",
						marginTop: "0.25rem",
						fontSize: "0.85rem",
						color: "var(--color-text-tertiary)",
						fontFamily: "var(--font-sans)",
						padding: "4px 0",
						transition: "color var(--duration-fast) var(--ease-out)",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.color = "var(--color-pink)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.color = "var(--color-text-tertiary)";
					}}
				>
					← Personalizar
				</button>
			</div>
		</div>
	);
}
