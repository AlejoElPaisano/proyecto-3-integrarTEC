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

const bubbleActive =
	"border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.08)] text-[var(--color-success)]";
const bubbleInactive =
	"border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.08)] text-[#ef4444]";

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
	return (
		<span className={cn(bubbleBase, active ? bubbleActive : bubbleInactive)}>
			<span aria-hidden="true">{active ? "✓" : "✗"}</span> {label}
		</span>
	);
}
