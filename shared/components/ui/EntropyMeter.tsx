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
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "0.5rem",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "0.75rem",
				}}
			>
				<span
					style={{
						fontSize: "0.8rem",
						color: "var(--color-text-secondary)",
						whiteSpace: "nowrap",
						flexShrink: 0,
					}}
				>
					Entropía
				</span>

				<div
					role="progressbar"
					aria-valuenow={Math.round(percent)}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label={`Entropía: ${bits.toFixed(1)} bits`}
					style={{
						flex: 1,
						height: "7px",
						background: "var(--color-border)",
						borderRadius: "99px",
						overflow: "hidden",
					}}
				>
					<div
						style={{
							height: "100%",
							width: `${percent}%`,
							borderRadius: "99px",
							background:
								"linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e)",
							transition: "width var(--duration-slow) var(--ease-out)",
						}}
					/>
				</div>

				<span
					aria-live="polite"
					style={{
						fontSize: "0.85rem",
						fontWeight: 700,
						color: "var(--color-cyan)",
						fontFamily: "var(--font-mono)",
						whiteSpace: "nowrap",
						flexShrink: 0,
					}}
				>
					{bits.toFixed(1)} bits
				</span>
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<span
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "0.35rem",
						padding: "0.4rem 0.9rem",
						borderRadius: "99px",
						fontSize: "0.75rem",
						fontWeight: 500,
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
