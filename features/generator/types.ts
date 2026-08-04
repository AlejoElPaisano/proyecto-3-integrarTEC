export type StrengthLevel = 'weak' | 'medium' | 'strong' | 'very-strong';

export const STRENGTH_CONFIG: Record<StrengthLevel, { label: string; color: string }> = {
	weak:        { label: 'Débil',       color: '#ef4444' },
	medium:      { label: 'Moderada',    color: '#f97316' },
	strong:      { label: 'Fuerte',      color: '#eab308' },
	'very-strong': { label: 'Muy fuerte', color: '#22c55e' },
};

export interface PasswordConfig {
	wordCount: number;
	separator: string;
	includeNumbers: boolean;
	includeSymbols: boolean;
	capitalize: boolean;
	selectedCategories: string[];
}

export type RecommendationSeverity = 'low' | 'medium' | 'high';
export type RecommendationIcon = 'shield' | 'warning' | 'info' | 'sparkles';
export type RecommendationApplicability =
	| 'length'
	| 'uppercase'
	| 'symbols'
	| 'wordCount'
	| 'repeatedWords'
	| 'repeatCharacters'
	| 'numberSuffix'
	| 'low-entropy';

export interface PasswordRecommendation {
	id: string;
	title: string;
	detail: string;
	severity: RecommendationSeverity;
	icon: RecommendationIcon;
	applicable: RecommendationApplicability;
}

export interface PasswordAnalysis {
	password: string;
	recommendations: PasswordRecommendation[];
	entropy: number | null;
}

export interface PasswordResult {
	password: string;
	words: string[];
	phrase: string;
	bits: number;
	strength: StrengthLevel;
	isFavorite?: boolean;
	analysis?: PasswordAnalysis;
}

export interface SessionEntry {
	id: string;
	password: string;
	bits: number;
	timestamp: number;
}

export interface BatchResult {
	results: PasswordResult[];
	generatedAt: number;
}

export interface ReuseWarning {
	index: number;
	password: string;
	similarTo: string;
	similarity: number;
}
