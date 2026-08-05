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

- Status: [ ] Pending
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
- Planned commit: `fix(responsive): add mobile layouts for generator and history`

## Bug 5 - Mixed inline styles and Tailwind styles

- Status: [ ] Pending
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
- Planned commit: `style(ui): migrate remaining inline styles to Tailwind`

## Bug 6 - README word-list count is inconsistent with the data

- Status: [ ] Pending
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
- Planned commit: `docs: align README with current word list`

## Bug 7 - No dedicated favorites or history routes

- Status: [ ] Pending
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
- Planned commit: `feat(routes): add favorites and history pages`

## Bug 8 - Conventional Commits are not enforced consistently

- Status: [ ] Pending
- Origin: Pre-existing process issue from the React project.
- Current behavior: The historical repository contains both Conventional Commits and
  unprefixed messages.
- Impact: Commit history is harder to automate, review, and use for release or change
  tracking.
- Target behavior: All new commits use an English Conventional Commit prefix such as
  `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, or `chore:`.
- Verification:
  - Review every commit created during this migration.
  - Document the rule in the project documentation.
  - Add commit-message validation only if it is appropriate for the project setup.
- Planned commit: `chore: document conventional commit policy`

## Bug 9 - Git authorship and feature ownership are unbalanced

- Status: [ ] Pending
- Origin: Pre-existing collaboration/process issue from the React project.
- Current behavior: Historical commit authorship is concentrated among a small number
  of contributors.
- Impact: The repository history does not clearly demonstrate balanced ownership of
  features and pull requests.
- Target behavior: Assign future migration features to contributors, use small feature
  branches and pull requests, and rotate reviewers.
- Verification:
  - Record feature ownership and reviewers in the project documentation.
  - Confirm future migration work is distributed across contributors.
  - Review branch and pull request history during the final project audit.
- Planned commit: `docs: document migration feature ownership`

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

## Priority

1. Bugs 1 and 2: security and password-generation correctness.
2. Bug 7 and migration regressions: routing, copied ciphertext, hydration, and layout.
3. Bugs 3, 4, and 5: accessibility, responsive behavior, and maintainability.
4. Bugs 6, 8, and 9: documentation and collaboration process.
