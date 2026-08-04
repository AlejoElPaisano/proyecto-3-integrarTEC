# Blueprint de Migración a Next.js (App Router) - PassFrases Project

Este documento contiene el plan técnico y arquitectónico consolidado para migrar la aplicación **PassFrases** desde su arquitectura SPA basada en **Vite + React Router v7** hacia **Next.js 15+ (App Router)**.

---

# Resumen de Dependencias

A partir del análisis del archivo `package.json`, se clasificaron todas las dependencias en tres grupos según su compatibilidad con el **Next.js App Router**:

### ❌ 1. Incompatibles u Obsoletas (A eliminar / reemplazar)
Estas librerías deben ser eliminadas del proyecto puesto que sus funciones son asumidas nativamente por Next.js y su bundler (Turbopack / Webpack):

| Dependencia | Versión | Motivo y Reemplazo en Next.js |
| :--- | :--- | :--- |
| `react-router-dom` | `^7.18.0` | **Obsoleta.** Reemplazada por enrutamiento basado en archivos (`app/`) y utilidades de `next/navigation` (`Link`, `useRouter`, `usePathname`, `redirect`). |
| `vite` | `^8.0.12` | **Obsoleta.** Reemplazado completamente por la CLI y el servidor de compilación/desarrollo de Next.js (`next dev`, `next build`). |
| `@vitejs/plugin-react` | `^6.0.1` | **Obsoleta.** Plugin exclusivo para el ecosistema Vite. |
| `@tailwindcss/vite` | `^4.3.1` | **Incompatible.** Reemplazado por la integración nativa de Tailwind v4 vía `@tailwindcss/postcss`. |
| `eslint-plugin-react-refresh` | `^0.5.2` | **Obsoleta.** Módulo HMR para Vite; Next.js provee Fast Refresh de forma nativa. |

---

### ⚠️ 2. Compatibles pero requieren configuración especial
Librerías que pueden conservarse pero exigen consideraciones de arquitectura para convivir adecuadamente con Server Components y Server-Side Rendering (SSR):

| Dependencia | Versión | Estrategia de Configuración en Next.js |
| :--- | :--- | :--- |
| `zustand` | `^5.0.14` | **Estado Global.** En Next.js App Router, los stores deben consumirse únicamente en Client Components (`'use client'`). El middleware `persist` con `localStorage` requiere guardias de hidratación en el cliente (`useHasMounted`) para evitar errores de *Hydration Mismatch* (*SSR vs Browser*). |
| `tailwindcss` | `^4.3.1` | **Estilos CSS.** Tailwind v4 utiliza la directiva `@import "tailwindcss";` en el archivo CSS global (`app/globals.css`). Requiere instalar `@tailwindcss/postcss` y configurar `postcss.config.mjs` para su procesamiento correcto. |

---

### ✅ 3. Totalmente compatibles y listas para migrar
Librerías utilitarias e infraestructura de desarrollo 100% compatibles sin cambios de código:

| Dependencia | Versión | Tipo | Notas |
| :--- | :--- | :--- | :--- |
| `clsx` | `^2.1.1` | Dependencia | Construcción condicional de clases CSS. |
| `tailwind-merge` | `^3.6.0` | Dependencia | Fusión de clases Tailwind sin conflictos. |
| `lucide-react` | `^1.21.0` | Dependencia | Componentes de iconos vectoriales (compatibles con Server y Client Components). |
| `react` / `react-dom` | `^19.2.6` | Dependencia | Gestionados nativamente por Next.js 15+. |
| `typescript` | `~6.0.2` | DevDependency | Soporte nativo de primer nivel en Next.js. |
| `@types/node`, `@types/react`, `@types/react-dom` | Varios | DevDependencies | Tipado estático para Node.js y React. |
| `@biomejs/biome`, `eslint`, `typescript-eslint` | Varios | DevDependencies | Herramientas de linter y formateo. |

---

# Mapa de Rutas (Estructura propuesta para app/)

La aplicación actual en React Router v7 define 3 rutas principales en `src/app/router.tsx`. A continuación se presenta el mapeo de migración hacia la estructura basada en archivos del **Next.js App Router**:

```text
passfrases-proyect/
├── app/
│   ├── layout.tsx         # Root Layout (Server Component base, fuentes de Google, metadatos globales)
│   ├── globals.css        # Estilos globales (Tailwind v4 @import + @theme)
│   ├── page.tsx           # Ruta '/' (Wizard Paso 1: Landing / Introducción)
│   ├── generator/
│   │   └── page.tsx       # Ruta '/generator' (Wizard Paso 2 y 3: Formulario, Entropía y Asistente)
│   └── batch/
│       └── page.tsx       # Ruta '/batch' (Generación masiva en lote)
├── postcss.config.mjs     # Configuración PostCSS para Tailwind v4 (@tailwindcss/postcss)
└── tailwind.config.ts     # Configuración JS/TS de Tailwind (Opcional en v4)
```

### Tabla de Equivalencia de Rutas:

| URL SPA Actual | Componente Origen (React Router) | Ruta Destino (Next.js App Router) | Tipo de Componente | Propósito / Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `WizardStartPage.tsx` | `app/page.tsx` | Server Component | **Paso 1:** Pantalla de bienvenida y presentación de beneficios principales. |
| `/generator` | `GeneratorPage.tsx` | `app/generator/page.tsx` | Server Component | **Paso 2 y 3:** Formulario de personalización, métricas de entropía y asistente Clippy. |
| `/batch` | `BatchPage.tsx` | `app/batch/page.tsx` | Server Component | **Paso 3 Lote:** Generador masivo de frases de seguridad en bloque. |

---

# Estrategia de Estado y Componentes Críticos

### 1. Diagnóstico y Estrategia de Estado Global (Zustand)
El estado global de la aplicación está descentralizado en dos stores de **Zustand**:
1. **`usePasswordStore`** ([src/features/generator/store.ts](file:///c:/Users/lucas/VS/fundacion-integrar/integradores/tp-3-migraciones/passfrases-proyect/src/features/generator/store.ts)): Controla la configuración de la passphrase (`wordCount`, `separator`, etc.), el resultado activo, el historial de sesión en memoria y la visibilidad del drawer. Usa `persist` en `localStorage`.
2. **`useFavoriteStore`** ([src/features/favorites/store.ts](file:///c:/Users/lucas/VS/fundacion-integrar/integradores/tp-3-migraciones/passfrases-proyect/src/features/favorites/store.ts)): Almacena contraseñas favoritas cifradas previamente en el navegador con Web Crypto API. Usa `persist` en `localStorage`.

#### Consideraciones para Next.js App Router:
* **Prevención de Hydration Mismatch:** Durante el Server-Side Rendering (SSR), `localStorage` no existe en Node.js. Si Zustand restaura el estado guardado antes de montar el componente en el navegador, React 19 arrojará un *Hydration Mismatch Error*. Se implementará un hook de montaje (`useHasMounted` / `isHydrated`) para renderizar componentes persistidos solo tras el montaje en el cliente.
* **Aislamiento de Criptografía:** El servicio `crypto.service.ts` hace uso de `window.crypto.subtle` y no debe invocarse durante la fase de SSR en el servidor.

---

### 2. Clasificación de Componentes (Server vs Client Components)

#### 🧱 Server Components (RSC)
* **`app/layout.tsx`**: Define la estructura HTML base (`<html>`, `<body>`), carga fuentes con `next/font/google`, metadatos universales de SEO y estilos CSS globales.
* **`app/page.tsx`**, **`app/generator/page.tsx`**, **`app/batch/page.tsx`**: Páginas contenedoras que renderizan la estructura layout estática.
* **`WizardLayout.tsx`**: Layout contenedor visual para las vistas tipo tarjeta.

---

#### ⚡ Client Components (`'use client'`) - Top 5 Componentes Críticos

##### 1. `HistoryPanel.tsx` ([src/features/batch/components/HistoryPanel.tsx](file:///c:/Users/lucas/VS/fundacion-integrar/integradores/tp-3-migraciones/passfrases-proyect/src/features/batch/components/HistoryPanel.tsx))
* **Rol:** Drawer lateral y panel modal flotante de historial y favoritos.
* **Razones para `'use client'`:**
  * Utiliza `useState` para control de pestañas, elementos copiados y confirmaciones.
  * Invocación asíncrona a `crypto.service.ts` (`encryptPassword`) y Web Clipboard API (`navigator.clipboard.writeText`).
  * Consume los stores de Zustand `usePasswordStore` y `useFavoriteStore`.
  * Renderiza modales interactivos (`ConfirmDialog`).

##### 2. `ClippyAssistant.tsx` ([src/features/clippy/components/ClippyAssistant.tsx](file:///c:/Users/lucas/VS/fundacion-integrar/integradores/tp-3-migraciones/passfrases-proyect/src/features/clippy/components/ClippyAssistant.tsx))
* **Rol:** Asistente interactivo flotante de consejos de seguridad.
* **Razones para `'use client'`:**
  * Reacciona dinámicamente en tiempo real a los cambios de configuración del store `usePasswordStore`.
  * Emplea `useState` y `useMemo` para la selección aleatoria de tips (`crypto.getRandomValues`) y descarte de globos de diálogo.

##### 3. `GeneratorForm.tsx` ([src/features/generator/components/GeneratorForm.tsx](file:///c:/Users/lucas/VS/fundacion-integrar/integradores/tp-3-migraciones/passfrases-proyect/src/features/generator/components/GeneratorForm.tsx))
* **Rol:** Formulario principal de personalización de passphrases.
* **Razones para `'use client'`:**
  * Maneja entradas interactivas (slider de cantidad de palabras, selectores, switches `ToggleOption`).
  * Escucha eventos de teclado a nivel de ventana (`useEffect` con `keydown` para tecla Escape).
  * Despacha actualizaciones en tiempo real a `usePasswordStore`.

##### 4. `PasswordActions.tsx` ([src/features/generator/components/PasswordActions.tsx](file:///c:/Users/lucas/VS/fundacion-integrar/integradores/tp-3-migraciones/passfrases-proyect/src/features/generator/components/PasswordActions.tsx)) / `CopyButton.tsx`
* **Rol:** Botones de acción principal (Copiar, Regenerar, Añadir a Favoritos).
* **Razones para `'use client'`:**
  * Interacción directa con `navigator.clipboard.writeText`.
  * Manejo de estados temporales de feedback de copia con `setTimeout`.
  * Modales interactivos para asignar etiquetas a contraseñas favoritas antes de encriptarlas.

##### 5. `BatchGenerator.tsx` ([src/features/batch/components/BatchGenerator.tsx](file:///c:/Users/lucas/VS/fundacion-integrar/integradores/tp-3-migraciones/passfrases-proyect/src/features/batch/components/BatchGenerator.tsx))
* **Rol:** Herramienta de generación de passphrases en lote.
* **Razones para `'use client'`:**
  * Control de inputs numéricos y regeneración por lotes.
  * Análisis visual instantáneo de advertencias de reutilización y similitud (`checkReuseWarnings`).
  * Copia masiva de múltiples contraseñas al portapapeles.

---

# Plan de Optimización (next/image y next/font)

### 1. Optimización de Imágenes (`next/image`)
* **Auditoría de `<img>`:** La aplicación actual **no utiliza etiquetas `<img>`** en el código fuente de `src/` (`0` coincidencias). Todos los recursos gráficos de la interfaz emplean componentes vectoriales SVG (`lucide-react`) o emojis Unicode.
* **Favicon e Iconos:** En Next.js (App Router), el favicon se gestiona mediante convenciones de archivos en la carpeta `app/` (`app/favicon.ico` o `app/icon.png`) o exportando metadatos en `app/layout.tsx`.
* **Imágenes Futuras:** Toda nueva imagen rasterizada (`.png`, `.jpg`, `.webp`) deberá implementarse mediante la importación de `next/image`:
  ```tsx
  import Image from 'next/image';
  ```

---

### 2. Optimización de Fuentes (`next/font/google`)
* **Estado Actual:** Las fuentes `Inter` y `JetBrains Mono` se cargan mediante una directiva `@import` en `src/index.css`. Esto causa bloqueo del renderizado (*render-blocking*) y requiere peticiones HTTP externas.
* **Plan de Implementación en Next.js:**
  1. Eliminar la directiva `@import url("https://fonts.googleapis.com/css2...")` de `app/globals.css`.
  2. Importar e inicializar las fuentes autohospedadas en `app/layout.tsx`:
     ```tsx
     import { Inter, JetBrains_Mono } from 'next/font/google';

     const inter = Inter({
       subsets: ['latin'],
       variable: '--font-sans',
       display: 'swap',
     });

     const jetbrainsMono = JetBrains_Mono({
       subsets: ['latin'],
       variable: '--font-mono',
       display: 'swap',
     });

     export default function RootLayout({ children }: { children: React.ReactNode }) {
       return (
         <html lang="es" class={`${inter.variable} ${jetbrainsMono.variable}`}>
           <body>{children}</body>
         </html>
       );
     }
     ```
  3. Vincular las variables CSS en `app/globals.css` (Tailwind v4 `@theme`):
     ```css
     @theme {
       --font-sans: var(--font-sans), system-ui, sans-serif;
       --font-mono: var(--font-mono), monospace;
     }
     ```

---

### 3. Archivos de Configuración de Estilos (Tailwind CSS v4)

#### A. `postcss.config.mjs`
```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

#### B. `tailwind.config.ts` (Opcional en v4)
*En Tailwind v4 la configuración es CSS-first via `@theme` en `app/globals.css`. Sin embargo, si se requiere un archivo de configuración explícito, la estructura es:*

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

#### C. `app/globals.css`
```css
@import "tailwindcss";

/* ─── Design tokens (Tailwind v4 @theme) ────────────────────── */
@theme {
  /* Colors */
  --color-surface:      #0b0f1a;
  --color-card:         rgba(14, 20, 38, 0.6);
  --color-card-hover:   rgba(18, 24, 46, 0.75);
  --color-border:       rgba(129, 140, 248, 0.12);
  --color-border-hover: rgba(129, 140, 248, 0.25);
  --color-border-focus: #818cf8;
  --color-accent:       #818cf8;
  --color-accent-hover: #a5b4fc;
  --color-accent-soft:  rgba(129, 140, 248, 0.12);
  --color-success:      #22c55e;
  --color-success-soft: rgba(34, 197, 94, 0.12);
  --color-warning:      #f59e0b;
  --color-error:        #ef4444;
  --color-pink:         #ec4899;
  --color-pink-glow:    rgba(236, 72, 153, 0.3);
  --color-cyan:         #06b6d4;
  --color-orange:       #f97316;
  --color-orange-glow:  rgba(249, 115, 22, 0.35);

  /* Text */
  --color-text:           #eeedf5;
  --color-text-secondary: #9690b8;
  --color-text-tertiary:  #7a7aaa;

  /* Gradients */
  --gradient-cta:  linear-gradient(135deg, #ec4899, #818cf8);
  --gradient-blue: linear-gradient(135deg, #818cf8, #6d5cf7);

  /* Glass */
  --glass-bg:     rgba(14, 20, 38, 0.6);
  --glass-border: rgba(129, 140, 248, 0.12);
  --glass-shadow: 0 8px 48px rgba(0, 0, 0, 0.5),
                  inset 0 1px 0 rgba(255, 255, 255, 0.04);

  /* Spacing & Radius */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;

  --radius-sm: 6px;   --radius-md: 10px;
  --radius-lg: 16px;  --radius-xl: 24px;
  --radius-card: 16px;
  --radius-pill: 99px;

  /* Typography */
  --font-sans: var(--font-sans), system-ui, sans-serif;
  --font-mono: var(--font-mono), monospace;

  /* Motion */
  --ease-out:       cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast:  150ms;
  --duration-normal: 300ms;
  --duration-slow:  500ms;
}

/* ─── Base global ───────────────────────────────────────────── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background: var(--color-surface);
  color: var(--color-text);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 60% at 50% 0%,
    rgba(129, 140, 248, 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

body::after {
  content: "";
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(129, 140, 248, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(129, 140, 248, 0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 0;
}

.skip-link {
  position: absolute;
  top: -100%;
  left: 8px;
  padding: 8px 16px;
  background: var(--color-accent);
  color: #fff;
  border-radius: var(--radius-sm);
  z-index: 9999;
  font-weight: 600;
  font-size: 0.875rem;
}
.skip-link:focus {
  top: 8px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.glass-card {
  position: relative;
  overflow: hidden;
}
.glass-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(129, 140, 248, 0.03) 0%,
    transparent 50%
  );
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# Estrategia SEO y Metadatos

### 1. Diagnóstico de SEO en la SPA Actual
* La SPA actual carece de optimización SEO: posee un título genérico (`passfrases-proyect`), no incluye etiqueta `<meta name="description">` ni etiquetas Open Graph (`og:*`), y no utiliza librerías de Head Manager (`react-helmet`). Tampoco actualiza `document.title` dinámicamente durante la navegación.

---

### 2. Implementación de Metadata API en Next.js (App Router)
Next.js reemplaza la manipulación del DOM por la **Metadata API** estática basada en la exportación del objeto `metadata` en cada página:

#### A. `app/layout.tsx` (Metadatos Base y Plantilla Global)
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'PassFrases | Tu contraseña perfecta',
    template: '%s | PassFrases',
  },
  description: 'Generá passphrases matemáticamente seguras, fáciles de recordar y cifradas localmente en el navegador.',
  openGraph: {
    title: 'PassFrases | Generador de Contraseñas Seguras',
    description: 'Crea passphrases de alta entropía y gestión de favoritos cifrados.',
    type: 'website',
  },
};
```

#### B. `app/page.tsx` (Ruta `/` - Inicio)
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inicio | PassFrases',
  description: 'Bienvenido a PassFrases. Crea contraseñas y frases de seguridad matemáticamente robustas.',
};
```

#### C. `app/generator/page.tsx` (Ruta `/generator` - Generador Principal)
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generador | PassFrases',
  description: 'Personalizá la cantidad de palabras, separadores, números y símbolos con análisis de entropía en tiempo real.',
};
```

#### D. `app/batch/page.tsx` (Ruta `/batch` - Generación por Lote)
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generación por Lote | PassFrases',
  description: 'Generá múltiples frases de seguridad simultáneamente con detección automática de similitud y reutilización.',
};
```

---

# Deuda Técnica de Accesibilidad

Revisión técnica de accesibilidad (a11y) a saldar obligatoriamente durante la creación de componentes en Next.js:

1. **Imágenes (`<img>`) sin atributo `alt`:**
   * *Estado:* Sin deuda técnica. No se utilizan etiquetas `<img>` en los componentes UI (se emplean vectores de `lucide-react`).

2. **Elementos de formulario (`<input>`, `<select>`) sin `<label>` asociado:**
   * ⚠️ **`BatchGenerator.tsx` (Línea 43):** Muestra `<label htmlFor="batchCount">Cantidad</label>`, pero no existe ningún `<input>` o `<select>` con `id="batchCount"` (se utilizan botones numéricos de selección).
   * *Solución:* Agrupar los botones dentro de un contenedor con `role="group"` y `aria-labelledby` o implementar un `<select id="batchCount">`.

3. **Botones (`<button>`) sin texto claro o `aria-label`:**
   * ⚠️ **`GeneratorForm.tsx` (Componente `ToggleOption`, Línea 335):** Los botones con `role="switch"` (`id="includeNumbers"`, `id="includeSymbols"`, `id="capitalize"`) no tienen `aria-label` ni texto accesible en el cuerpo del `<button>` (solo contienen un `<span>` decorativo).
   * *Solución:* Agregar la propiedad `aria-label={label}` o `aria-labelledby={id}` directamente en el `<button role="switch">`.
   * ⚠️ **`BatchGenerator.tsx` (Líneas 50-61):** Los botones de selección de cantidad (`3`, `5`, `10`, `20`) solo muestran el número sin contexto accesible.
   * *Solución:* Agregar `aria-label={`Seleccionar ${n} frases`}` a cada botón.

---
*Documento generado automáticamente como Blueprint de migración a Next.js (App Router).*
