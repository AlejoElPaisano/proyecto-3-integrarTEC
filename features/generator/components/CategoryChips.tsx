'use client'

import wordLists from "@/features/generator/wordLists.json";
import { usePasswordStore } from "@/features/generator/store";

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
	const categories = Object.keys(wordLists);
	const selectedCategories = usePasswordStore((state) => state.config.selectedCategories);
	const setConfig = usePasswordStore((state) => state.setConfig);

	const toggleCategory = (cat: string) => {
		const updated = selectedCategories.includes(cat)
			? selectedCategories.filter((c) => c !== cat)
			: [...selectedCategories, cat];
		setConfig({ selectedCategories: updated });
	};

	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
			{categories.map((cat) => {
				const active = selectedCategories.includes(cat);
				return (
					<button
						type="button"
						key={cat}
						onClick={() => toggleCategory(cat)}
						aria-pressed={active}
						style={{
							padding: "0.4rem 0.9rem",
							borderRadius: "99px",
							fontSize: "0.75rem",
							fontWeight: 600,
							cursor: "pointer",
							background: active ? "var(--gradient-cta)" : "var(--color-accent-soft)",
							border: active ? "1px solid var(--color-pink)" : "1px solid var(--color-border)",
							color: active ? "#fff" : "var(--color-text-secondary)",
							transition: "background, border-color, color var(--duration-fast) var(--ease-out)",
							fontFamily: "var(--font-sans)",
						}}
					>
						{CATEGORY_LABELS[cat] ?? cat}
					</button>
				);
			})}
		</div>
	);
}
