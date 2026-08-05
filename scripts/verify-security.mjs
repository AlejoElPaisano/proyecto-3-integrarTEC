import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function readProjectFile(relativePath) {
	return readFile(path.join(projectRoot, relativePath), "utf8");
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(`Security verification failed: ${message}`);
	}
}

const [store, generator, randomHelper, passwordActions, favoritesPanel, favoritesStore, historyPanel, copyButton, batchGenerator] = await Promise.all([
	readProjectFile("features/generator/store.ts"),
	readProjectFile("features/generator/generate.ts"),
	readProjectFile("shared/lib/crypto/random.ts"),
	readProjectFile("features/generator/components/PasswordActions.tsx"),
	readProjectFile("features/favorites/components/FavoritesPanel.tsx"),
	readProjectFile("features/favorites/store.ts"),
	readProjectFile("features/batch/components/HistoryPanel.tsx"),
	readProjectFile("shared/components/ui/CopyButton.tsx"),
	readProjectFile("features/batch/components/BatchGenerator.tsx"),
]);

const partializeStart = store.indexOf("partialize:");
const migrateStart = store.indexOf("migrate:", partializeStart);
const persistedProjection = store.slice(partializeStart, migrateStart);

assert(partializeStart >= 0, "the password store must define partialize");
assert(
	migrateStart > partializeStart,
	"the password store must define a migration after partialize",
);
assert(
	persistedProjection.includes("sessionHistory: state.sessionHistory.map(({ id, bits, timestamp })"),
	"persisted history must project metadata explicitly",
);
assert(
	!persistedProjection.includes("password"),
	"persisted history projection must not contain password",
);
assert(
	store.includes("version: HISTORY_STORAGE_VERSION") &&
		store.includes("sanitizeSessionHistory(data.sessionHistory)"),
	"legacy persisted history must be migrated through the sanitizer",
);
assert(!generator.includes("Math.random("), "generation code must not use Math.random");
assert(
	generator.includes("secureRandomInt(90)") &&
		generator.includes("secureRandomInt(symbols.length)"),
	"numbers and symbols must use secureRandomInt",
);
assert(
	randomHelper.includes("crypto.getRandomValues") &&
		randomHelper.includes("rejectionLimit"),
	"secureRandomInt must use Web Crypto with rejection sampling",
);
assert(
	passwordActions.includes("<CopyButton text={password}") &&
		!passwordActions.includes("encryptPassword") &&
		!passwordActions.includes("label: password"),
	"the main copy action must use plaintext without persisting a plaintext label",
);
assert(
	favoritesPanel.includes("copyToClipboard") &&
		!favoritesPanel.includes("encrypted.ciphertext"),
	"favorites must use the decrypting flow and never copy ciphertext",
);
assert(
	favoritesStore.includes("decryptPassword") &&
		favoritesStore.includes('return "locked"') &&
		favoritesStore.includes('return "copied"'),
	"favorites must require a key when locked and report copy success explicitly",
);
assert(
	!historyPanel.includes("encrypted.ciphertext") &&
		historyPanel.includes("navigator.clipboard.writeText(password)"),
	"session history must copy its in-memory plaintext value",
);
assert(
	!copyButton.includes("alert(") && copyButton.includes('role="alert"'),
	"CopyButton must expose clipboard errors inline without alert",
);
assert(
	batchGenerator.includes("copyErrorIndex") &&
		batchGenerator.includes("copyAllError") &&
		batchGenerator.includes('role="alert"'),
	"batch copy actions must expose individual and bulk errors",
);
assert(
	historyPanel.includes("copyErrorId") && historyPanel.includes('role="alert"'),
	"history copy errors must be visible and accessible",
);
assert(
	passwordActions.includes("saveError") && passwordActions.includes('role="alert"'),
	"favorite save errors must be visible and accessible",
);

console.log("Security verification passed: history persistence and randomness are guarded.");
