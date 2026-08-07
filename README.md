# PassFrases

PassFrases is a modern, mathematically secure passphrase generator migrated from a React (Vite) Single Page Application to Next.js 16 (App Router) and TypeScript.

## Key Features

- **High-Entropy Passphrase Generation**: Generates memorable passphrases with custom separators, capitalization, numbers, and symbols.
- **100% Cryptographically Secure**: Uses `crypto.getRandomValues()` with rejection sampling to eliminate modulo bias across word, number, and symbol selections.
- **7 Thematic Word Categories (167 total words)**:
  - 🐶 **Animales** (27 words)
  - 🌿 **Naturaleza** (25 words)
  - 🏃 **Verbos** (25 words)
  - 🎨 **Colores** (25 words)
  - 🏰 **Lugares** (25 words)
  - 🍕 **Comida** (20 words)
  - 💖 **Emociones** (20 words)
- **Local Security & Privacy**: Sensitive generated passwords are kept strictly in-memory during the active browser session and are never serialized in plaintext to `localStorage`.
- **Batch Generator**: Generate multiple passphrases simultaneously with similarity warning detectors.
- **Interactive Assistant (Clippy)**: Floating assistant providing real-time security entropy tips mounted cleanly via React Portals.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & CSS Custom Design Tokens
- **State Management**: Zustand
- **Cryptography**: Web Crypto API (`crypto.getRandomValues()`)

## Development & Verification Commands

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm run dev

# Run security verification tests
pnpm run verify:security

# Run responsive UI verification tests
pnpm run verify:ui

# Run architecture boundary tests
pnpm run verify:architecture

# Run TypeScript type check
pnpm exec tsc --noEmit

# Run Linter
pnpm lint

# Production build
pnpm run build
```