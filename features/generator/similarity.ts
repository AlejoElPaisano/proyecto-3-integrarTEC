import type { ReuseWarning } from "./types";

function phraseSimilarity(a: string, b: string): number {
	const bigrams = (s: string) => {
		const map = new Map<string, number>();
		for (let i = 0; i < s.length - 1; i++) {
			const bg = s.slice(i, i + 2);
			map.set(bg, (map.get(bg) ?? 0) + 1);
		}
		return map;
	};

	const bgA = bigrams(a.toLowerCase());
	const bgB = bigrams(b.toLowerCase());
	let intersect = 0;

	for (const [bg, count] of bgA) {
		intersect += Math.min(count, bgB.get(bg) ?? 0);
	}

	const total =
		[...bgA.values()].reduce((s, c) => s + c, 0) +
		[...bgB.values()].reduce((s, c) => s + c, 0);

	return total === 0 ? 0 : (2 * intersect) / total;
}

export function checkReuseWarnings(
	passwords: string[],
	history: string[],
	threshold = 0.6,
): ReuseWarning[] {
	const warnings: ReuseWarning[] = [];

	for (let i = 0; i < passwords.length; i++) {
		for (const historic of history) {
			const sim = phraseSimilarity(passwords[i], historic);
			if (sim >= threshold) {
				warnings.push({
					index: i,
					password: passwords[i],
					similarTo: historic,
					similarity: Math.round(sim * 100),
				});
				break;
			}
		}
	}

	return warnings;
}
