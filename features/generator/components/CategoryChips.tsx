'use client'

import wordLists from "@/features/generator/wordLists.json";
import { usePasswordStore } from "@/features/generator/store";
import { useHasMounted } from "@/shared/hooks/useHasMounted";
import { cn } from "@/shared/lib/cn";

const CATEGORY_LABELS: Record<string, string> = {
	animales: "Animales",
	naturaleza: "Naturaleza",
	colores: "Colores",
	lugares: "Lugares",
	verbos: "Verbos",
	comida: "Comida",
	emociones: "Emociones",
};

export function CategoryChips() {
	const hasMounted = useHasMounted();
	const categories = Object.keys(wordLists);
	const selectedCategories = usePasswordStore((state) => state.config.selectedCategories);
	const setConfig = usePasswordStore((state) => state.setConfig);

	const toggleCategory = (cat: string) => {
		const updated = selectedCategories.includes(cat)
			? selectedCategories.filter((c) => c !== cat)
			: [...selectedCategories, cat];
		setConfig({ selectedCategories: updated });
	};

	if (!hasMounted) return null;

	return (
		<div className="flex flex-wrap justify-center gap-2">
			{categories.map((cat) => {
				const active = selectedCategories.includes(cat);
				return (
					<button
						type="button"
						key={cat}
						onClick={() => toggleCategory(cat)}
						aria-pressed={active}
						className={cn(
							"cursor-pointer rounded-full px-[0.9rem] py-[0.4rem] text-[0.75rem] font-semibold font-sans transition-[background,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
							active
								? "border border-(--color-pink) bg-(--gradient-cta) text-white"
								: "border border-(--color-border) bg-(--color-accent-soft) text-(--color-text-secondary)",
						)}
					>
						{CATEGORY_LABELS[cat] ?? cat}
					</button>
				);
			})}
		</div>
	);
}
