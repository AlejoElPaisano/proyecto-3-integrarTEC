import { STRENGTH_CONFIG } from "@/features/generator/types";
import { getStrengthLevel } from "@/features/generator/entropy";

interface FunStatsProps {
	wordCount: number;
	bits: number;
	hasNumbers: boolean;
	hasSymbols: boolean;
	hasCapitalize: boolean;
}

export function FunStats({
	wordCount,
	bits,
	hasNumbers,
	hasSymbols,
	hasCapitalize,
}: FunStatsProps) {
	const strength = getStrengthLevel(bits);
	const config = STRENGTH_CONFIG[strength];

	return (
		<div
			style={{
				display: "flex",
				gap: "0.5rem",
				justifyContent: "center",
				flexWrap: "wrap",
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
					background: "var(--color-accent-soft)",
					border: "1px solid rgba(99,102,241,0.2)",
					color: "var(--color-accent)",
				}}
			>
				{wordCount} {wordCount === 1 ? "palabra" : "palabras"}
			</span>

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
				{bits.toFixed(1)} bits
			</span>

			<Bubble active={hasNumbers} label="números" />
			<Bubble active={hasSymbols} label="símbolos" />
			<Bubble active={hasCapitalize} label="mayúsculas" />
		</div>
	);
}

function Bubble({ active, label }: { active: boolean; label: string }) {
	const color = active ? "var(--color-success)" : "#ef4444";
	const bg = active ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)";
	const border = active ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)";

	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: "0.35rem",
				padding: "0.4rem 0.9rem",
				borderRadius: "99px",
				fontSize: "0.75rem",
				fontWeight: 500,
				background: bg,
				border: border,
				color: color,
			}}
		>
			{active ? "✓" : "✗"} {label}
		</span>
	);
}
