import { STRENGTH_CONFIG } from "@/features/generator/types";
import { getStrengthLevel } from "@/features/generator/entropy";

interface EntropyMeterProps {
	bits: number;
	maxBits?: number;
}

export function EntropyMeter({ bits, maxBits = 128 }: EntropyMeterProps) {
	const strength = getStrengthLevel(bits);
	const config = STRENGTH_CONFIG[strength];
	const percent = Math.min((bits / maxBits) * 100, 100);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-3">
				<span className="shrink-0 whitespace-nowrap text-[0.8rem] text-(--color-text-secondary)">
					Entropía
				</span>

				<div
					role="progressbar"
					aria-valuenow={Math.round(percent)}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label={`Entropía: ${bits.toFixed(1)} bits`}
					className="h-[7px] flex-1 overflow-hidden rounded-full bg-(--color-border)"
				>
					<div
						className="h-full rounded-full bg-[linear-gradient(90deg,#ef4444,#f97316,#eab308,#22c55e)] transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out)]"
						style={{ width: `${percent}%` }}
					/>
				</div>

				<span
					aria-live="polite"
					className="shrink-0 whitespace-nowrap font-mono text-[0.85rem] font-bold text-(--color-cyan)"
				>
					{bits.toFixed(1)} bits
				</span>
			</div>

			<div className="flex justify-center">
				<span
					className="inline-flex items-center gap-[0.35rem] rounded-full px-[0.9rem] py-[0.4rem] text-[0.75rem] font-medium"
					style={{
						background: `${config.color}14`,
						border: `1px solid ${config.color}33`,
						color: config.color,
					}}
				>
					{config.label}
				</span>
			</div>
		</div>
	);
}
