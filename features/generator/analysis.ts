import type { PasswordAnalysis, PasswordRecommendation, PasswordConfig } from "./types";
import { calculateEntropy } from "./entropy";

export function analyzePassword(password: string, config?: PasswordConfig): PasswordAnalysis {
	const normalized = password.trim();
	const words = normalized.split(/[-_. ]+/).filter(Boolean);
	const recommendations: PasswordRecommendation[] = [];

	if (normalized.length < 24) {
		recommendations.push({
			id: 'length',
			title: 'Contraseña corta',
			detail: 'Una contraseña de al menos 24 caracteres es más resistente y reduce el riesgo de ataques de fuerza bruta.',
			severity: 'medium',
			icon: 'warning',
			applicable: 'length',
		});
	}

	if (!/[0-9]/.test(normalized)) {
		recommendations.push({
			id: 'numbers',
			title: 'Agregar números',
			detail: 'Incluir números al final (ej: 42) suma ~6.5 bits de entropía extra sin complicar el recuerdo.',
			severity: 'low',
			icon: 'info',
			applicable: 'numberSuffix',
		});
	}

	if (!/[A-Z]/.test(normalized)) {
		recommendations.push({
			id: 'uppercase',
			title: 'Usar mayúsculas',
			detail: 'Agregar al menos una letra mayúscula aumentará la diversidad de caracteres y la fuerza de la contraseña.',
			severity: 'low',
			icon: 'info',
			applicable: 'uppercase',
		});
	}

	if (!/[!@#$%&*?]/.test(normalized)) {
		recommendations.push({
			id: 'symbols',
			title: 'Agregar símbolos',
			detail: 'Incluir símbolos como !@#$% ayuda a que la contraseña sea más difícil de adivinar.',
			severity: 'low',
			icon: 'info',
			applicable: 'symbols',
		});
	}

	if (words.length < 4) {
		recommendations.push({
			id: 'word-count',
			title: 'Agregar más palabras',
			detail: 'Un passphrase de cuatro o más palabras es más seguro que un conjunto corto de palabras.',
			severity: 'medium',
			icon: 'warning',
			applicable: 'wordCount',
		});
	}

	const duplicateWords = words.filter((word, index) => words.indexOf(word) !== index);
	if (duplicateWords.length > 0) {
		recommendations.push({
			id: 'repeated-words',
			title: 'Palabras repetidas',
			detail: `Se encontraron palabras repetidas: ${[...new Set(duplicateWords)].join(', ')}. Evita repetir palabras para mejorar la entropía.`,
			severity: 'high',
			icon: 'shield',
			applicable: 'repeatedWords',
		});
	}

	if (/(.)\1{2,}/.test(normalized)) {
		recommendations.push({
			id: 'repeat-characters',
			title: 'Caracteres repetidos',
			detail: 'Evita secuencias largas de caracteres repetidos, ya que reducen la variedad del passphrase.',
			severity: 'medium',
			icon: 'warning',
			applicable: 'repeatCharacters',
		});
	}

	const matchNumberSuffix = normalized.match(/(\d+)$/);
	if (matchNumberSuffix) {
		const numericValue = Number(matchNumberSuffix[1]);
		if (numericValue >= 10 && numericValue <= 19) {
			recommendations.push({
				id: 'weak-number',
				title: 'Número predecible al final',
				detail: 'Un sufijo numérico cercano a 10-19 es más predecible que un número aleatorio mayor.',
				severity: 'low',
				icon: 'info',
				applicable: 'numberSuffix',
			});
		}
	}

	const entropy = config ? calculateEntropy(config, normalized) : null;

	if (entropy !== null && entropy < 60) {
		const addWords = words.length < 4 ? ' más palabras,' : '';
		recommendations.push({
			id: 'low-entropy',
			title: 'Entropía baja',
			detail: `La entropía de la contraseña está por debajo de un umbral seguro. Considera agregar${addWords} mayúsculas, números o símbolos para mejorar la resistencia.`,
			severity: 'high',
			icon: 'shield',
			applicable: 'low-entropy',
		});
	}

	return {
		password: normalized,
		recommendations,
		entropy,
	};
}
