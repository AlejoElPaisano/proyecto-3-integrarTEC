import { getStrengthLevel } from "@/features/generator/entropy";
import type { StrengthLevel } from "@/features/generator/types";

export interface StrengthAnalysis {
  bits: number;
  strength: StrengthLevel;
  charsetSize: number;
  length: number;
  crackTimeOnline: string;
  crackTimeOffline: string;
  warnings: string[];
}

const CHARSET_LOWER = 26;
const CHARSET_UPPER = 26;
const CHARSET_DIGITS = 10;
const CHARSET_SYMBOLS = 33;

// OWASP/EFF consensus guess rates
const GUESSES_PER_SECOND_ONLINE = 1e10;
const GUESSES_PER_SECOND_OFFLINE = 1e12;

const COMMON_WORDS = [
  "password",
  "contraseña",
  "contrasena",
  "123456",
  "qwerty",
  "admin",
  "letmein",
  "hola",
];

const SEQUENCES = ["abcdef", "qwerty", "asdf", "zxcv", "12345", "54321", "abc"];

function detectCharsets(password: string): {
  charsetSize: number;
  warnings: string[];
} {
  let charsetSize = 0;
  const warnings: string[] = [];

  if (/[a-z]/.test(password)) charsetSize += CHARSET_LOWER;
  if (/[A-Z]/.test(password)) {
    charsetSize += CHARSET_UPPER;
  } else {
    warnings.push("Sin mayúsculas: agrega variedad al charset.");
  }

  if (/[0-9]/.test(password)) {
    charsetSize += CHARSET_DIGITS;
  } else {
    warnings.push("Sin números: agrega dígitos para aumentar el charset.");
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    charsetSize += CHARSET_SYMBOLS;
  } else {
    warnings.push(
      "Sin símbolos: agrega caracteres especiales para más entropía.",
    );
  }

  if (charsetSize === 0) charsetSize = CHARSET_LOWER;

  return { charsetSize, warnings };
}

function detectPatterns(password: string): string[] {
  const warnings: string[] = [];
  const lower = password.toLowerCase();

  if (/19\d{2}|20[0-2]\d/.test(password)) {
    warnings.push(
      "Contiene un año (ej: 1990, 2024): predecible en ataques de diccionario.",
    );
  }

  for (const seq of SEQUENCES) {
    if (lower.includes(seq)) {
      warnings.push(`Contiene la secuencia común "${seq}": muy predecible.`);
      break;
    }
  }

  if (/(.)\1{2,}/.test(password)) {
    warnings.push(
      "Repite caracteres consecutivos (ej: aaa, 111): reduce entropía.",
    );
  }

  if (password.length < 8) {
    warnings.push("Contraseña muy corta (menos de 8 caracteres).");
  }

  if (COMMON_WORDS.some((c) => lower.includes(c))) {
    warnings.push(
      "Contiene una palabra extremadamente común: aparece en el top de brechas.",
    );
  }

  return warnings;
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "instantáneo";
  if (seconds < 1) return "menos de un segundo";
  if (seconds < 60) return `${Math.round(seconds)} segundos`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutos`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} horas`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} días`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} meses`;
  const years = seconds / 31536000;
  if (years < 1000) return `${Math.round(years)} años`;
  if (years < 1e6) return `${Math.round(years / 1000)} mil años`;
  if (years < 1e9) return `${Math.round(years / 1e6)} millones de años`;
  if (years < 1e12) return `${Math.round(years / 1e9)} mil millones de años`;
  return "más que la edad del universo";
}

function crackTimeSeconds(bits: number, guessesPerSecond: number): number {
  // Average over half the keyspace: 2^(bits-1)
  return Math.pow(2, Math.max(0, bits - 1)) / guessesPerSecond;
}

export function analyzeArbitraryPassword(password: string): StrengthAnalysis {
  const length = password.length;
  const { charsetSize, warnings: charsetWarnings } = detectCharsets(password);
  const patternWarnings = detectPatterns(password);

  // Shannon entropy baseline
  let bits = length > 0 ? length * Math.log2(charsetSize) : 0;

  // Pattern penalty: each detected pattern reduces ~6 bits (heuristic)
  bits -= patternWarnings.length * 6;
  bits = Math.max(0, Math.round(bits * 10) / 10);

  const crackOnline = crackTimeSeconds(bits, GUESSES_PER_SECOND_ONLINE);
  const crackOffline = crackTimeSeconds(bits, GUESSES_PER_SECOND_OFFLINE);

  return {
    bits,
    strength: getStrengthLevel(bits),
    charsetSize,
    length,
    crackTimeOnline: formatDuration(crackOnline),
    crackTimeOffline: formatDuration(crackOffline),
    warnings: [...charsetWarnings, ...patternWarnings],
  };
}
