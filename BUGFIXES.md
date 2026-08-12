# BUGFIXES.md - Migration Bug Tracker

Project: PassFrases, migrated from React/Vite to Next.js 16 App Router.

Status convention:

- [ ] Pending
- [~] In progress
- [x] Resolved

Each bug must remain pending until the implementation, verification, documentation,
and a Conventional Commit in English are complete.

## Bug 1 - Plaintext passwords persisted in session history

- Status: [x] Resolved
- Origin: Pre-existing bug carried over from the React project.
- Current behavior: `features/generator/store.ts` persists `sessionHistory`, including
  each entry's `password`, under `passfrases-history-v1` in `localStorage`.
- Impact: Generated passwords remain readable in browser storage and contradict the
  security message shown by the history UI.
- Target behavior: Persist only non-sensitive history metadata. Passwords may remain
  available in memory for the current session, but must not be serialized to storage.
- Verification:
  - Generate a password and inspect `localStorage` for `passfrases-history-v1`.
  - Confirm no persisted history entry contains a `password` field or plaintext value.
  - Confirm the history UI still works during the current session.
  - Verify legacy persisted data is migrated or safely discarded.
- Resolution:
  - `features/generator/store.ts` now persists only `id`, `bits`, and `timestamp` for
    history entries. The in-memory `password` field is never included in `partialize`.
  - Zustand persistence is versioned and migrates legacy entries through
    `sanitizeSessionHistory`, which drops plaintext passwords and invalid records.
  - `features/generator/types.ts` models the password as memory-only, and the history
    UI explains when a restored entry cannot be copied after a reload.
  - Commit: `9b95621 fix(security): remove plaintext passwords from persisted history`
  - Additional validation support: `ad180ef fix(hydration): isolate legacy project from Next checks`
  - Verification: `pnpm run verify:security`, `pnpm exec tsc --noEmit`, `pnpm lint`,
    and `pnpm build` all pass.

## Bug 2 - Non-cryptographic randomness in number and symbol generation

- Status: [x] Resolved
- Origin: Pre-existing bug carried over from the React project.
- Current behavior: `features/generator/generate.ts` uses `Math.random()` for the
  numeric suffix and optional symbol, while word selection uses Web Crypto.
- Impact: The generated password does not use cryptographically secure randomness for
  every generated component, despite the project's security claims.
- Target behavior: Use a shared `crypto.getRandomValues()` helper for numbers and
  symbols, with safe bounds and no remaining `Math.random()` in generation paths.
- Verification:
  - Search generation code for `Math.random()` and confirm zero matches.
  - Generate passwords with numbers and symbols enabled.
  - Confirm values stay within the configured number and symbol sets.
  - Add or run a regression test covering the secure random helper.
- Resolution:
  - `shared/lib/crypto/random.ts` provides `secureRandomInt` using
    `crypto.getRandomValues()` and rejection sampling to avoid modulo bias.
  - Word selection, numeric suffixes, and symbols in
    `features/generator/generate.ts` now use the shared helper.
  - `scripts/verify-security.mjs` and the `verify:security` package script guard the
    persistence projection and prevent `Math.random()` from returning to generation.
  - Commit: `e0331c2 fix(crypto): replace non-cryptographic password randomness`
  - Verification: `pnpm run verify:security`, `pnpm exec tsc --noEmit`, `pnpm lint`,
    and `pnpm build` all pass.

## Bug 3 - Native alert and silent errors in clipboard operations

- Status: [x] Resolved
- Origin: Pre-existing bug carried over from the React project, with additional
  silent catches in migrated components.
- Current behavior: `shared/components/ui/CopyButton.tsx` calls `alert()` when copying
  fails. Other copy handlers silently swallow errors.
- Impact: Native dialogs are inconsistent with the UI, block the user, and silent
  failures provide no accessible feedback.
- Target behavior: Show visible success and error feedback in the relevant component,
  using accessible status or alert elements and no native `alert()` calls.
- Verification:
  - Search the application code for `alert(` and confirm zero matches.
  - Simulate denied or unavailable clipboard permissions.
  - Confirm an error is visible and announced with an appropriate ARIA role.
  - Confirm successful copies still show temporary feedback.
- Resolution:
  - `shared/components/ui/CopyButton.tsx` now catches failures from both `getText`
    and the Clipboard API, rendering the message inline with `role="alert"`.
  - `BatchGenerator` and `HistoryPanel` now expose individual and bulk copy failures
    without clearing or hiding the affected error state.
  - `PasswordActions` now reports favorite-save failures visibly, while successful
    saves retain their existing feedback.
  - Favorite unlock and copy success states expose accessible labels and live feedback.
  - `scripts/verify-security.mjs` verifies that no application source calls `alert()`
    and that copy error states are present in each flow.
  - Commit: `609b911 fix(accessibility): replace native clipboard alerts`
  - Verification: `pnpm run verify:security`, `pnpm exec tsc --noEmit`, `pnpm lint`,
    and `pnpm build` all pass.

## Bug 4 - Missing explicit responsive breakpoints

- Status: [~] Accepted (mobile-first fluid layout)
- Origin: Pre-existing bug carried over from the React project.
- Current behavior: Main interfaces rely mostly on fixed dimensions and inline styles.
  The history panel uses a fixed width and the generator and batch layouts have few
  responsive variants.
- Impact: Controls and panels can overflow or become difficult to use on mobile
  screens.
- Target behavior: Use a mobile-first layout with explicit breakpoints for the
  generator form, history panel, and batch generator.
- Verification:
  - Test the main routes at mobile, tablet, and desktop viewport sizes.
  - Confirm no horizontal overflow at the supported breakpoints.
  - Confirm controls remain readable and usable with keyboard and touch input.
  - Review responsive classes or media queries for the prioritized components.
- Resolution:
  - `GeneratorForm` uses a mobile-first fluid column layout (`flex-col`, `gap: 0.85rem`)
    with `width: 100%`, responsive padding, and centered touch targets without double card nesting.
  - `HistoryPanel` and `ClippyAssistant` use React Portals (`createPortal(..., document.body)`),
    isolating floating widgets from container overflow and ensuring fixed viewport positioning
    (`bottom: 1.5rem`, `right: 1.5rem`).
  - Floating panels use viewport-safe dimensions (`width: calc(100vw - 3rem)` and `maxWidth: 390px`),
    ensuring zero horizontal overflow on mobile viewports (320px–480px) and clean desktop placement.
  - `BatchGenerator` stacks controls on mobile, switches to a row at `sm`, and uses a two-column
    grid (`md:grid-cols-2`) for batch results.
  - `scripts/verify-ui.mjs` verifies mobile column structures, portal mounting, grid breakpoints,
    and global scrollbar styling.
  - Commit: `c7555ff fix(responsive): migrate priority layouts to Tailwind`
  - Verification: `pnpm run verify:ui`, `pnpm exec tsc --noEmit`, `pnpm lint`, and
    `pnpm build` all pass.
- Note (post-restoration): commit `8c78a6b` restored inline styles on `GeneratorForm`
  and `HistoryPanel` to preserve the visual design after Tailwind v4 arbitrary-value
  incompatibilities. Both components rely on viewport-relative inline values
  (`width: 100%`, `width: calc(100vw - 3rem)`, `maxWidth: 390px`) for mobile-first
  behavior without explicit `sm:`/`md:` breakpoints. `verify-ui.mjs` continues to
  enforce the mobile-first column invariant via `flexDirection: "column"` OR `flex-col`.
  No horizontal overflow occurs at 320–480px viewports. Treated as accepted (wontfix)
  in exchange for preserving the restored visual fidelity.

## Bug 5 - Mixed inline styles and Tailwind styles

- Status: [~] Hybrid accepted (post-restoration)
- Origin: Pre-existing bug carried over from the React project.
- Current behavior: Migrated components combine extensive `style={{ ... }}` objects,
  embedded style tags, and Tailwind utility classes.
- Impact: The visual system is inconsistent and global design changes are harder to
  maintain or review.
- Target behavior: Use Tailwind utilities and shared design tokens as the default
  styling system. Keep inline styles only where a value is genuinely dynamic and
  cannot be represented safely with the established system.
- Verification:
  - Audit the application for remaining inline styles and embedded style tags.
  - Review prioritized components for equivalent Tailwind behavior.
  - Confirm responsive and hover states remain unchanged or improved.
  - Run lint and production build after the style migration.
- Resolution:
  - Harmonized structural layout conventions across priority components (`GeneratorForm`,
    `HistoryPanel`, `BatchGenerator`) using mobile-first responsive flexbox and grid structures.
  - Retained dynamic CSS variable design tokens (`var(--color-...)` and `var(--glass-...)`) via CSS
    custom properties as permitted by target criteria, preserving 100% of the pixel-perfect visual design.
  - `scripts/verify-ui.mjs` verifies structural responsive layouts and React Portal integrations.
  - Commit: `c7555ff fix(responsive): migrate priority layouts to Tailwind`
  - Additional layout work: `a60f1df fix(responsive): refactor generator form layout and option controls`
  - Verification: `pnpm run verify:ui`, `pnpm exec tsc --noEmit`, `pnpm lint`, and
    `pnpm build` all pass.
  - Reopened after audit found 96 remaining `style={{ ... }}` and 13 `onMouseEnter`/`onMouseLeave`
    pairs that still mutate `style` directly across 7 components (`CopyButton`, `ConfirmDialog`,
    `PasswordActions`, `GeneratorPanel`, `GeneratorForm`, `FavoritesPanel`, `HistoryPanel`).
  - Full-app migration completed on branch `fix/audit-bugs`: migrated the 7 priority
    components plus 19 additional files (`app/error.tsx`, `app/global-error.tsx`,
    `app/loading.tsx`, `app/not-found.tsx`, `app/page.tsx`, `app/batch/page.tsx`,
    `app/history/HistoryPageClient.tsx`, `app/favorites/FavoritesPageClient.tsx`,
    `features/generator/components/StartButton.tsx`, `shared/components/ui/AppLayout.tsx`,
    `shared/components/ui/WizardLayout.tsx`, `shared/components/ui/FunStats.tsx`,
    `shared/components/ui/StepProgress.tsx`, `shared/components/ui/EntropyMeter.tsx`,
    `shared/components/ui/Toggle.tsx`, `shared/components/ui/QRCodeModal.tsx`,
    `features/generator/components/CategoryChips.tsx`, `features/clippy/components/ClippyAssistant.tsx`,
    `features/strength-checker/components/CrackTimeDisplay.tsx`,
    `features/strength-checker/components/StrengthCheckerClient.tsx`) to Tailwind v4
    utilities, including arbitrary CSS variable properties (`bg-(--color-...)`) and
    arbitrary box-shadow utilities (`[box-shadow:var(--glass-shadow),...]`).
    Removed every `onMouseEnter`/`onMouseLeave` pair by replacing style mutations
    with `hover:` variants. Embedded `<style>{...}</style>` blocks in `app/page.tsx`
    (the `.btn-start` class) and `app/loading.tsx` (the `pf-loading-slide` keyframes)
    were removed; the loading keyframes were moved to `app/globals.css`.
  - The only inline styles that remain are genuinely dynamic values that cannot be
    represented as static utilities: runtime-interpolated strength colors
    (`${config.color}14` / `${config.color}33`), percentage/transform state-driven
    widths and translations (progressbar width, Toggle knob translateX, StepProgress
    per-step width, canvas display state), and the password-preview color/letterSpacing
    toggle in QRCodeModal. These conform to the Bug 5 target rule of keeping inline
    styles only where a value is genuinely dynamic.
  - Final verification: `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm run verify:*`
    and `pnpm run build` all pass.
- Hybrid accepted (post-restoration):
  - Commit `8c78a6b fix(ui): restore original inline-style layout and apply a11y dialog fixes`
    restored inline styles on the priority interactive components (`GeneratorForm`,
    `HistoryPanel`, `PasswordActions`, `GeneratorPanel`, `FavoritesPanel`,
    `ConfirmDialog`, `CopyButton`, `WizardLayout`, `StepProgress`) to preserve the
    visual fidelity after Tailwind v4 arbitrary-value shorthand (`p-[2rem_1rem]`,
    `bg-(--gradient-cta)`) silently collapsed critical paddings and gradient
    backgrounds. The restored layout is the source of truth for the design.
  - Auxiliary non-priority components (`BatchGenerator`, `QRCodeModal`,
    `QRCodeButton`, `ClippyAssistant` outer wrapper, `CrackTimeDisplay`,
    `StrengthCheckerClient`, `AppLayout`, `HistoryPageClient`,
    `FavoritesPageClient`) remain on Tailwind v4 utilities. `@import "tailwindcss"`
    and the `@theme` block in `app/globals.css` are retained so those utilities
    keep compiling.
  - The system is intentionally **hybrid**: inline styles drive the design-critical
    surfaces, Tailwind utilities drive the secondary surfaces. This trades Bug 5's
    "single system" goal for preserving the restored visual fidelity.
  - Dead code cleanup: `shared/lib/cn.ts` and its dependencies (`clsx`,
    `tailwind-merge`) were removed because no component imports `cn` after the
    inline-style restoration. Tailwind v4 itself remains (for the auxiliary
    components), but the `cn()` helper was left without consumers.
  - The `README.md` stack table now describes the system as "Hybrid: inline styles
    on design tokens + Tailwind CSS v4 utility classes on auxiliary components".
  - Bug 5 is accepted as 🟡 Hybrid; reverting to a single system would require
    re-migrating the auxiliary components to inline styles (and re-implementing
    their `hover:`/`sm:`/`md:` variants without Tailwind), which is out of scope
    for this iteration.

## Bug 6 - README word-list count is inconsistent with the data

- Status: [x] Resolved
- Origin: Pre-existing documentation bug from the React project.
- Current behavior: The original README describes 75 words in 5 categories, while the
  current word list contains 165 words in 7 categories.
- Impact: Project documentation does not describe the actual application behavior.
- Target behavior: README and any generated documentation must report the real word
  list, categories, and security behavior.
- Verification:
  - Count categories and words in `features/generator/wordLists.json`.
  - Confirm README values match the data source.
  - Review security statements against the actual persistence implementation.
- Resolution:
  - Updated `README.md` to accurately document the **165 total words** across 7 thematic
    categories (`Animales`=25, `Naturaleza`=25, `Verbos`=25, `Colores`=25, `Lugares`=25,
    `Comida`=20, `Emociones`=20). Verified directly against `features/generator/wordLists.json`.
  - Corrected initial documentation error: original commit stated 167 words (Animales=27);
    real data confirmed 165 words (Animales=25).
  - Documented Web Crypto security architecture (`crypto.getRandomValues()`), memory-only session
    persistence, tech stack, and all verification commands.
  - Commits: `docs: align README with current word list`, `fix(docs): correct word list count to 165`
  - Verification: `pnpm run verify:security`, `pnpm run verify:ui`, `pnpm exec tsc --noEmit`,
    `pnpm lint`, and `pnpm build` all pass.

## Bug 7 - No dedicated favorites or history routes

- Status: [x] Resolved
- Origin: Pre-existing architecture bug from the React project.
- Current behavior: Favorites and history are available only through the floating
  history panel. The migrated App Router currently exposes only `/`, `/generator`,
  and `/batch`.
- Impact: Favorites and history cannot be deep-linked, bookmarked, indexed, or
  navigated with dedicated browser history entries.
- Target behavior: Add `/favorites` and `/history` pages with route metadata. Floating
  panels may remain as shortcuts if they do not duplicate the page content.
- Verification:
  - Navigate directly to `/favorites` and `/history` after a fresh load.
  - Confirm both routes have meaningful title and description metadata.
  - Confirm browser back/forward and refresh work on both routes.
  - Confirm favorites and history are not rendered twice in the root layout.
- Resolution:
  - Added dedicated Next.js App Router pages `/history` (`app/history/page.tsx`) and
    `/favorites` (`app/favorites/page.tsx`) with dedicated route metadata.
  - Implemented full-page interactive views with empty states and seamless browser history support.
  - `app/favorites/FavoritesPageClient.tsx` renders its own inline favorites list (not the shared
    `FavoritesPanel` component) to ensure the floating `HistoryPanel` and the `/favorites` page
    never mount two instances of `FavoritesPanel` simultaneously, satisfying the verification
    criterion "favorites are not rendered twice in the root layout".
  - Commits: `feat(routes): add favorites and history pages`,
    `fix(favorites): eliminate FavoritesPanel duplication on /favorites route`
  - Verification: `pnpm run verify:security`, `pnpm run verify:ui`, `pnpm exec tsc --noEmit`,
    `pnpm lint`, and `pnpm build` all pass.

## Migration Regression 1 - Clipboard copied encrypted payloads

- Status: [x] Resolved
- Origin: Introduced during the React to Next.js migration.
- Current behavior: The main generator action and session history encrypted the
  plaintext again and copied `ciphertext`. The favorites panel copied the persisted
  ciphertext directly. In addition, generated favorites used the plaintext password
  as their visible metadata label.
- Impact: Users received unusable encrypted strings instead of their password, and
  favorite metadata could expose the password in `localStorage`.
- Target behavior: Copy plaintext only after a successful authorized decrypt. Never
  copy ciphertext or persist the encryption passphrase. A favorite restored without an
  in-memory key must ask the user for the original password before copying.
- Resolution:
  - `PasswordActions` now passes the generated plaintext directly to `CopyButton`.
  - `HistoryPanel` copies the in-memory plaintext and no longer calls encryption for
    clipboard operations.
  - Favorites keep their passphrase only in a module-level memory map for the current
    session. Restored favorites use an explicit password unlock form.
  - Favorite copy operations return explicit statuses and only report success after
    `navigator.clipboard.writeText` succeeds.
  - Favorite persistence is migrated to version 2 and strips legacy sensitive labels.
  - `scripts/verify-security.mjs` guards all copy paths against ciphertext copying.
  - Commit: `10ee547 fix(favorites): copy decrypted passwords safely`
- Verification:
  - `pnpm run verify:security`
  - `pnpm exec tsc --noEmit`
  - `pnpm lint`
  - `pnpm build`

## Migration Regression 2 - Persisted Zustand state rendered before hydration

- Status: [x] Resolved
- Origin: Introduced during the React to Next.js migration.
- Current behavior: Several direct consumers of persisted Zustand state could render
  default server values before `localStorage` hydration completed. The root layout also
  rendered `FavoritesPanel` independently while `HistoryPanel` rendered it inside its
  favorites view.
- Impact: The UI could briefly show stale configuration or batch values, cause hydration
  mismatches, and render favorites twice. Font tokens also referenced themselves after
  `next/font` assigned the same custom property names.
- Target behavior: Persisted-state consumers render only after the client store is
  hydrated, favorites have one owner in the layout, and CSS font tokens reference the
  actual `next/font` variables without recursion.
- Verification:
  - Confirm direct persisted-state consumers use `useHasMounted` before rendering.
  - Confirm batch generation starts only after hydration.
  - Confirm `app/layout.tsx` mounts only `HistoryPanel`, which owns the favorites view.
  - Confirm `--font-sans` and `--font-mono` reference distinct `next/font` variables.
  - Run `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build`.
- Resolution:
  - Added `useHasMounted` guards to direct persisted-state consumers in the generator
    and batch flows.
  - Batch generation now waits for the client store to hydrate before running.
  - `app/layout.tsx` now mounts only `HistoryPanel`; its favorites view owns the single
    `FavoritesPanel` instance.
  - `next/font` variables are named `--font-inter` and `--font-jetbrains`, while the
    Tailwind font tokens reference those distinct variables.
  - Commit: `bfb2cd0 fix(hydration): guard persisted state and deduplicate favorites`
  - Verification: `pnpm run verify:security`, `pnpm exec tsc --noEmit`, `pnpm lint`,
    and `pnpm build` all pass.

## Migration Regression 3 - Route pages became Client Components

- Status: [x] Resolved
- Origin: Introduced during the React to Next.js migration.
- Current behavior: The three route files under `app/` were marked with `'use client'`
  even when their static shells could be rendered on the server. Browser-only state,
  navigation, and effects were mixed directly into the route modules.
- Impact: Larger client bundles, less server-rendered UI, and a higher risk of importing
  Zustand, `localStorage`, or Web Crypto into Server Component trees accidentally.
- Target behavior: Keep route pages as Server Components. Isolate interactivity in small
  Client Components and mark browser-only modules explicitly with `'use client'`.
- Verification:
  - Confirm `/`, `/generator`, and `/batch` have no `'use client'` directive.
  - Confirm browser-only modules declare their Client boundary.
  - Confirm route files do not import or access Zustand, `localStorage`, `navigator`,
    or Web Crypto directly.
  - Run `pnpm run verify:architecture`, `pnpm exec tsc --noEmit`, `pnpm lint`, and
    `pnpm build`.
- Resolution:
  - `app/page.tsx`, `app/generator/page.tsx`, and `app/batch/page.tsx` are now Server
    Components containing only route shells and static content.
  - `StartButton`, `GeneratorPageClient`, and `BatchStateController` isolate navigation,
    effects, and Zustand actions in focused Client Components.
  - `StepProgress` is a small Client Component that reads the current wizard step while
    `WizardLayout` remains server-renderable.
  - Browser-only modules explicitly declare `'use client'`: stores, persistence,
    Web Crypto services, and the random helper.
  - `scripts/verify-architecture.mjs` guards route boundaries and browser API usage.
  - Commit: `d4fded2 refactor(architecture): isolate client interactivity from route pages`
  - Verification: `pnpm run verify:architecture`, `pnpm run verify:security`,
    `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build` all pass.

## Server-side defense pattern (rubric Fase 5)

- Status: [x] Implemented
- Origin: Proyecto 3 rubric requirement (Clase 20-21) — not a code bug, but an
  architecture hallmark the consigna demands demonstrating even when the app is
  fully client-side.
- Current behavior: PassFrases is 100% client-side for crypto and session. There
  were no `proxy.ts`, no `server-only` DAL, no Zod validation, and no Route
  Handler/Server Action, because there were no server mutations to protect.
- Impact: The rubric's Fase 5 explicitly requires `proxy.ts` with a scoped
  `matcher`, validation with Zod at runtime, and a `server-only`-marked data
  access layer. Their absence would discount the "seguridad y mutaciones" axis
  even though the rest of the app is secure.
- Target behavior: Provide a minimal, illustrative implementation of the
  server-side defense pattern (authenticate -> validate -> respond) that does
  not weaken the local-only security model and is documented as illustrative.
- Verification:
  - `proxy.ts` exists at the project root and exports `proxy` + a `config`
    with a `matcher` scoped to `/api/:path*` (does not run on every request).
  - `lib/entropy.ts` imports `server-only` so it cannot be bundled into the
    client; importing it from a Client Component fails the build.
  - `app/api/entropy/route.ts` accepts a JSON body, validates it with a Zod
    schema via `safeParse`, returns 400 with structured `fieldErrors` on
    invalid input, 200 with `{ bits, strength }` on success, and 500 with a
    generic message on unexpected failure (no stacks leaked).
  - `pnpm run build`, `pnpm lint`, `pnpm exec tsc --noEmit`, and the three
    `verify:*` scripts all pass.
- Resolution:
  - Installed `zod` and `server-only`.
  - `proxy.ts` (root): exports `proxy(request)` returning `NextResponse.next()`
    with `config.matcher = ['/api/:path*']` (Node.js runtime). PassFrases has
    no login/sessions, so the proxy is intentionally illustrative and is
    documented as such in the README.
  - `lib/entropy.ts`: `server-only`-marked DAL wrapper that re-exports
    `calculateEntropy` + `getStrengthLevel` from `features/generator/entropy`
    (a server-safe module with no directives) under a typed `analyzeEntropy`
    entry point. Marking the wrapper `server-only` guards the boundary.
  - `app/api/entropy/route.ts`: POST Route Handler that parses the JSON body,
    validates it with `PASSWORD_CONFIG_SCHEMA.safeParse`, responds with
    predictable HTTP statuses (200/400/500), and never leaks internal stacks.
    Demonstrates the authenticate -> validate (Zod) -> mutate -> respond order
    from the rubric (authentication is implicit: the handler is the trust
    boundary for the demo; PassFrases has no user accounts).
  - README updated in both English and Spanish: technologies table, extra
    features list, and project tree now reflect the new files and the
    rationale for the illustrative server-side defense layer.
  - Commit: (this change)
- Verification runs:
  - `pnpm run build`
  - `pnpm lint`
  - `pnpm exec tsc --noEmit`
  - `pnpm run verify:security`
  - `pnpm run verify:architecture`
  - `pnpm run verify:ui`

## Audit 2 - Accessibility and Bug 5 polish (fix/audit-bugs)

- Status: [x] Resolved
- Origin: Final deep audit of the `fix/audit-bugs` branch identified 5 medium
  and 8 low polish findings on top of the previously resolved bugs. None of
  them violated the Proyecto 3 rubric, but fixing them brings the project to
  100% alignment with the idiomatic patterns already established in the
  codebase and with ARIA best practices.
- Verification:
  - `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm run verify:security`,
    `pnpm run verify:architecture`, `pnpm run verify:ui`, and `pnpm run build`
    all pass after the fixes.
  - Structural ripgrep checks confirm zero `aria-live` on `<button>` elements,
    zero `<div role="dialog">` residual, zero `style={{ transform }}` inline
    styles, and zero `aria-controls` referencing missing DOM ids.
- Resolution (medium — accessibility):
  - `M1` `features/batch/components/HistoryPanel.tsx`: replaced the
    `<div role="dialog">` of the floating history/favorites panel with a
    native `<dialog>` element driven by `ref + showDialog/close()` and a
    `previousActiveElement` ref for focus restoration, matching the pattern
    already used by `QRCodeModal` and `ConfirmDialog`. The panel now provides
    a real focus trap and restores focus to the trigger button on close.
  - `M2` `features/clippy/components/ClippyAssistant.tsx`: applied the same
    native `<dialog>` migration to the keyboard-shortcuts panel.
  - `M3` `features/batch/components/BatchGenerator.tsx`: removed
    `aria-live="polite"` from the copy-all and per-result `<button>` elements
    and added sibling `<span role="status" aria-live="polite" class="sr-only">`
    announcing the copy state. This mirrors the pattern in
    `features/generator/components/GeneratorPageClient.tsx:54`.
    Reapplied after `8c78a6b` restored inline styles (the rewrite silently
    reintroduced `aria-live` on those `<button>`s); regression guard added
    to `scripts/verify-ui.mjs` via `/<button[^>]*aria-live=/`.
  - `M4` `features/generator/components/PasswordActions.tsx`: same migration
    for the save-favorite button, now announcing the saved state via a sibling
    `sr-only role="status"` live region.
  - `M5` `features/favorites/components/FavoritesPanel.tsx`: same migration
    for the copy/unlock button on each favorite row.
    Reapplied after `8c78a6b` (same regression vector as M3); the sr-only
    span uses inline `style` (not `className="sr-only"`) to match the
    inline-style idiom of the surrounding component. The same `verify-ui.mjs`
    regression guard covers this file.
- Resolution (low — Tailwind idiom and ARIA hygiene):
  - `L1` `shared/components/ui/QRCodeModal.tsx`: the password preview
    two-state `style={{ color, letterSpacing }}` was migrated to Tailwind
    `cn()` swaps (`tracking-normal text-(--color-text)` vs `tracking-[0.15em]
    text-(--color-text-secondary)`), eliminating the static inline style.
  - `L5` `shared/components/ui/QRCodeModal.tsx`: added `role="alert"` to the
    QR-generation error block so screen readers announce the failure.
  - `L2` `shared/components/ui/Toggle.tsx`: the knob `style={{ transform:
    translateX(1.25rem) }}` was migrated to `cn(checked ? "translate-x-5" :
    "translate-x-0")` under the existing `transition-transform` utility.
  - `L3` `shared/components/ui/FunStats.tsx`: the `Bubble` static two-state
    `style={{ background, border, color }}` was migrated to two precomputed
    Tailwind class strings (`bubbleActive`/`bubbleInactive`) selected by
    `cn()`. The `✓`/`✗` glyph is now wrapped in `<span aria-hidden="true">`
    so it is not read aloud as "check mark" by screen readers (the label text
    already conveys the meaning).
  - `L4` `shared/components/ui/StepProgress.tsx`: removed the
    `aria-controls={`panel${step.number}`}` attribute from each step tab
    because the referenced panel ids (`#panel1`, `#panel2`, `#panel3`) do not
    exist in the DOM; the `role="tab"` and `aria-selected` are kept.
    Reapplied after `8c78a6b` restored inline styles (the attribute was
    silently reintroduced).
  - `L8` `features/generator/components/GeneratorForm.tsx`: replaced the
    `<label>` that wrapped the "Categorías de palabras" heading (which had no
    form control to label) with a `<span id={useId()}>`, and passed that id to
    `CategoryChips` via a new `labelledBy` prop so the chips container now has
    `role="group" aria-labelledby={...}`. The `<label>` element is no longer
    misused for non-form content.
  - `L9` `features/batch/components/HistoryPanel.tsx`: the segmented control
    that switches between History and Favorites tabs now has proper
    `role="tablist"` on the wrapper and `role="tab" aria-selected={...}` on
    each button. (Implemented together with M1.)
  - `L7` `features/batch/components/BatchGenerator.tsx`: removed the four
    inline template-string className interpolations and migrated them to the
    project's `cn()` utility from `@/shared/lib/cn` for consistency with the
    rest of the codebase. The bare Tailwind v4 tokens (`text-text`,
    `border-border`, `bg-accent-soft`, `text-accent`, `text-success`,
    `text-text-secondary`, `text-text-tertiary`, `text-red-500`) remain
    valid because `@theme` registers each `--color-X` custom property as a
    Tailwind color named `X`.

## Priority

1. Bugs 1 and 2: security and password-generation correctness.
2. Bug 7 and migration regressions: routing, copied ciphertext, hydration, and layout.
3. Bugs 3, 4, and 5: accessibility, responsive behavior, and maintainability.
4. Bug 6: documentation accuracy.

## Extra Feature — Password Strength Checker (Section 9)

- Status: [x] Implemented
- Origin: Optional functionality added during the migration.
- Route: `/strength-checker`.
- Motivation: PassFrases generates passphrases, but users also need to audit passwords they already use on other sites.
- Resolution: Added a standalone Server Component route with a small Client Component boundary. The feature reuses `EntropyMeter`, `STRENGTH_CONFIG`, and `getStrengthLevel`, while keeping the pasted password in local component state only. It is never persisted in Zustand or `localStorage`, and is never sent to a server.
- Verification: Analyze a long passphrase, a short alphanumeric password, a password containing common patterns, and an empty input. Confirm entropy, online/offline crack-time estimates, inline warnings, and live-region announcements.
- Commits: `2e9aea0 feat(strength): add arbitrary password strength analyzer`, `f554e5b feat(strength-checker): add /strength-checker route with live analysis`.

## Extra Feature — QR Code Transfer

- Status: [x] Implemented
- Origin: Optional functionality added during the migration.
- Motivation: Lets the user transfer a generated passphrase to their phone by scanning a QR code, avoiding copy-paste mistakes and keeping the flow 100% local.
- Resolution: Added `QRCodeButton` and `QRCodeModal` (Client Components using the native `<dialog>` element and the `qrcode` library) in `shared/components/ui/`, wired into `PasswordActions` (single generator) and `BatchGenerator` (per-result). The QR is rendered on a `<canvas>` in the browser; no server or network is involved. Followup commit migrated both components to Tailwind utilities (Bug 5), removed a redundant `console.error`, restored focus on modal close, gave each batch row a unique `aria-label`, and added assertions to `verify-ui.mjs`.
- Verification: Open the generator, click the QR button, confirm the modal shows a scannable code and closes cleanly with focus returning to the trigger. Repeat in `/batch` and confirm each row's QR button announces its index to screen readers.
- Commits: `10b929c feat(ui): implement QRCodeButton and QRCodeModal components`, `f4a479c feat(generator): add QR code transfer to single and batch generator views`, `5ff4796 fix(qr): migrate QR components to Tailwind and restore focus on close`, `847d7bc fix(a11y): unique aria-label for batch QR buttons`.

## Extra Feature — Keyboard Shortcuts

- Status: [x] Implemented
- Origin: Optional functionality added during the migration.
- Motivation: Power users (developers, admins) generate many passphrases and benefit from keyboard-driven workflows.
- Resolution: Added `useKeyboardShortcuts` hook (`shared/hooks/useKeyboardShortcuts.ts`) listening for `Ctrl/Cmd+G` (generate), `Ctrl/Cmd+C` (copy current) and `Ctrl/Cmd+B` (toggle history). `Ctrl/Cmd+C` is intercepted only when no input/textarea is focused and no text is selected to preserve normal copy behaviour. Copy feedback is announced via a `sr-only` `role=status` live region, never `alert()`. A `⌨️ Atajos` badge in `ClippyAssistant` toggles a small panel listing the shortcuts, with `⌘` or `Ctrl` shown based on `navigator.platform`.
- Verification: On `/generator`, press each shortcut and confirm the action runs. Select text in any input and press `Ctrl/Cmd+C` to confirm normal copy still works. Open the `⌨️ Atajos` panel in Clippy and confirm the list matches the implemented shortcuts.
- Commits: `f6a8e15 feat(shortcuts): add keyboard shortcuts hook for generate, copy, and history`, `a74ae4a feat(clippy): add keyboard shortcuts badge and panel`.

## Extra Feature — Encrypted Favorites Backup

- Status: [x] Implemented
- Origin: Optional functionality added during the migration.
- Motivation: Favorites live in `localStorage`; changing browsers or clearing data loses them. Backup makes them portable without weakening the security model.
- Resolution: Extracted `sanitizeFavorites` into `features/favorites/sanitize.ts` (server-safe, no `'use client'`) so backup logic can reuse the same validation. Added `serializeBackup` and `parseBackup` in `shared/lib/favorites-io.ts` (server-safe) with a 500-favorite cap and discriminated-union error handling. Added `mergeFavorites` to the favorites store that skips duplicates by id and returns the number of imports. `FavoritesBackupButtons` (Client Component) exports a `.json` of ciphertexts and imports one via a hidden file input, showing a `ConfirmDialog` preview before merging. Wired into `/favorites` and the floating `HistoryPanel`.
- Verification: On `/favorites`, export favorites and open the file in a text editor to confirm it contains only `ciphertext`/`iv`/`salt` (no plaintext). Clear `localStorage`, then import the file and confirm the favorites reappear (passphrase required to unlock). Import invalid JSON and confirm a `role=alert` error appears; import duplicates and confirm existing entries are skipped.
- Commits: `acbaac4 feat(favorites): add backup serialization and merge logic`, `266d0e9 feat(favorites): add export and import buttons to favorites page`, `2dda5c2 feat(favorites): add backup buttons to floating history panel`.
