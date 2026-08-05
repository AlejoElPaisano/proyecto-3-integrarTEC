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

const [store, generator, randomHelper] = await Promise.all([
	readProjectFile("features/generator/store.ts"),
	readProjectFile("features/generator/generate.ts"),
	readProjectFile("shared/lib/crypto/random.ts"),
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

console.log("Security verification passed: history persistence and randomness are guarded.");
