import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function readProjectFile(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`UI verification failed: ${message}`);
  }
}

const [generatorForm, historyPanel, clippyAssistant, batchGenerator, globals, qrCodeButton, qrCodeModal, favoritesPanel, passwordActions, favoritesPageClient, historyPageClient] = await Promise.all([
  readProjectFile("features/generator/components/GeneratorForm.tsx"),
  readProjectFile("features/batch/components/HistoryPanel.tsx"),
  readProjectFile("features/clippy/components/ClippyAssistant.tsx"),
  readProjectFile("features/batch/components/BatchGenerator.tsx"),
  readProjectFile("app/globals.css"),
  readProjectFile("shared/components/ui/QRCodeButton.tsx"),
  readProjectFile("shared/components/ui/QRCodeModal.tsx"),
  readProjectFile("features/favorites/components/FavoritesPanel.tsx"),
  readProjectFile("features/generator/components/PasswordActions.tsx"),
  readProjectFile("app/favorites/FavoritesPageClient.tsx"),
  readProjectFile("app/history/HistoryPageClient.tsx"),
]);

assert(generatorForm.includes("flexDirection: \"column\"") || generatorForm.includes("flex-col"), "GeneratorForm must use a mobile-first column layout");
assert(historyPanel.includes("createPortal") && /calc\(100vw\s*-\s*3rem\)/.test(historyPanel), "HistoryPanel must use React Portal and fit mobile viewports");
assert(clippyAssistant.includes("createPortal"), "ClippyAssistant must use React Portal");
assert(batchGenerator.includes("sm:flex-row") && batchGenerator.includes("md:grid-cols-2"), "BatchGenerator must define mobile and desktop layouts");
assert(globals.includes(".history-scroll") && globals.includes("scrollbar-width: thin"), "history scrollbar styles must be global");
assert(!qrCodeButton.includes("onMouseEnter"), "QRCodeButton must use Tailwind hover variants instead of inline mouse handlers");
assert(!qrCodeModal.includes("onMouseEnter"), "QRCodeModal must use Tailwind hover variants instead of inline mouse handlers");
assert(!qrCodeModal.includes("console.error"), "QRCodeModal must not log to console in production");
assert(!clippyAssistant.includes("onMouseEnter"), "ClippyAssistant must use Tailwind hover variants instead of inline mouse handlers");
assert(!/<button[^>]*aria-live=/.test(batchGenerator), "BatchGenerator must not place aria-live on <button> elements; use a sibling <span role=\"status\">");
assert(!/<button[^>]*aria-live=/.test(favoritesPanel), "FavoritesPanel must not place aria-live on <button> elements; use a sibling <span role=\"status\">");
assert(!/<button[^>]*aria-live=/.test(favoritesPageClient), "FavoritesPageClient must not place aria-live on <button> elements; use a sibling <span role=\"status\">");
assert(!/<button[^>]*aria-live=/.test(historyPageClient), "HistoryPageClient must not place aria-live on <button> elements; use a sibling <span role=\"status\">");
assert(passwordActions.includes("role=\"status\"") && passwordActions.includes("aria-live=\"polite\""), "PasswordActions must keep the sr-only <span role=\"status\" aria-live=\"polite\"> announcer");

console.log("UI verification passed: priority components use responsive layouts and React Portals.");

