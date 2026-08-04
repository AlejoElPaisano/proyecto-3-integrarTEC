import type { PasswordConfig, PasswordResult } from "./types";
import wordLists from "./wordLists.json";
import { calculateEntropy, getStrengthLevel } from "./entropy";
import { analyzePassword } from "./analysis";

function pickRandom<T>(list: T[]): T {
	const randomArray = new Uint32Array(1);
	crypto.getRandomValues(randomArray);
	const randomIndex = randomArray[0] % list.length;
	return list[randomIndex];
}

function applyFormatting(
	words: string[],
	config: {
		separator: string;
		includeNumbers: boolean;
		includeSymbols: boolean;
		capitalize: boolean;
	},
): string {
	const processedWords = config.capitalize
		? words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		: [...words];

	let finalPassword = processedWords.join(config.separator);

	if (config.includeNumbers) {
		const randomNumber = Math.floor(Math.random() * 90) + 10;
		finalPassword += `${config.separator}${randomNumber}`;
	}

	if (config.includeSymbols) {
		const symbols = ["!", "@", "#", "$", "%", "&", "*", "?"];
		const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
		finalPassword += randomSymbol;
	}

	return finalPassword;
}

export function generatePassword(options: PasswordConfig): PasswordResult {
	const selectedLists = options.selectedCategories?.length
		? options.selectedCategories
			.map((cat) => (wordLists as Record<string, string[]>)[cat] ?? [])
			.flat()
		: Object.values(wordLists).flat();
	const allWords = selectedLists.length > 0 ? selectedLists : Object.values(wordLists).flat();
	const selectedWords: string[] = [];
	for (let i = 0; i < options.wordCount; i++) {
		let word = pickRandom(allWords);
		if (options.capitalize) {
			word = word.charAt(0).toUpperCase() + word.slice(1);
		}
		selectedWords.push(word);
	}

	const password = applyFormatting(selectedWords, {
		separator: options.separator,
		includeNumbers: options.includeNumbers,
		includeSymbols: options.includeSymbols,
		capitalize: options.capitalize,
	});

	const bits = calculateEntropy(options, password);
	const strength = getStrengthLevel(bits);

	return {
		password,
		words: selectedWords,
		phrase: selectedWords.join(" "),
		bits,
		strength,
		analysis: analyzePassword(password),
	};
}

export function generateBatch(
	count: number,
	options: PasswordConfig,
): PasswordResult[] {
	return Array.from({ length: count }, () => generatePassword(options));
}
