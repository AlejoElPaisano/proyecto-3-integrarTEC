'use client'

import { useState } from "react";
import { usePasswordStore } from "@/features/generator/store";

export default function BatchGenerator() {
	const batchResults = usePasswordStore((state) => state.batchResults);
	const batchCount = usePasswordStore((state) => state.batchCount);
	const batchWarnings = usePasswordStore((state) => state.batchWarnings);
	const generateBatch = usePasswordStore((state) => state.generateBatch);
	const setBatchCount = usePasswordStore((state) => state.setBatchCount);
	const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
	const [copiedAll, setCopiedAll] = useState(false);

	async function handleCopy(password: string, index: number) {
		try {
			await navigator.clipboard.writeText(password);
			setCopiedIndex(index);
			setTimeout(() => setCopiedIndex(null), 2000);
		} catch {
			setCopiedIndex(null);
		}
	}

	async function handleCopyAll() {
		if (!batchResults) return;
		try {
			await navigator.clipboard.writeText(
				batchResults.results.map((r) => r.password).join("\n"),
			);
			setCopiedAll(true);
			setTimeout(() => setCopiedAll(false), 2000);
		} catch {
			setCopiedAll(false);
		}
	}

	const warnedIndices = new Set(batchWarnings.map((w) => w.index));

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<label
						htmlFor="batchCount"
						className="text-[0.85rem] font-semibold text-text"
					>
						Cantidad
					</label>
					<div id="batchCount" role="group" aria-label="Cantidad de frases a generar" className="flex gap-[0.35rem]">
						{[3, 5, 10, 20].map((n) => (
							<button
								type="button"
								key={n}
								onClick={() => setBatchCount(n)}
								aria-label={`Seleccionar ${n} frases`}
								aria-pressed={batchCount === n}
								className={`px-3 py-[0.4rem] rounded-sm border font-mono text-[0.8rem] font-semibold cursor-pointer transition-all duration-150 ease-out ${
									batchCount === n
										? "border-accent bg-accent-soft text-accent"
										: "border-border bg-transparent text-text-secondary"
								}`}
							>
								{n}
							</button>
						))}
					</div>
				</div>

				<button
					type="button"
					onClick={generateBatch}
					className="flex items-center gap-[0.4rem] whitespace-nowrap rounded-md bg-[image:var(--gradient-blue)] px-5 py-[0.65rem] font-sans text-[0.9rem] font-bold text-white cursor-pointer transition-all duration-150 ease-out hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
				>
					✨ Generar {batchCount} frases
				</button>
			</div>

			{!batchResults && (
				<div className="px-4 py-12 text-center text-[0.9rem] text-text-tertiary">
					<div className="mb-3 text-[2.5rem]">📋</div>
					<p>
						Hacé clic en{" "}
						<strong className="text-text-secondary">Generar</strong>{" "}
						para crear {batchCount} frases
					</p>
				</div>
			)}

			{batchResults && batchResults.results.length > 0 && (
				<>
					<button
						type="button"
						onClick={handleCopyAll}
						className={`flex items-center justify-center gap-[0.4rem] rounded-sm border border-border px-2 py-[0.55rem] font-sans text-[0.8rem] font-medium cursor-pointer transition-all duration-150 ease-out ${
							copiedAll ? "text-success" : "text-text-secondary"
						}`}
					>
						{copiedAll ? "✅ Copiadas todas" : "📋 Copiar todas"}
					</button>

					{batchWarnings.length > 0 && (
						<div className="flex items-center gap-2 rounded-md border border-orange-500/20 bg-orange-500/[0.08] px-4 py-[0.65rem] text-[0.8rem] font-medium text-orange-500">
							<span>⚠️</span>
							<span>
								{batchWarnings.length === 1
									? "1 frase es similar a una del historial"
									: `${batchWarnings.length} frases son similares a frases del historial`}
							</span>
						</div>
					)}

					<div className="flex flex-col gap-[0.6rem]">
						{batchResults.results.map((result, i) => {
							const isWarned = warnedIndices.has(i);
							return (
								<div
									key={`${i}-${result.password}`}
									className={`flex items-center gap-2 rounded-md border px-[0.85rem] py-[0.65rem] transition-all duration-150 ease-out ${
										isWarned
											? "border-orange-500/25 bg-orange-500/[0.04]"
											: "border-border bg-accent-soft"
									}`}
								>
									<span className="min-w-6 text-right font-mono text-[0.75rem] font-bold text-text-tertiary">
										#{i + 1}
									</span>

									<span className="flex-1 select-all break-all font-mono text-[0.85rem] font-semibold text-text">
										{result.password}
									</span>

									<button
										type="button"
										onClick={() => handleCopy(result.password, i)}
										aria-label={`Copiar frase ${i + 1}`}
										className={`shrink-0 cursor-pointer rounded-sm px-[0.4rem] py-[0.2rem] text-base transition-all duration-150 ease-out ${
											copiedIndex === i
												? "text-success"
												: "text-text-tertiary"
										}`}
									>
										{copiedIndex === i ? "✅" : "📋"}
									</button>

									{isWarned && (
										<span
											className="shrink-0 text-[0.9rem]"
											title="Similar a una frase del historial"
										>
											⚠️
										</span>
									)}
								</div>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
}
