import type { PasswordConfig, StrengthLevel } from "./types";
import wordLists from "./wordLists.json";

const COMMON_SEPARATORS = new Set(["-", "_", "."]);
const TOP_SYMBOLS = new Set(["!", "@", "#", "$"]);
const KEYBOARD_PATTERNS = [
  "qwerty",
  "asdf",
  "zxcv",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];
const SEQUENTIAL_PATTERNS = [
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789",
  "9876543210",
];

function detectRepeatedWords(words: string[]): number {
  const seen = new Set<string>();
  let repeats = 0;
  for (const word of words) {
    if (seen.has(word)) repeats++;
    else seen.add(word);
  }
  return repeats;
}

function detectPatterns(password: string): number {
  const lower = password.toLowerCase();
  let penalty = 0;

  const yearMatch = lower.match(/19\d{2}|20[0-2]\d/);
  if (yearMatch) penalty += 8;

  for (const seq of SEQUENTIAL_PATTERNS) {
    for (let i = 0; i < seq.length - 3; i++) {
      const sub = seq.slice(i, i + 4);
      if (lower.includes(sub)) {
        penalty += 6;
        break;
      }
    }
  }

  for (const pattern of KEYBOARD_PATTERNS) {
    if (pattern.length >= 4) {
      for (let i = 0; i < pattern.length - 3; i++) {
        const sub = pattern.slice(i, i + 4);
        if (lower.includes(sub)) {
          penalty += 6;
          break;
        }
      }
    }
  }

  for (let len = 3; len <= Math.floor(password.length / 2); len++) {
    for (let i = 0; i <= password.length - 2 * len; i++) {
      const chunk = password.slice(i, i + len);
      const rest = password.slice(i + len);
      if (rest.includes(chunk)) {
        penalty += 5;
        break;
      }
    }
  }

  return penalty;
}

function detectPredictability(
  config: PasswordConfig,
  password: string,
): number {
  let penalty = 0;

  if (COMMON_SEPARATORS.has(config.separator)) {
    penalty += 2;
  }

  const suffixMatch = password.match(/(\d+)$/);
  if (suffixMatch) {
    const num = Number(suffixMatch[1]);
    if (num >= 10 && num <= 99) {
      penalty += 4;
    }
  }

  const symbolMatch = password.match(/[!@#$%&*?]$/);
  if (symbolMatch && TOP_SYMBOLS.has(symbolMatch[0])) {
    penalty += 2;
  }

  return penalty;
}

export function calculateEntropy(
  config: PasswordConfig,
  password?: string,
): number {
  const allWords = Object.values(wordLists).flat();
  const wordListSize = allWords.length;

  const words = password
    ? password.split(/[-_ .]+/).filter(Boolean)
    : [];

  const wordCount = config.wordCount;
  const uniqueWordRatio = words.length > 0
    ? new Set(words.map((w) => w.toLowerCase())).size / words.length
    : 1;

  const wordsEntropy = Math.log2(wordListSize) * wordCount * Math.max(0.5, uniqueWordRatio);

  const separatorOptions = 4;
  const structureEntropy =
    (config.capitalize ? wordCount : 0) +
    (config.includeNumbers ? Math.log2(90) : 0) +
    (config.includeSymbols ? Math.log2(8) : 0) +
    Math.log2(separatorOptions);

  const diversityBonus = (uniqueWordRatio - 0.5) * 10;

  const wordCountBonus =
    (wordCount >= 4 ? 8 : 0) +
    (wordCount >= 5 ? 12 : 0);

  const shortPasswordPenalty = wordCount < 4 ? (4 - wordCount) * 12 : 0;

  const repeatedWords = words.length > 0 ? detectRepeatedWords(words) : 0;
  const repeatedWordPenalty = repeatedWords * 6;

  const patternPenalty = password ? detectPatterns(password) : 0;

  const predictabilityPenalty = detectPredictability(config, password ?? "");

  const total =
    wordsEntropy +
    structureEntropy +
    diversityBonus +
    wordCountBonus -
    shortPasswordPenalty -
    repeatedWordPenalty -
    patternPenalty -
    predictabilityPenalty;

  return Math.max(1, Math.round(total * 10) / 10);
}

export function getStrengthLevel(bits: number): StrengthLevel {
  if (bits < 20) return "weak";
  if (bits < 40) return "medium";
  if (bits < 60) return "strong";
  return "very-strong";
}
