# PassFrases

> **README available in:** [English](#english) | [Español](#español)

---

## English

PassFrases is a modern, mathematically secure passphrase generator migrated from a React + Vite Single Page Application to Next.js 16 (App Router) with TypeScript. All generation and encryption happens locally in the browser through the Web Crypto API; no secret ever travels to a server.

### Team

## Group Members

| Member |
|-----------|
| **MARTINEZ ALEJO** |
| **ORTEGA AYELEN** |
| **RIVOIRA AGUSTINA** |
| **VALDIVIEZO GISELE** |
| **BRITEZ EMANUEL** |
| **CALEGARI LUIS** |

### Brief description

PassFrases creates memorable passphrase-phrases by combining thematic words (animals, nature, verbs, colors, places, food and emotions) with custom separators, capitalization, numbers and symbols. Entropy is calculated in bits in real time, phrases can be encrypted locally to be saved as favorites, and a batch generator produces multiple variants with similarity detection.

### Reference to the original project

This project is the migration of **`passfrases-proyect`**, a React + Vite SPA developed by Grupo 6 of the Tercer Proyecto Integrador.

Original stack: React 19, React Router DOM 7, Vite 8, Zustand, Tailwind CSS 4, Web Crypto API.

### Technologies used

| Area | Technology |
|------|------------|
| Framework | Next.js 16.3 (App Router, Server & Client Components, Turbopack) |
| Language | TypeScript 5 |
| Rendering | SSG by default, all routes are static (`○ Static`) |
| Styles | Hybrid: inline styles on design tokens (CSS custom properties) + Tailwind CSS v4 utility classes on auxiliary components |
| State | Zustand 5 with versioned persistence and legacy sanitization |
| Cryptography | Web Crypto API: `crypto.getRandomValues()` (rejection sampling) for generation, AES-GCM 256 + PBKDF2 SHA-256 (600,000 iterations) for favorites |
| Fonts | `next/font` (Inter + JetBrains Mono) self-hosted, no CDN |
| SEO | Metadata per route, Open Graph, programmatic `sitemap.ts` and `robots.ts` |
| Security | Content-Security-Policy, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy in `next.config.ts`; `proxy.ts` with scoped `matcher`; Zod-validated Route Handler and `server-only` DAL demonstrating the server-side defense pattern |
| Quality | ESLint, 3 custom verification scripts (security, architecture, UI) |

### Bugs found and fixed

The complete and detailed record of each bug, its impact, verification and resolution commit lives in [`BUGFIXES.md`](./BUGFIXES.md). Summary:

| # | Bug | Origin | Status |
|---|-----|--------|--------|
| 1 | Plaintext passwords persisted in session history | Pre-existing | ✅ Resolved |
| 2 | `Math.random()` in number and symbol generation | Pre-existing | ✅ Resolved |
| 3 | Native `alert()` and silent clipboard errors | Pre-existing | ✅ Resolved |
| 4 | No explicit responsive breakpoints | Pre-existing | 🟡 Accepted (wontfix) |
| 5 | Inline styles mixed with Tailwind | Pre-existing | 🟡 Hybrid accepted |
| 6 | README word-list count inconsistent with data | Pre-existing | ✅ Resolved |
| 7 | No dedicated favorites or history routes | Pre-existing | ✅ Resolved |
| R1 | Clipboard copied ciphertext instead of plaintext | Migration regression | ✅ Resolved |
| R2 | Persisted Zustand state rendered before hydration | Migration regression | ✅ Resolved |
| R3 | Route pages became Client Components | Migration regression | ✅ Resolved |
| A3 | RSC event handlers, mobile 4-button overflow & click-outside | UI & Audit 3 | ✅ Resolved |

> Items 8 (commits without Conventional Commits) and 9 (inconsistent git authorship)
> from the original feedback are process observations about the Grupo 6 repository,
> not code bugs fixable by a `fix:` commit. They are amortized naturally by adopting
> English Conventional Commits and distributing features across integrants in the
> migrated repo; that is why [`BUGFIXES.md`](./BUGFIXES.md) does not track them as bug
> entries.

### Extra features

Beyond the faithful migration of the original, improvements were incorporated that take advantage of Next.js native capabilities and reinforce security:

- **Dedicated `/favorites` and `/history` routes** with their own metadata and deep-linking (Bug 7), without duplicating the floating panel from the layout.
- **Complete SEO infrastructure**: programmatic `sitemap.ts` and `robots.ts`, metadata with `title` + `description` + Open Graph on all 6 routes, canonical URLs.
- **Error and loading boundaries**: `not-found.tsx` (404), `error.tsx` (route boundary), `global-error.tsx` (root boundary), `loading.tsx` (streaming skeleton).
- **Defense in depth**: Content-Security-Policy and security headers (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) configured in `next.config.ts`.
- **Server-side defense pattern (rubric Fase 5)**: `proxy.ts` at the project root with a scoped `matcher` (Node.js runtime), a Zod-validated Route Handler at `app/api/entropy/route.ts` (returns 200/400/500 with structured errors), and a `server-only`-marked DAL in `lib/entropy.ts`. PassFrases is 100% client-side for crypto and session, so the proxy is illustrative (no login/sessions exist); the Route Handler and DAL demonstrate the authenticate -> validate (Zod) -> mutate -> respond pattern required by the Proyecto 3 rubric without weakening the local-only security model.
- **Password strength checker** at `/strength-checker`: lets you audit any password, not only those generated by PassFrases, with entropy in bits (charset and patterns), estimated crack time in online and offline (GPU) scenarios, and specific accessible recommendations. 100% local: the password is never persisted nor sent.
- **Reinforced cryptography**: PBKDF2 with 600,000 iterations (2023 OWASP recommendation) and AES-GCM 256 for favorites encryption, with a passphrase map kept in memory only for the session.
- **QR transfer** in the single and batch generator: displays a scannable QR code to copy the passphrase to a phone without sending it over the internet. 100% local, the QR is generated in the browser with the `qrcode` library.
- **Keyboard shortcuts** in the generator: `Ctrl/Cmd+G` generates a new passphrase, `Ctrl/Cmd+C` copies the current one (without interfering when there is selected text or a focused input), and `Ctrl/Cmd+B` opens or closes the history panel. A small `⌨️ Atajos` badge in the Clippy assistant lists the available shortcuts.
- **Encrypted favorites backup** on `/favorites` and the floating panel: exports favorites to a `.json` file (ciphertext only) and imports them in another browser without breaking the security model (data stays encrypted with AES-GCM 256 and requires the original passphrase to decrypt).
- **3 automated verification scripts**: `verify:security` (persistence projection, no `Math.random()`, no `alert()`), `verify:architecture` (Server-first routes, browser APIs isolated), `verify:ui` (responsive layouts, React Portals).

### Deploy link

<!-- TODO: add the Vercel link after the first deploy -->

_(pending deploy)_

### Repository link

https://github.com/AlejoElPaisano/proyecto-3-integrarTEC

### Project structure

```
proyecto-3-integrarTEC/
├── app/                          # App Router (routes, layouts, metadata)
│   ├── layout.tsx                # Root Layout: <html>/<body>, next/font, HistoryPanel
│   ├── page.tsx                  # route "/" (start wizard)
│   ├── loading.tsx               # streaming skeleton (root)
│   ├── error.tsx                 # route error boundary (Client)
│   ├── global-error.tsx          # root error boundary (Client, with <html>/<body>)
│   ├── not-found.tsx             # 404 page (Server)
│   ├── sitemap.ts                # programmatic sitemap.xml
│   ├── robots.ts                 # programmatic robots.txt
│   ├── globals.css               # Design tokens (@theme) + Tailwind v4 utilities
│   ├── api/entropy/route.ts      # Zod-validated Route Handler (server-side defense demo)
│   ├── generator/page.tsx        # route "/generator" (Server Component)
│   ├── batch/page.tsx            # route "/batch" (Server Component)
│   ├── strength-checker/page.tsx # route "/strength-checker" (Server Component)
│   ├── history/                  # route "/history" + HistoryPageClient
│   └── favorites/                # route "/favorites" + FavoritesPageClient
├── features/                     # Features by domain
│   ├── generator/                # store, generate, entropy, similarity, wordLists.json
│   ├── batch/                    # BatchGenerator, BatchStateController, HistoryPanel
│   ├── favorites/                # store, hooks, FavoritesPanel, FavoritesBackupButtons, sanitize
│   ├── clippy/                   # ClippyAssistant (floating assistant via Portal)
│   └── strength-checker/         # strength analysis and crack-time estimates
├── lib/entropy.ts                # server-only DAL wrapper for entropy (server-side defense demo)
├── shared/                       # Shared components, hooks and libraries
│   ├── components/ui/             # AppLayout, WizardLayout, CopyButton, Toggle, etc.
│   ├── hooks/                    # useHasMounted.ts, useKeyboardShortcuts.ts
│   ├── lib/                       # crypto/random.ts, strength.ts, site.ts, favorites-io.ts
│   └── types/crypto.types.ts
├── services/crypto.service.ts    # AES-GCM + PBKDF2 (Web Crypto API)
├── proxy.ts                      # Next.js 16 proxy with scoped matcher (server-side defense demo)
├── scripts/                       # verify:security, verify:architecture, verify:ui
├── next.config.ts                # CSP + security headers
└── BUGFIXES.md                   # Bug tracker (7 + 3 regressions)
```

### Development and verification commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm run dev

# Production build
pnpm run build

# Security verification (persistence, Math.random, alert)
pnpm run verify:security

# Responsive UI and React Portals verification
pnpm run verify:ui

# Architecture verification (Server-first routes, browser APIs isolated)
pnpm run verify:architecture

# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint
```

### Environment configuration

| Variable | Use | Default |
|----------|-----|---------|
| `NEXT_PUBLIC_SITE_URL` | Base URL for `sitemap.ts` and `robots.ts` | `https://passfrases.vercel.app` |

---

## Español

PassFrases es un generador de passphrases moderno y matemáticamente seguro, migrado desde una Single Page Application de React + Vite a Next.js 16 (App Router) con TypeScript. Toda la generación y el cifrado ocurre localmente en el navegador mediante la Web Crypto API; ningún secreto viaja a un servidor.

### Integrantes

| Miembro |
|-----------|
| **MARTINEZ ALEJO** |
| **ORTEGA AYELEN** |
| **RIVOIRA AGUSTINA** |
| **VALDIVIEZO GISELE** |
| **BRITEZ EMANUEL** |
| **CALEGARI LUIS** |

### Descripción breve

PassFrases crea frases-contraseña memorables combinando palabras temáticas (animales, naturaleza, verbos, colores, lugares, comida y emociones) con separadores personalizados, mayúsculas, números y símbolos. La entropía se calcula en bits en tiempo real, las frases pueden cifrarse localmente para guardarse en favoritos, y un generador por lote permite producir múltiples variantes con detección de similitud.

### Referencia al proyecto original

Este proyecto es la migración de **`passfrases-proyect`**, una SPA React + Vite desarrollada por el Grupo 6 del Tercer Proyecto Integrador.

Stack del original: React 19, React Router DOM 7, Vite 8, Zustand, Tailwind CSS 4, Web Crypto API.

### Tecnologías utilizadas

| Área | Tecnología |
|------|------------|
| Framework | Next.js 16.3 (App Router, Server & Client Components, Turbopack) |
| Lenguaje | TypeScript 5 |
| Renderizado | SSG por defecto, todas las rutas son estáticas (`○ Static`) |
| Estilos | Híbrido: estilos en línea sobre design tokens (CSS custom properties) + Tailwind CSS v4 utility classes en componentes auxiliares |
| Estado | Zustand 5 con persistencia versionada y saneamiento de legacy |
| Criptografía | Web Crypto API: `crypto.getRandomValues()` (rejection sampling) para generación, AES-GCM 256 + PBKDF2 SHA-256 (600 000 iteraciones) para favoritos |
| Fuentes | `next/font` (Inter + JetBrains Mono) self-hosted, sin CDN |
| SEO | Metadata por ruta, Open Graph, `sitemap.ts` y `robots.ts` programáticos |
| Seguridad | Content-Security-Policy, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy en `next.config.ts`; `proxy.ts` con `matcher` acotado; Route Handler validado con Zod y DAL `server-only` que demuestran el patrón de defensa en el servidor |
| Calidad | ESLint, 3 scripts de verificación custom (seguridad, arquitectura, UI) |

### Bugs encontrados y corregidos

El registro completo y detallado de cada bug, su impacto, verificación y commit de resolución está en [`BUGFIXES.md`](./BUGFIXES.md). Resumen:

| # | Bug | Origen | Estado |
|---|-----|--------|--------|
| 1 | Contraseñas en texto plano persistidas en el historial de sesión | Preexistente | ✅ Resolved |
| 2 | `Math.random()` en generación de números y símbolos | Preexistente | ✅ Resolved |
| 3 | `alert()` nativo y errores silenciosos en el portapapeles | Preexistente | ✅ Resolved |
| 4 | Sin breakpoints responsive explícitos | Preexistente | 🟡 Aceptado (wontfix) |
| 5 | Estilos inline mezclados con Tailwind | Preexistente | 🟡 Híbrido aceptado |
| 6 | Conteo de palabras del README inconsistente con los datos | Preexistente | ✅ Resolved |
| 7 | Sin rutas dedicadas para favoritos e historial | Preexistente | ✅ Resolved |
| R1 | Portapapeles copiaba ciphertext en vez de plaintext | Regresión de migración | ✅ Resolved |
| R2 | Estado Zustand persistido renderizaba antes de la hidratación | Regresión de migración | ✅ Resolved |
| R3 | Páginas de ruta marcadas como Client Components | Regresión de migración | ✅ Resolved |
| A3 | Handlers RSC, desbordamiento móvil de 4 botones y click-outside | UI y Auditoría 3 | ✅ Resolved |

> Los items 8 (Commits sin Convencional Commits) y 9 (autoría git inconsistente)
> del feedback original son observaciones de proceso sobre el repositorio del
> Grupo 6, no bugs de código corregibles con un commit `fix:`. Se amortizan
> naturalmente al usar Conventional Commits en inglés y repartir features entre
> integrantes en el repo migrado; por eso no figuran como entradas de bug en
> [`BUGFIXES.md`](./BUGFIXES.md).

### Funcionalidad extra

Más allá de la migración fiel del original, se incorporaron mejoras que aprovechan capacidades nativas de Next.js y refuerzan la seguridad:

- **Rutas dedicadas `/favorites` y `/history`** con metadata propia y deep-linking (Bug 7), sin duplicar el panel flotante del layout.
- **Infraestructura SEO completa**: `sitemap.ts` y `robots.ts` programáticos, metadata con `title` + `description` + Open Graph en las 6 rutas, canonical URLs.
- **Boundaries de error y carga**: `not-found.tsx` (404), `error.tsx` (boundary de ruta), `global-error.tsx` (boundary raíz), `loading.tsx` (skeleton de streaming).
- **Defensa en profundidad**: Content-Security-Policy y headers de seguridad (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) configurados en `next.config.ts`.
- **Patrón de defensa en el servidor (rúbrica Fase 5)**: `proxy.ts` en la raíz del proyecto con `matcher` acotado (runtime de Node.js), un Route Handler validado con Zod en `app/api/entropy/route.ts` (devuelve 200/400/500 con errores estructurados), y una DAL marcada con `server-only` en `lib/entropy.ts`. PassFrases es 100% client-side para cripto y sesión, así que el proxy es ilustrativo (no hay login/sesiones); el Route Handler y la DAL demuestran el patrón autenticar -> validar (Zod) -> mutar -> responder exigido por la rúbrica del Proyecto 3 sin debilitar el modelo de seguridad local.
- **Verificador de fortaleza de contraseñas** en `/strength-checker`: permite auditar cualquier contraseña, no solo las generadas por PassFrases, con entropía en bits (charset y patrones), tiempo estimado de crackeo en escenarios online y offline con GPU, y recomendaciones accesibles específicas. Es 100% local: la contraseña nunca se persiste ni se envía.
- **Criptografía reforzada**: PBKDF2 con 600 000 iteraciones (recomendación OWASP 2023) y AES-GCM 256 para cifrado de favoritos, con mapa de passphrases solo en memoria por sesión.
- **Transferencia vía QR** en el generador simple y por lote: muestra un código QR escaneable para copiar la passphrase al celular sin enviarla por internet. 100% local, el QR se genera en el navegador con la librería `qrcode`.
- **Atajos de teclado** en el generador: `Ctrl/Cmd+G` genera una nueva passphrase, `Ctrl/Cmd+C` copia la actual (sin interferir cuando hay texto seleccionado o un input enfocado), y `Ctrl/Cmd+B` abre o cierra el panel de historial. Un mini-badge `⌨️ Atajos` en el asistente Clippy lista los atajos disponibles.
- **Backup de favoritos cifrados** en `/favorites` y el panel flotante: exporta los favoritos a un archivo `.json` (solo ciphertext) e impórtalos en otro navegador sin perder el modelo de seguridad (los datos siguen cifrados con AES-GCM 256 y requieren la passphrase original para desencriptarlos).
- **3 scripts de verificación automatizada**: `verify:security` (proyección de persistencia, sin `Math.random()`, sin `alert()`), `verify:architecture` (rutas Server-first, APIs de navegador aisladas), `verify:ui` (layouts responsive, React Portals).

### Link al deploy

<!-- TODO: agregar el link de Vercel tras el primer deploy -->

_(pendiente de deploy)_

### Link al repositorio

https://github.com/AlejoElPaisano/proyecto-3-integrarTEC

### Estructura del proyecto

```
proyecto-3-integrarTEC/
├── app/                          # App Router (rutas, layouts, metadata)
│   ├── layout.tsx                # Root Layout: <html>/<body>, next/font, HistoryPanel
│   ├── page.tsx                  # ruta "/" (wizard de inicio)
│   ├── loading.tsx               # skeleton de streaming (root)
│   ├── error.tsx                 # boundary de error de ruta (Client)
│   ├── global-error.tsx          # boundary de error raíz (Client, con <html>/<body>)
│   ├── not-found.tsx             # página 404 (Server)
│   ├── sitemap.ts                # sitemap.xml programático
│   ├── robots.ts                 # robots.txt programático
│   ├── globals.css               # Design tokens (@theme) + Tailwind v4 utilities
│   ├── api/entropy/route.ts      # Route Handler validado con Zod (demo de defensa en servidor)
│   ├── generator/page.tsx        # ruta "/generator" (Server Component)
│   ├── batch/page.tsx            # ruta "/batch" (Server Component)
│   ├── strength-checker/page.tsx # ruta "/strength-checker" (Server Component)
│   ├── history/                  # ruta "/history" + HistoryPageClient
│   └── favorites/                # ruta "/favorites" + FavoritesPageClient
├── features/                     # Features por dominio
│   ├── generator/                # store, generate, entropy, similarity, wordLists.json
│   ├── batch/                    # BatchGenerator, BatchStateController, HistoryPanel
│   ├── favorites/                # store, hooks, FavoritesPanel, FavoritesBackupButtons, sanitize
│   ├── clippy/                   # ClippyAssistant (asistente flotante via Portal)
│   └── strength-checker/         # análisis de fortaleza y tiempos de crackeo
├── lib/entropy.ts                # DAL server-only para entropía (demo de defensa en servidor)
├── shared/                       # Componentes, hooks y librerías compartidos
│   ├── components/ui/             # AppLayout, WizardLayout, CopyButton, Toggle, etc.
│   ├── hooks/                    # useHasMounted.ts, useKeyboardShortcuts.ts
│   ├── lib/                       # crypto/random.ts, strength.ts, site.ts, favorites-io.ts
│   └── types/crypto.types.ts
├── services/crypto.service.ts    # AES-GCM + PBKDF2 (Web Crypto API)
├── proxy.ts                      # Next.js 16 proxy con matcher acotado (demo de defensa en servidor)
├── scripts/                       # verify:security, verify:architecture, verify:ui
├── next.config.ts                # CSP + security headers
└── BUGFIXES.md                   # Tracker de bugs (7 + 3 regresiones)
```

### Comandos de desarrollo y verificación

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm run dev

# Build de producción
pnpm run build

# Verificación de seguridad (persistencia, Math.random, alert)
pnpm run verify:security

# Verificación de UI responsive y React Portals
pnpm run verify:ui

# Verificación de arquitectura (rutas Server-first, APIs de navegador aisladas)
pnpm run verify:architecture

# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint
```

### Configuración del entorno

| Variable | Uso | Default |
|----------|-----|---------|
| `NEXT_PUBLIC_SITE_URL` | URL base para `sitemap.ts` y `robots.ts` | `https://passfrases.vercel.app` |