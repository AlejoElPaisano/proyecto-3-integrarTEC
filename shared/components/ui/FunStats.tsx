import { STRENGTH_CONFIG } from "@/features/generator/types";
import { getStrengthLevel } from "@/features/generator/entropy";
import { cn } from "@/shared/lib/cn";

interface FunStatsProps {
	wordCount: number;
	bits: number;
	hasNumbers: boolean;
	hasSymbols: boolean;
	hasCapitalize: boolean;
}

const bubbleBase =
	"inline-flex items-center gap-[0.35rem] rounded-full px-[0.9rem] py-[0.4rem] text-[0.75rem] font-medium";

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
		<div className="flex flex-wrap justify-center gap-2">
			<span className={cn(bubbleBase, "border border-[rgba(99,102,241,0.2)] bg-(--color-accent-soft) text-(--color-accent)")}>
				{wordCount} {wordCount === 1 ? "palabra" : "palabras"}
			</span>

			<span
				className={bubbleBase}
				style={{
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
			className={bubbleBase}
			style={{ background: bg, border, color }}
		>
			{active ? "✓" : "✗"} {label}
		</span>
	);
}
