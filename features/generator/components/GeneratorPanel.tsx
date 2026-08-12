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

	const backButtonClass =
		"mt-1 cursor-pointer border-0 bg-transparent p-1 text-center font-sans text-[0.85rem] text-(--color-text-tertiary) transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-(--color-pink)";

	if (currentStep === 2) {
		return (
			<div className="text-center">
				<div className="flex flex-col gap-[1.25rem]">
					<GeneratorForm onSettingChange={(key) => onActiveTip?.(key)} />

					<button
						type="button"
						onClick={handleBackToStart}
						className={backButtonClass}
					>
						← Volver a inicio
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="text-center">
			<div className="flex flex-col gap-[1.25rem]">
				<div className="mb-2 inline-block text-[2.8rem] [filter:drop-shadow(0_0_24px_rgba(99,102,241,0.35))]">
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
					className={backButtonClass}
				>
					← Personalizar
				</button>
			</div>
		</div>
	);
}
