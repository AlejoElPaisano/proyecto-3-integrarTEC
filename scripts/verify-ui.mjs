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

const [generatorForm, historyPanel, clippyAssistant, batchGenerator, globals] = await Promise.all([
  readProjectFile("features/generator/components/GeneratorForm.tsx"),
  readProjectFile("features/batch/components/HistoryPanel.tsx"),
  readProjectFile("features/clippy/components/ClippyAssistant.tsx"),
  readProjectFile("features/batch/components/BatchGenerator.tsx"),
  readProjectFile("app/globals.css"),
]);

assert(generatorForm.includes("flexDirection: \"column\"") || generatorForm.includes("flex-col"), "GeneratorForm must use a mobile-first column layout");
assert(historyPanel.includes("createPortal") && historyPanel.includes("calc(100vw - 3rem)"), "HistoryPanel must use React Portal and fit mobile viewports");
assert(clippyAssistant.includes("createPortal") && clippyAssistant.includes("position: \"fixed\""), "ClippyAssistant must use React Portal with fixed viewport positioning");
assert(batchGenerator.includes("sm:flex-row") && batchGenerator.includes("md:grid-cols-2"), "BatchGenerator must define mobile and desktop layouts");
assert(globals.includes(".history-scroll") && globals.includes("scrollbar-width: thin"), "history scrollbar styles must be global");

console.log("UI verification passed: priority components use responsive layouts and React Portals.");

