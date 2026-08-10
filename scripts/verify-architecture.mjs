import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function readProjectFile(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Architecture verification failed: ${message}`);
  }
}

const serverRouteFiles = ["app/page.tsx", "app/generator/page.tsx", "app/batch/page.tsx"];
const browserOnlyFiles = [
  "features/generator/store.ts",
  "features/generator/generate.ts",
  "features/favorites/store.ts",
  "features/favorites/hooks/useFavorites.ts",
  "services/crypto.service.ts",
  "shared/lib/crypto/random.ts",
];

for (const file of serverRouteFiles) {
  const source = await readProjectFile(file);
  assert(!source.includes("'use client'") && !source.includes('"use client"'), `${file} must remain a Server Component`);
  assert(!source.includes("usePasswordStore"), `${file} must not consume Zustand directly`);
  assert(!source.includes("localStorage"), `${file} must not access localStorage`);
  assert(!source.includes("navigator."), `${file} must not access browser navigator APIs`);
  assert(!source.includes("crypto."), `${file} must not access Web Crypto APIs`);
}

for (const file of browserOnlyFiles) {
  const source = await readProjectFile(file);
  assert(source.startsWith("'use client'"), `${file} must declare the Client boundary`);
}

const layout = await readProjectFile("app/layout.tsx");
assert(layout.includes("<HistoryPanelLazy />"), "the root layout must mount the lazy HistoryPanel wrapper");
assert(!layout.includes("<FavoritesPanel />"), "the root layout must not duplicate FavoritesPanel");

console.log("Architecture verification passed: routes are server-first and browser APIs are client-only.");
