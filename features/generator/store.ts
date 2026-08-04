import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
	BatchResult,
	PasswordConfig,
	PasswordResult,
	ReuseWarning,
	SessionEntry,
} from "./types";
import { checkReuseWarnings } from "./similarity";
import { generateBatch, generatePassword } from "./generate";

const defaultConfig: PasswordConfig = {
	wordCount: 4,
	separator: "-",
	includeNumbers: true,
	includeSymbols: false,
	capitalize: true,
	selectedCategories: ["animales", "naturaleza", "verbos", "colores", "lugares"],
};

interface PasswordState {
	config: PasswordConfig;
	currentResult: PasswordResult | null;
	sessionHistory: SessionEntry[];
	batchResults: BatchResult | null;
	batchCount: number;
	batchWarnings: ReuseWarning[];
	currentStep: 1 | 2 | 3;
	historyOpen: boolean;

	setStep: (step: 1 | 2 | 3) => void;
	toggleHistory: () => void;
	setConfig: (patch: Partial<PasswordConfig>) => void;

	generate: () => void;
	generateBatch: () => void;
	setBatchCount: (n: number) => void;
	clearHistory: () => void;
	removeFromHistory: (id: string) => void;
}

export const usePasswordStore = create<PasswordState>()(
	persist(
		(set, get) => ({
			config: defaultConfig,
			currentResult: null,
			sessionHistory: [],
			batchResults: null,
			batchCount: 5,
			batchWarnings: [],
			currentStep: 1 as const,
			historyOpen: false,

			setStep: (step) => set({ currentStep: step }),
			toggleHistory: () => set((state) => ({ historyOpen: !state.historyOpen })),
			setConfig: (patch) =>
				set((state) => ({ config: { ...state.config, ...patch } })),

			generate: () => {
				const state = get();
				const result = generatePassword(state.config);
				const entry: SessionEntry = {
					id: crypto.randomUUID(),
					password: result.password,
					bits: result.bits,
					timestamp: Date.now(),
				};
				set({
					currentResult: result,
					sessionHistory: [entry, ...state.sessionHistory].slice(0, 50),
				});
			},

			generateBatch: () => {
				const state = get();
				const results = generateBatch(state.batchCount, state.config);

				const entries: SessionEntry[] = results.map((r) => ({
					id: crypto.randomUUID(),
					password: r.password,
					bits: r.bits,
					timestamp: Date.now(),
				}));

				const historyPasswords = state.sessionHistory.map((e) => e.password);
				const newPasswords = entries.map((e) => e.password);
				const warnings = checkReuseWarnings(newPasswords, historyPasswords);

				set({
					batchResults: { results, generatedAt: Date.now() },
					batchWarnings: warnings,
					sessionHistory: [...entries, ...state.sessionHistory].slice(0, 50),
				});
			},

			setBatchCount: (n) => set({ batchCount: n }),
			clearHistory: () =>
				set({ sessionHistory: [], batchResults: null, batchWarnings: [] }),

			removeFromHistory: (id) =>
				set((state) => ({
					sessionHistory: state.sessionHistory.filter((e) => e.id !== id),
				})),
		}),
		{
			name: "passfrases-history-v1",
			partialize: (state) => ({
				sessionHistory: state.sessionHistory,
				config: state.config,
				batchCount: state.batchCount,
			}),
			merge: (persisted, current) => {
				const data = persisted as Partial<PasswordState> | undefined
				if (!data) return current
				return {
					...current,
					...data,
					config: {
						...current.config,
						...(data.config ?? {}),
						selectedCategories:
							data.config?.selectedCategories ?? current.config.selectedCategories,
					},
				}
			},
		},
	),
);

export type { PasswordState };
