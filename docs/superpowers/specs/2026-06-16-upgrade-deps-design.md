# Upgrade Dependencies to Latest — Design

- **Date**: 2026-06-16
- **Branch**: `upgrade-deps`
- **Owner**: pvducc

## Goal

Upgrade every package in `package.json` to its latest version (including breaking majors), migrate any code that the upgrades demand, and remove stale patterns surfaced by the new versions. End state: `bun outdated` reports no actionable upgrades; `tsc --noEmit`, `bun run lint`, and `bun run build` all pass.

## Scope

In scope:

- All dependencies and devDependencies in `package.json`.
- Library-level deprecations (warnings and removed APIs surfaced by upgraded packages).
- Stale code patterns made visible by the upgrades (e.g. `vite-tsconfig-paths` plugin now redundant with Vite 8 built-in support; legacy individual `@radix-ui/react-*` imports superseded by unified `radix-ui` package).
- `src/components/ui/resizable.tsx` rewrite to current shadcn source (consequence of `react-resizable-panels` v4 rename of primitives and CSS attribute).

Out of scope:

- Refactoring unrelated to the upgrades.
- Opening a pull request or pushing to remote (user decides post-completion).
- Refreshing shadcn UI components other than `resizable.tsx` unless an upgrade forces it.
- Tightening test coverage. Existing `vitest` suite is not part of the verification gate (per chosen gate: typecheck + lint + build).

## Approach

Hybrid: targeted recon completed on the three highest-blast-radius majors (`lucide-react@1.x`, `groq-sdk@1.x`, `typescript@6 + vite@8`) plus the radix-ui migration. Remaining majors are handled reactively. Execution is **one commit per logical group**, each gated by `tsc --noEmit` + `bun run lint` + `bun run build`. Failing groups are reverted with `git revert <sha>`; the rest of the branch is unaffected.

## Group sequence

Eight commits on `upgrade-deps`, in this order.

### Group 1 — Safe bumps

Single commit. All packages where `bun outdated` shows `Update == Latest` and is within the current major. Excludes every `@radix-ui/react-*` package (handled in Group 2).

Includes: `@embedpdf/*`, `@headless-tree/{core,react}`, `@inlang/paraglide-js`, `@rive-app/react-canvas`, `@t3-oss/env-core`, `@tailwindcss/vite`, `tailwindcss`, `@cloudflare/vite-plugin`, `@cloudflare/workers-types`, `fuse.js`, `motion`, `react`, `react-dom`, `react-hotkeys-hook`, `tailwind-merge`, `valibot`, `zustand`, `@types/react`, `@types/react-dom`, `@types/node` (within major), `@tanstack/devtools-vite`, `@tanstack/react-devtools` (within constraint), `lefthook`, `oxlint`, `ultracite`, `web-vitals`, `wrangler`, `vitest`. Also `streamdown` if the constraint allows 2.5.0 — investigate why bun outdated shows `Update=2.1.0` despite `^2.1.0` semver.

Expected code changes: none.

Verification gate applies.

### Group 2 — Radix-ui consolidation to unified package

Drop 10 individual packages:

```
@radix-ui/react-context-menu
@radix-ui/react-dialog
@radix-ui/react-dropdown-menu
@radix-ui/react-popover
@radix-ui/react-scroll-area
@radix-ui/react-select
@radix-ui/react-separator
@radix-ui/react-slot
@radix-ui/react-tabs
@radix-ui/react-tooltip
```

Add `radix-ui@^1.6.0`.

Rewrite imports in the 15 files that reference `@radix-ui/react-*`: 13 in `src/components/ui/` (`badge.tsx`, `breadcrumb.tsx`, `button.tsx`, `context-menu.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `popover.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `tabs.tsx`, `tooltip.tsx`, `tree.tsx`), plus `src/components/tabs/tab-context-menu.tsx` and `src/components/common/contribution-graph-primitive.tsx`. Use the current shadcn import convention:

```ts
import { Dialog as DialogPrimitive } from "radix-ui";
```

The unified `radix-ui@1.6.0` package re-exports `Dialog`, `Popover`, `ScrollArea`, `Tooltip`, `Tabs`, `DropdownMenu`, `ContextMenu`, `Select`, `Separator`, `Slot` (and many more) as namespaces. Per-component usage (`DialogPrimitive.Root`, `DialogPrimitive.Trigger`, etc.) is unchanged.

Verification gate applies.

### Group 3 — TypeScript 6 + jsdom + @types/node major

Bump:

- `typescript` 5.9 → 6.0
- `@types/node` 24 → 25
- `jsdom` 27 → 29

`tsconfig.json` review:

- Add `"ignoreDeprecations": "6.0"` initially as escape hatch.
- Confirm explicit `target: ES2022`, `module: ESNext`, `moduleResolution: bundler` overrides any new TS 6 defaults safely.
- Confirm `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports` remain.

If `babel-plugin-react-compiler@1.0.0`, `oxlint`, `ultracite`, or `vitest@4.1.x` declare a TS peer that excludes 6.0, pause and ask before proceeding.

Verification gate applies.

### Group 4 — Vite 8 + plugin-react 6 + lint-staged 17

Bump:

- `vite` 7 → 8
- `@vitejs/plugin-react` 5 → 6
- `lint-staged` 16 → 17

Edit `vite.config.ts`:

- Remove `vite-tsconfig-paths` plugin and the import. Vite 8 has built-in tsconfig-paths support, and Vite 8's `8.0.0` release adds a warning when the plugin is detected.
- Remove `vite-tsconfig-paths` from `package.json` devDependencies.
- Keep `cloudflare`, `devtools` (tanstack), `tailwindcss`, `paraglideVitePlugin`, `tanstackStart`, `viteReact` in their current ordering.

Verify peer compatibility (already audited):

- `@cloudflare/vite-plugin@^1.40` peers vite 6/7/8 ✓
- `@tanstack/react-start` peers vite ≥7 ✓
- `@tanstack/devtools-vite` peers vite 6/7/8 ✓
- `@vitejs/plugin-react@^6` peers vite 8, `babel-plugin-react-compiler ^1.0.0` ✓

Ad-hoc smoke check after build: `bun run dev` boots without warnings about deprecated config.

Verification gate applies.

### Group 5 — lucide-react 1.x

Bump `lucide-react` 0.555 → 1.20.

No code changes expected. Audit confirmed all 40 imported icons (`ArrowDown`, `Check`, `ChevronDown`, `File`, `Settings`, `GripVerticalIcon`, etc.) are generic UI icons and survive v1 (brand icons removed, but none used).

Behavior change: icons now default to `aria-hidden="true"`. This is an accessibility improvement, not a regression.

Verification gate applies.

### Group 6 — groq-sdk 1.x

Bump `groq-sdk` 0.37 → 1.2.1.

Inspect `src/lib/llm.ts` against installed `.d.ts`. Current usage:

```ts
const client = new Groq({ apiKey: env.LLM_API_KEY });
await client.chat.completions.create({
  messages: [
    { content: systemInstruction, role: "system" },
    { content: prompt, role: "user" },
  ],
  model: SITE_CONFIG.assistant.model,
  stream: true,
  temperature: SITE_CONFIG.assistant.temperature,
});
```

Stainless rebuild ("begin TS migration") may alter type names but the public API shape is typically preserved. If types or runtime drift, port to the 1.x equivalent. This is the only file using `groq-sdk` (the reference in `src/config/projects.ts` is a string literal, not an import).

Verification gate applies.

### Group 7 — react-resizable-panels 4 + shadcn resizable refresh

Bump `react-resizable-panels` 3 → 4.

**Replace** `src/components/ui/resizable.tsx` with shadcn's current source. Concrete diff:

- `ResizablePrimitive.PanelGroup` → `ResizablePrimitive.Group`
- `ResizablePrimitive.PanelResizeHandle` → `ResizablePrimitive.Separator`
- Prop types switch from `React.ComponentProps<typeof X>` to `ResizablePrimitive.GroupProps` / `PanelProps` / `SeparatorProps`.
- Tailwind selectors: `data-[panel-group-direction=vertical]` → `aria-[orientation=vertical]` on the group; handle selectors flip from "vertical" to "horizontal" axis to match the new default.
- Remove `data-panel-group-direction` references everywhere.

**Edit** `src/components/layout/app-content.tsx` (only consumer):

- `<ResizablePanelGroup direction="horizontal">` → `<ResizablePanelGroup orientation="horizontal">`
- `<ResizablePanel defaultSize={panelSize}>` → `<ResizablePanel defaultSize={`${panelSize}%`}>` (or refactor `panelSize` upstream to be a percent string). Other `defaultSize` call sites in the same file get the same treatment.
- Other RP-v4 renames to apply if used: `onLayout` → `onLayoutChange`, `ImperativePanelHandle` → `PanelImperativeHandle`, panel `ref` → `panelRef`. Grep confirms only `direction` and `defaultSize` need updating in this file.

Verification gate applies.

### Group 8 — Final

- `bun install` clean run; no peer warnings.
- Full `tsc --noEmit` + `bun run lint` + `bun run build`.
- `bun outdated` shows no actionable upgrade other than packages held by upstream constraints.
- Leave the branch on `upgrade-deps`. **Do not push or open a PR** — user decides next step.

## Verification gate (applies per group)

Every group commit is blocked until all four pass:

1. `bun install` — clean install, no peer warnings.
2. `bunx tsc --noEmit` — typecheck.
3. `bun run lint` — oxlint.
4. `bun run build` — vite build.

Group 4 adds an ad-hoc `bun run dev` boot check. Group 6 adds an ad-hoc sanity check of the LLM call path if a dev render path exercises it.

Vitest is intentionally excluded from the gate (per chosen verification level: typecheck + lint + build).

## Commit message convention

Match existing branch style (`chore(deps): …`):

- `chore(deps): bump safe minor and patch versions`
- `chore(deps): migrate radix-ui to unified package`
- `chore(deps): upgrade to TypeScript 6 and jsdom 29`
- `chore(deps): upgrade to Vite 8 and drop vite-tsconfig-paths`
- `chore(deps): upgrade lucide-react to 1.x`
- `chore(deps): upgrade groq-sdk to 1.x`
- `chore(deps): upgrade react-resizable-panels to 4 and refresh shadcn resizable`
- `chore(deps): finalize upgrade pass`

## Rollback

Per-group commits, no force-push. Any group can be reverted in isolation with `git revert <sha>`. If a group is fundamentally blocked (e.g. TS 6 ecosystem too immature), drop that group from the branch and ship the rest; record the deferral in the commit message or PR description later.

## Open risks (pause and ask if hit)

- **TS 6 ecosystem peers.** `babel-plugin-react-compiler@1.0.0`, `oxlint@1.70`, `ultracite@7.x`, and `vitest@4.1.x` may not declare TS 6 support. If `bun install` warns, pause.
- **groq-sdk 1.x API drift.** Release notes are vague. After install, read the published `.d.ts` before editing `llm.ts`. If the call surface changed, pause to confirm the migration shape.
- **Vite 8 + Cloudflare adapter.** Plugin peers list Vite 8 but Cloudflare Worker SSR may need a config tweak. If the cloudflare adapter step fails in `vite build`, pause.
- **streamdown@2.5.0 held back.** `bun outdated` shows `Update=2.1.0` despite `^2.1.0` semver. Investigate the constraint in Group 1; if a peer (likely AI SDK related) pins it, leave at 2.1.0 and note it in Group 8.

## End state

- `package.json` updated; `bun.lock` regenerated.
- 8 commits on `upgrade-deps`, each green at the gate.
- `bun outdated` clean (or only constraint-pinned holdouts).
- No PR opened, no remote push.
