# PassFrases

PassFrases es un generador de passphrases moderno y matemáticamente seguro, migrado desde una Single Page Application de React + Vite a Next.js 16 (App Router) con TypeScript. Toda la generación y el cifrado ocurren localmente en el navegador mediante la Web Crypto API; ningún secreto viaja a un servidor.

## Integrantes

<!-- TODO: completar nombres y datos de contacto antes de la entrega final -->

- _(a completar)_

## Descripción breve

PassFrases crea frases-contraseña memorables combinando palabras temáticas (animales, naturaleza, verbos, colores, lugares, comida y emociones) con separadores personalizados, mayúsculas, números y símbolos. La entropía se calcula en bits en tiempo real, las frases pueden cifrarse localmente para guardarse en favoritos, y un generador por lote permite producir múltiples variantes con detección de similitud.

## Referencia al proyecto original

Este proyecto es la migración de **`passfrases-proyect`**, una SPA React + Vite desarrollada por el Grupo 6 del Tercer Proyecto Integrador. El código original se conserva en la carpeta [`Proyecto2ViejoGrupo6/`](./Proyecto2ViejoGrupo6) dentro de este mismo repositorio para fines de comparación y auditoría.

Stack del original: React 19, React Router DOM 7, Vite 8, Zustand, Tailwind CSS 4, Web Crypto API.

## Tecnologías utilizadas

| Área | Tecnología |
|------|------------|
| Framework | Next.js 16.3 (App Router, Server & Client Components, Turbopack) |
| Lenguaje | TypeScript 5 |
| Renderizado | SSG por defecto, todas las rutas son estáticas (`○ Static`) |
| Estilos | Tailwind CSS v4 + design tokens por CSS custom properties |
| Estado | Zustand 5 con persistencia versionada y saneamiento delegacy |
| Criptografía | Web Crypto API: `crypto.getRandomValues()` (rejection sampling) para generación, AES-GCM 256 + PBKDF2 SHA-256 (600 000 iteraciones) para favoritos |
| Fuentes | `next/font` (Inter + JetBrains Mono) self-hosted, sin CDN |
| SEO | Metadata por ruta, Open Graph, `sitemap.ts` y `robots.ts` programáticos |
| Seguridad | Content-Security-Policy, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy en `next.config.ts` |
| Calidad | ESLint, 3 scripts de verificación custom (seguridad, arquitectura, UI) |

## Bugs encontrados y corregidos

El registro completo y detallado de cada bug, su impacto, verificación y commit de resolución está en [`BUGFIXES.md`](./BUGFIXES.md). Resumen:

| # | Bug | Origen | Estado |
|---|-----|--------|--------|
| 1 | Contraseñas en texto plano persistidas en el historial de sesión | Preexistente | ✅ Resolved |
| 2 | `Math.random()` en generación de números y símbolos | Preexistente | ✅ Resolved |
| 3 | `alert()` nativo y errores silenciosos en el portapapeles | Preexistente | ✅ Resolved |
| 4 | Sin breakpoints responsive explícitos | Preexistente | ✅ Resolved |
| 5 | Estilos inline mezclados con Tailwind | Preexistente | ✅ Resolved |
| 6 | Conteo de palabras del README inconsistente con los datos | Preexistente | ✅ Resolved |
| 7 | Sin rutas dedicadas para favoritos e historial | Preexistente | ✅ Resolved |
| 8 | Commits sin Convencional Commits | Proceso | ✅ Closed (out-of-scope de migración) |
| 9 | Autoría git inconsistente | Proceso | ✅ Closed (out-of-scope de migración) |
| R1 | Portapapeles copiaba ciphertext en vez de plaintext | Regresión de migración | ✅ Resolved |
| R2 | Estado Zustand persistido renderizaba antes de la hidratación | Regresión de migración | ✅ Resolved |
| R3 | Páginas de ruta marcadas como Client Components | Regresión de migración | ✅ Resolved |

## Funcionalidad extra

Más allá de la migración fiel del original, se incorporaron mejoras que aprovechan capacidades nativas de Next.js y refuerzan la seguridad:

- **Rutas dedicadas `/favorites` y `/history`** con metadata propia y deep-linking (Bug 7), sin duplicar el panel flotante del layout.
- **Infraestructura SEO completa**: `sitemap.ts` y `robots.ts` programáticos, metadata con `title` + `description` + Open Graph en las 5 rutas, canonical URLs.
- **Boundaries de error y carga**: `not-found.tsx` (404), `error.tsx` (boundary de ruta), `global-error.tsx` (boundary raíz), `loading.tsx` (skeleton de streaming).
- **Defensa en profundidad**: Content-Security-Policy y headers de seguridad (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) configurados en `next.config.ts`.
- **Criptografía reforzada**: PBKDF2 con 600 000 iteraciones (recomendación OWASP 2023) y AES-GCM 256 para cifrado de favoritos, con mapa de passphrases solo en memoria por sesión.
- **3 scripts de verificación automatizada**: `verify:security` (proyección de persistencia, sin `Math.random()`, sin `alert()`), `verify:architecture` (rutas Server-first, APIs de navegador aisladas), `verify:ui` (layouts responsive, React Portals).

## Link al deploy

<!-- TODO: agregar el link de Vercel tras el primer deploy -->

_(pendiente de deploy)_

## Link al repositorio

https://github.com/AlejoElPaisano/proyecto-3-integrarTEC

## Estructura del proyecto

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
│   ├── globals.css               # Tailwind v4 + design tokens (@theme)
│   ├── generator/page.tsx        # ruta "/generator" (Server Component)
│   ├── batch/page.tsx            # ruta "/batch" (Server Component)
│   ├── history/                  # ruta "/history" + HistoryPageClient
│   └── favorites/                # ruta "/favorites" + FavoritesPageClient
├── features/                     # Features por dominio
│   ├── generator/                # store, generate, entropy, similarity, wordLists.json
│   ├── batch/                    # BatchGenerator, BatchStateController, HistoryPanel
│   ├── favorites/                # store, hooks, FavoritesPanel
│   └── clippy/                   # ClippyAssistant (asistente flotante via Portal)
├── shared/                       # Componentes, hooks y librerías compartidos
│   ├── components/ui/             # AppLayout, WizardLayout, CopyButton, Toggle, etc.
│   ├── hooks/useHasMounted.ts     # guard de hidratación
│   ├── lib/                       # cn (clsx+twMerge), crypto/random.ts, site.ts
│   └── types/crypto.types.ts
├── services/crypto.service.ts    # AES-GCM + PBKDF2 (Web Crypto API)
├── scripts/                       # verify:security, verify:architecture, verify:ui
├── next.config.ts                # CSP + security headers
├── BUGFIXES.md                   # Tracker de bugs (9 + 3 regresiones)
└── Proyecto2ViejoGrupo6/          # Código original React+Vite (referencia)
```

## Comandos de desarrollo y verificación

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

## Configuración del entorno

| Variable | Uso | Default |
|----------|-----|---------|
| `NEXT_PUBLIC_SITE_URL` | URL base para `sitemap.ts` y `robots.ts` | `https://passfrases.vercel.app` |