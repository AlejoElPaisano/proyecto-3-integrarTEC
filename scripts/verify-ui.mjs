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

const [generatorForm, historyPanel, batchGenerator, globals] = await Promise.all([
  readProjectFile("features/generator/components/GeneratorForm.tsx"),
  readProjectFile("features/batch/components/HistoryPanel.tsx"),
  readProjectFile("features/batch/components/BatchGenerator.tsx"),
  readProjectFile("app/globals.css"),
]);

assert(!generatorForm.includes("style={{") && generatorForm.includes("sm:p-5"), "GeneratorForm must use Tailwind with mobile-first spacing");
assert(!historyPanel.includes("style={{") && historyPanel.includes("sm:right-6"), "HistoryPanel must avoid inline layout styles and adapt at sm");
assert(historyPanel.includes("inset-x-2") && historyPanel.includes("w-[calc(100vw-1rem)]"), "HistoryPanel must fit narrow mobile viewports");
assert(batchGenerator.includes("sm:flex-row") && batchGenerator.includes("md:grid-cols-2"), "BatchGenerator must define mobile and desktop layouts");
assert(globals.includes(".history-scroll") && globals.includes("scrollbar-width: thin"), "history scrollbar styles must be global");

console.log("UI verification passed: priority components use responsive Tailwind layouts.");
