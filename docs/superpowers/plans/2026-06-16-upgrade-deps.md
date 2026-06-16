# Upgrade Dependencies to Latest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade every package in `package.json` to its latest version (including breaking majors), migrate any code the upgrades demand, and remove stale patterns surfaced by the new versions.

**Architecture:** Execute as 8 sequential group-commits on the existing `upgrade-deps` branch. Each group is gated by `bun install` clean + `bunx tsc --noEmit` + `bun run lint` + `bun run build`. If a group fails the gate, do not commit — fix forward or pause and ask the user. Per-group commits enable per-group revert if any group is later found broken in real use.

**Tech Stack:** Bun (package manager + runtime), Vite, React 19, TypeScript, TanStack Start, Cloudflare Workers SSR, shadcn/ui (new-york style), Tailwind CSS, oxlint/ultracite.

**Spec:** `docs/superpowers/specs/2026-06-16-upgrade-deps-design.md`

---

## Pre-flight (run once before Task 1)

Working directory: `/Users/pvd/projects/frontend/zxc`. All paths below are relative to this directory.

- [ ] **Verify branch and clean tree**

```bash
git rev-parse --abbrev-ref HEAD
git status --porcelain
```

Expected: `upgrade-deps` and empty `git status` output. If on a different branch, run `git switch upgrade-deps`. If working tree is dirty, stop and ask the user.

- [ ] **Confirm baseline gate is green before any changes**

```bash
bun install
bunx tsc --noEmit
bun run lint
bun run build
```

Expected: all four succeed. If any baseline check fails, stop and ask the user — do not start upgrades on a broken baseline.

---

## Task 1: Safe bumps (in-major updates)

**Files:**

- Modify: `package.json`
- Modify: `bun.lock`

Bun caret semver (`^X.Y.Z`) ranges allow `bun update` to bump anything within the current major. Major-blocked packages (`lucide-react`, `react-resizable-panels`, `groq-sdk`, `typescript`, `vite`, `@vitejs/plugin-react`, `jsdom`, `lint-staged`, `@types/node`) are left for later tasks. `streamdown` is pinned exactly (no caret) so it needs an explicit `bun add` to advance.

The `@radix-ui/react-*` packages will get bumped here too; they are removed entirely in Task 2. The double-touch is intentional — it keeps Task 1 a single mechanical command.

- [ ] **Step 1.1: Bulk update within semver constraints**

```bash
bun update
```

Expected: `bun.lock` updates. No errors. Many packages advance to their latest in-major version.

- [ ] **Step 1.2: Advance pinned streamdown**

`streamdown` is currently pinned exactly at `2.1.0` (no caret) — verify the constraint, then either keep pinned or move to caret-latest. Check current constraint:

```bash
grep '"streamdown"' package.json
```

If the line is `"streamdown": "2.1.0"` (no caret), update to caret-pinned at latest with:

```bash
bun add streamdown@latest
```

Expected: `package.json` now shows `"streamdown": "^2.5.0"` (or newer). If the constraint already uses `^`, this step is a no-op.

- [ ] **Step 1.3: Confirm nothing in this group bumped a major by accident**

```bash
bun outdated
```

Expected: Output still shows the held-back majors (`lucide-react`, `react-resizable-panels`, `groq-sdk`, `typescript`, `vite`, `@vitejs/plugin-react`, `jsdom`, `lint-staged`, `@types/node`) with `Latest > Update`. The `Update` and `Latest` columns should now match for everything else. If a major bumped unexpectedly (e.g. `vite` 8.x in the Update column), stop and investigate — likely a constraint with `||` allowed it.

- [ ] **Step 1.4: Verification gate**

```bash
bunx tsc --noEmit
bun run lint
bun run build
```

Expected: all three succeed. If any fail, the safe bump exposed a transitive incompatibility — read the error and fix forward (usually a type widening in @types/react patch). Do not commit until green.

- [ ] **Step 1.5: Commit**

```bash
git add package.json bun.lock
git commit -m "$(cat <<'EOF'
chore(deps): bump safe minor and patch versions

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds (lefthook pre-commit hook may invoke `ultracite fix` on staged files — no staged TS/JSX/MD files in this commit, so it skips).

---

## Task 2: Radix-ui consolidation to unified package

**Files:**

- Modify: `package.json` (remove 10 packages, add 1)
- Modify: `bun.lock`
- Modify: 9 namespace-primitive files (import line only)
- Modify: 6 Slot files (import line + each `Slot` reference becomes `Slot.Root`)

Background for the executor: shadcn moved its registry to import primitives from the unified `radix-ui` package instead of individual `@radix-ui/react-*` packages. The unified `radix-ui@1.6.0` package re-exports each primitive as a namespace. Crucially, `Slot` is now a namespace whose component is `Slot.Root` (it used to be a default-importable component named `Slot`). All other primitives that were imported via `import * as XPrimitive from "@radix-ui/react-X"` work the same after the import line change — they were already namespace imports.

> **Important — semicolon convention.** The repo's `ui/*.tsx` files (and `ui/tree.tsx`) do **not** end import lines with a trailing semicolon (oxfmt/ultracite convention for this directory). The files `src/components/tabs/tab-context-menu.tsx` and `src/components/common/contribution-graph-primitive.tsx` **do** use trailing semicolons. The code blocks below may show semicolons because the plan's markdown was auto-formatted after writing. **When invoking the Edit tool, your `old_string` MUST match the actual file byte-for-byte** — run `cat <file> | sed -n '<line>p'` first if unsure. The pre-commit hook (`ultracite fix`) will normalize formatting after your edit, so it is acceptable for your `new_string` to use either style; the canonical post-commit form will match the rest of the file.

- [ ] **Step 2.1: Remove individual radix packages**

```bash
bun remove \
  @radix-ui/react-context-menu \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-popover \
  @radix-ui/react-scroll-area \
  @radix-ui/react-select \
  @radix-ui/react-separator \
  @radix-ui/react-slot \
  @radix-ui/react-tabs \
  @radix-ui/react-tooltip
```

Expected: 10 packages removed from `package.json` dependencies.

- [ ] **Step 2.2: Add unified package**

```bash
bun add radix-ui@^1.6.0
```

Expected: `radix-ui` appears in `package.json` dependencies at `^1.6.0` (or newer).

- [ ] **Step 2.3: Rewrite namespace-primitive imports (9 files)**

For each of the 9 files below, replace the single import line. The local name (e.g. `DialogPrimitive`) is preserved.

**`src/components/ui/context-menu.tsx`** — replace:

```ts
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
```

with:

```ts
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
```

**`src/components/ui/dialog.tsx`** — replace:

```ts
import * as DialogPrimitive from "@radix-ui/react-dialog";
```

with:

```ts
import { Dialog as DialogPrimitive } from "radix-ui";
```

**`src/components/ui/dropdown-menu.tsx`** — replace:

```ts
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
```

with:

```ts
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
```

**`src/components/ui/popover.tsx`** — replace:

```ts
import * as PopoverPrimitive from "@radix-ui/react-popover";
```

with:

```ts
import { Popover as PopoverPrimitive } from "radix-ui";
```

**`src/components/ui/scroll-area.tsx`** — replace:

```ts
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
```

with:

```ts
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
```

**`src/components/ui/select.tsx`** — replace:

```ts
import * as SelectPrimitive from "@radix-ui/react-select";
```

with:

```ts
import { Select as SelectPrimitive } from "radix-ui";
```

**`src/components/ui/separator.tsx`** — replace:

```ts
import * as SeparatorPrimitive from "@radix-ui/react-separator";
```

with:

```ts
import { Separator as SeparatorPrimitive } from "radix-ui";
```

**`src/components/ui/tabs.tsx`** — replace:

```ts
import * as TabsPrimitive from "@radix-ui/react-tabs";
```

with:

```ts
import { Tabs as TabsPrimitive } from "radix-ui";
```

**`src/components/ui/tooltip.tsx`** — replace:

```ts
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
```

with:

```ts
import { Tooltip as TooltipPrimitive } from "radix-ui";
```

- [ ] **Step 2.4: Rewrite Slot imports and usages (6 files)**

In the unified `radix-ui` package, `Slot` is a namespace, so all usage of the React component changes from `Slot` to `Slot.Root`. Every Slot file needs both the import line edit AND every Slot reference in the file body updated.

**`src/components/ui/badge.tsx`** — change line 2:

```ts
import { Slot } from "@radix-ui/react-slot";
```

→

```ts
import { Slot } from "radix-ui";
```

And line 35:

```ts
const Comp = asChild ? Slot : "span";
```

→

```ts
const Comp = asChild ? Slot.Root : "span";
```

**`src/components/ui/breadcrumb.tsx`** — change line 2:

```ts
import { Slot } from "@radix-ui/react-slot";
```

→

```ts
import { Slot } from "radix-ui";
```

And line 41:

```ts
const Comp = asChild ? Slot : "a";
```

→

```ts
const Comp = asChild ? Slot.Root : "a";
```

**`src/components/ui/button.tsx`** — change line 2:

```ts
import { Slot } from "@radix-ui/react-slot";
```

→

```ts
import { Slot } from "radix-ui";
```

And line 50:

```ts
const Comp = asChild ? Slot : "button";
```

→

```ts
const Comp = asChild ? Slot.Root : "button";
```

**`src/components/ui/tree.tsx`** — change line 4:

```ts
import { Slot } from "@radix-ui/react-slot";
```

→

```ts
import { Slot } from "radix-ui";
```

And line 85:

```ts
const Comp = asChild ? Slot : "button";
```

→

```ts
const Comp = asChild ? Slot.Root : "button";
```

**`src/components/tabs/tab-context-menu.tsx`** — three changes:

Line 1:

```ts
import { Slot } from "@radix-ui/react-slot";
```

→

```ts
import { Slot } from "radix-ui";
```

Line 22:

```ts
interface TabContextMenuProps extends ComponentPropsWithoutRef<typeof Slot> {
```

→

```ts
interface TabContextMenuProps extends ComponentPropsWithoutRef<typeof Slot.Root> {
```

Line 36:

```tsx
<Slot {...slotProps}>{children}</Slot>
```

→

```tsx
<Slot.Root {...slotProps}>{children}</Slot.Root>
```

**`src/components/common/contribution-graph-primitive.tsx`** — change line 1:

```ts
import { Slot } from "@radix-ui/react-slot";
```

→

```ts
import { Slot } from "radix-ui";
```

Then 9 lines with the pattern `const Comp = asChild ? Slot : "<element>";` need `Slot` → `Slot.Root`. Use the Edit tool with `replace_all: true` for the literal string `asChild ? Slot :` → `asChild ? Slot.Root :` on this file only:

Old (occurs 9 times — lines 161, 178, 188, 198, 208, 262, 319, 331, 342):

```ts
asChild ? Slot :
```

New:

```ts
asChild ? Slot.Root :
```

After the edit, grep to confirm no bare `Slot` remains in this file:

```bash
grep -nE '\bSlot\b' src/components/common/contribution-graph-primitive.tsx
```

Expected: only the import line and the 9 `Slot.Root` references. If a bare `Slot` (not preceded by a `.` and not in the import) appears, stop and inspect.

- [ ] **Step 2.5: Confirm no stale individual-radix imports remain**

```bash
grep -rn "@radix-ui/react-" src
```

Expected: no matches. If matches appear, edit each file to use the unified pattern.

- [ ] **Step 2.6: Verification gate**

```bash
bun install
bunx tsc --noEmit
bun run lint
bun run build
```

Expected: all four succeed. Likely lint warnings: oxlint may flag the import-line style change; let `ultracite fix` handle it in the commit step.

- [ ] **Step 2.7: Commit**

```bash
git add package.json bun.lock src/
git commit -m "$(cat <<'EOF'
chore(deps): migrate radix-ui to unified package

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds. `lefthook` runs `ultracite fix` on staged TS/JSX files. If `ultracite fix` modifies files, re-stage and commit again (one extra commit is fine, or amend if no other changes are pending — prefer new commit per the project's "no amend" rule).

---

## Task 3: TypeScript 6 + jsdom + @types/node majors

**Files:**

- Modify: `package.json`
- Modify: `bun.lock`
- Modify: `tsconfig.json`

TypeScript 6.0 removes several legacy options and changes defaults. Our `tsconfig.json` already sets `target`, `module`, `moduleResolution`, and `strict` explicitly, which protects against the default changes. The `ignoreDeprecations` escape hatch is added as a temporary safety net during the bump.

- [ ] **Step 3.1: Bump TS, @types/node, jsdom**

```bash
bun add -d typescript@^6 @types/node@^25 jsdom@^29
```

Expected: 3 devDependencies advance. `bun install` runs automatically.

- [ ] **Step 3.2: Check for peer-dep warnings**

After `bun add`, scroll the install output for `peer dependency` warnings naming `typescript`. The packages most likely to complain: `babel-plugin-react-compiler`, `oxlint`, `ultracite`, `vitest`. Re-run install to surface them clearly:

```bash
bun install 2>&1 | grep -iE "peer|incompatible|warning" | head -40
```

If any warning explicitly excludes TS 6, stop and ask the user before continuing. If warnings are silent or only mention non-TS peers, proceed.

- [ ] **Step 3.3: Add ignoreDeprecations escape hatch to tsconfig.json**

Edit `tsconfig.json` — insert one line inside `compilerOptions`, immediately after `"strict": true,`:

Old block (lines around the `strict` setting):

```json
    "strict": true,
    "noUnusedLocals": true,
```

New block:

```json
    "strict": true,
    "ignoreDeprecations": "6.0",
    "noUnusedLocals": true,
```

This suppresses TS 6's deprecation warnings for legacy options. If the typecheck passes without it, the line can be removed later (out of scope for this plan — leave it in).

- [ ] **Step 3.4: Run typecheck and triage**

```bash
bunx tsc --noEmit
```

Expected: clean. If errors appear, they are likely one of:

- A library type that drifted in `@types/node@25` → narrow the call site or upgrade the library.
- A jsdom 29 type change affecting `vitest` config → check `vite.config.ts` and any vitest test setup (we have `jsdom` listed but no separate config; vitest 4 picks defaults).
- A TS 6 stricter inference rule → fix the type.

If errors block progress, stop and ask the user — do not silence with `// @ts-ignore`.

- [ ] **Step 3.5: Verification gate**

```bash
bun run lint
bun run build
```

Expected: both succeed. (`tsc --noEmit` already ran in 3.4.)

- [ ] **Step 3.6: Commit**

```bash
git add package.json bun.lock tsconfig.json
git commit -m "$(cat <<'EOF'
chore(deps): upgrade to TypeScript 6 and jsdom 29

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Vite 8 + plugin-react 6 + lint-staged 17

**Files:**

- Modify: `package.json` (3 bumps + 1 removal)
- Modify: `bun.lock`
- Modify: `vite.config.ts` (remove `vite-tsconfig-paths` import and plugin invocation)

Vite 8.0 emits a warning when `vite-tsconfig-paths` is detected because tsconfig-paths support is now built into Vite 8. Removing the plugin is therefore required to silence the warning and represents stale-pattern cleanup. Peer compat for all our plugins (`@cloudflare/vite-plugin@^1.40`, `@tanstack/react-start`, `@tanstack/devtools-vite`, `@vitejs/plugin-react@^6`) was verified during planning.

- [ ] **Step 4.1: Bump vite, plugin-react, lint-staged**

```bash
bun add -d vite@^8 @vitejs/plugin-react@^6 lint-staged@^17
```

Expected: 3 devDependencies advance. Watch for peer-dep warnings.

- [ ] **Step 4.2: Remove vite-tsconfig-paths**

```bash
bun remove vite-tsconfig-paths
```

Expected: 1 devDependency removed.

- [ ] **Step 4.3: Edit vite.config.ts — remove the import**

Edit `vite.config.ts`. Delete line 8 (the `vite-tsconfig-paths` import):

Old:

```ts
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

import packageJson from "./package.json" with { type: "json" };
```

New:

```ts
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import packageJson from "./package.json" with { type: "json" };
```

- [ ] **Step 4.4: Edit vite.config.ts — remove the plugin invocation**

In the same file, remove the `viteTsConfigPaths({...})` plugin entry from the `plugins` array.

Old (within the `plugins: [` array):

```ts
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
```

New:

```ts
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
```

- [ ] **Step 4.5: Verify vite still resolves `@/*` paths**

Vite 8 reads `tsconfig.json` directly. Our `tsconfig.json` has:

```json
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
```

This is sufficient for built-in Vite 8 path resolution. Confirm with a typecheck + build:

```bash
bunx tsc --noEmit
bun run build
```

Expected: both succeed and `@/*` imports resolve. If a build error appears like `Cannot resolve "@/..."`, Vite 8's built-in resolver may need an additional `resolve.alias` block — fall back to adding it explicitly in `vite.config.ts`:

```ts
import { fileURLToPath, URL } from "node:url";
// ...
const config = defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // ...rest
});
```

Only add the fallback if the build actually fails — Vite 8's built-in tsconfig-paths normally works without it.

- [ ] **Step 4.6: Lint**

```bash
bun run lint
```

Expected: green.

- [ ] **Step 4.7: Dev boot smoke check**

Start the dev server in the background and confirm it boots without errors or deprecation warnings.

```bash
bun run dev &
sleep 6
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
kill %1
```

Expected: HTTP `200`. If the curl returns non-200 or `kill` reports no process, read the dev-server output (it printed before the sleep) for errors. Common issues: cloudflare plugin reporting incompatible API, paraglide plugin failing — pause and ask the user.

- [ ] **Step 4.8: Commit**

```bash
git add package.json bun.lock vite.config.ts
git commit -m "$(cat <<'EOF'
chore(deps): upgrade to Vite 8 and drop vite-tsconfig-paths

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: lucide-react 1.x

**Files:**

- Modify: `package.json`
- Modify: `bun.lock`

Audit confirmed during planning: none of the 40 imported icons (`ArrowDown`, `ArrowLeft`, `ArrowRight`, `Building2`, `Check`, `CheckIcon`, `ChevronDown`, `ChevronDownIcon`, `ChevronRight`, `ChevronRightIcon`, `ChevronUpIcon`, `CircleIcon`, `Code`, `Dog`, `Download`, `Eraser`, `Expand`, `Eye`, `File`, `FileIcon`, `FolderIcon`, `FolderOpenIcon`, `GitBranch`, `GitCommitVertical`, `GraduationCap`, `GripVerticalIcon`, `HelpCircle`, `MessageSquare`, `MoreHorizontal`, `Palette`, `PanelsTopLeft`, `Play`, `Search`, `SearchIcon`, `Settings`, `Shrink`, `Star`, `User`, `Users`, `X`, `XIcon`) are brand icons or renamed in v1. v1 added a default `aria-hidden="true"` which is an a11y improvement.

- [ ] **Step 5.1: Bump lucide-react**

```bash
bun add lucide-react@^1
```

Expected: `lucide-react` advances from 0.555.x to 1.x.

- [ ] **Step 5.2: Verification gate**

```bash
bunx tsc --noEmit
bun run lint
bun run build
```

Expected: all three succeed without any code change. If a typecheck error names a specific icon import, confirm the icon survived v1 by checking the v1 source on https://lucide.dev — if removed, pause and ask the user (would need an alternate icon choice).

- [ ] **Step 5.3: Commit**

```bash
git add package.json bun.lock
git commit -m "$(cat <<'EOF'
chore(deps): upgrade lucide-react to 1.x

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: groq-sdk 1.x

**Files:**

- Modify: `package.json`
- Modify: `bun.lock`
- Possibly modify: `src/lib/llm.ts` (only consumer; the reference in `src/config/projects.ts` is an unrelated string literal)

The v1 release notes are vague ("begin TS migration"). The public call surface is typically preserved across Stainless rebuilds, but verify the `.d.ts` after install before assuming.

- [ ] **Step 6.1: Bump groq-sdk**

```bash
bun add groq-sdk@^1
```

Expected: `groq-sdk` advances from 0.37 to 1.x.

- [ ] **Step 6.2: Confirm public API shape**

The current `src/lib/llm.ts` uses:

```ts
import { Groq } from "groq-sdk";
const client = new Groq({ apiKey });
await client.chat.completions.create({ messages, model, stream, temperature });
```

Run typecheck to confirm both call sites still compile:

```bash
bunx tsc --noEmit
```

Expected: green. If errors point at `src/lib/llm.ts`:

- If `Groq` constructor signature changed (e.g. now takes a config object with different keys), update the constructor call to match the new shape. Read the published types: `cat node_modules/groq-sdk/index.d.ts | head -60`.
- If `chat.completions.create` parameter names changed (unlikely — these mirror the OpenAI API shape), update keys accordingly.
- If only the streaming response type narrowed/widened, fix the return-type usage in the same file.

Do not change behavior beyond what compilation requires. Do not refactor.

- [ ] **Step 6.3: Verification gate**

```bash
bun run lint
bun run build
```

Expected: both succeed.

- [ ] **Step 6.4: Commit**

```bash
git add package.json bun.lock src/lib/llm.ts
git commit -m "$(cat <<'EOF'
chore(deps): upgrade groq-sdk to 1.x

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

If `src/lib/llm.ts` did not need changes, `git add` it harmlessly — it just won't appear in the commit. If it did need changes, they ship together with the dep bump.

---

## Task 7: react-resizable-panels 4 + shadcn resizable refresh

**Files:**

- Modify: `package.json`
- Modify: `bun.lock`
- Replace: `src/components/ui/resizable.tsx` (use shadcn current source — `Group`/`Separator` primitives, `aria-[orientation=…]` Tailwind selectors)
- Modify: `src/components/layout/app-content.tsx` (`direction` → `orientation`; numeric `defaultSize` → percent string)

RP v4 renames: `PanelGroup` → `Group`, `PanelResizeHandle` → `Separator`, `direction` → `orientation`, `defaultSize={50}` → `defaultSize="50%"`, `data-panel-group-direction` → `aria-orientation`. The shadcn wrapper file is updated to match; the consumer file is updated to pass the new prop names and value shapes.

- [ ] **Step 7.1: Bump react-resizable-panels**

```bash
bun add react-resizable-panels@^4
```

Expected: package advances from 3.x to 4.x.

- [ ] **Step 7.2: Replace `src/components/ui/resizable.tsx` with the v4-compatible shadcn source**

Overwrite the file completely. New contents:

```tsx
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  );
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
```

Use the Write tool (not Edit — this is a complete rewrite). The previous file used `ResizablePrimitive.PanelGroup`, `ResizablePrimitive.PanelResizeHandle`, and `data-[panel-group-direction=…]` Tailwind selectors; none of those work against RP v4.

- [ ] **Step 7.3: Update consumer — `src/components/layout/app-content.tsx`**

This file is the only consumer of the resizable wrapper. Four edits in this file:

**Edit 1** — change `direction` to `orientation` on the group:

Old (line 40):

```tsx
      <ResizablePanelGroup autoSaveId="conditional" direction="horizontal">
```

New:

```tsx
      <ResizablePanelGroup autoSaveId="conditional" orientation="horizontal">
```

**Edit 2** — convert sidebar `defaultSize` from number to percent string:

Old (line 45 area, inside the first `<ResizablePanel>`):

```tsx
            <ResizablePanel
              className="overflow-auto! rounded-xl bg-background"
              defaultSize={sidebarSize}
              id="sidebar"
```

New:

```tsx
            <ResizablePanel
              className="overflow-auto! rounded-xl bg-background"
              defaultSize={`${sidebarSize}%`}
              id="sidebar"
```

**Edit 3** — convert editor `defaultSize` from number config to percent string:

Old (around line 59, inside the second `<ResizablePanel>`):

```tsx
        <ResizablePanel
          className="rounded-xl bg-background"
          defaultSize={LAYOUT_CONFIG.editor.defaultSize}
          id="code-editor"
```

New:

```tsx
        <ResizablePanel
          className="rounded-xl bg-background"
          defaultSize={`${LAYOUT_CONFIG.editor.defaultSize}%`}
          id="code-editor"
```

**Edit 4** — convert panel `defaultSize` from number to percent string:

Old (around line 70, inside the third `<ResizablePanel>`):

```tsx
            <ResizablePanel
              className="rounded-xl bg-background"
              defaultSize={panelSize}
              id="panel"
```

New:

```tsx
            <ResizablePanel
              className="rounded-xl bg-background"
              defaultSize={`${panelSize}%`}
              id="panel"
```

The `onResize={debouncedSetSidebarSize}` and `onResize={debouncedSetPanelSize}` callbacks remain unchanged at the call site. RP v4's `Panel` `onResize` callback receives a number (percent), so the existing store setters that accept `number` continue to work. If typecheck disagrees after Step 7.4, follow that signal.

- [ ] **Step 7.4: Confirm no stale RP v3 references remain**

```bash
grep -rEn '\b(PanelGroup|PanelResizeHandle|ImperativePanelHandle|data-panel-group-direction|onLayout)\b' src
```

Expected: no matches. If a match appears, decide whether to migrate that reference (e.g. `ImperativePanelHandle` → `PanelImperativeHandle`, `onLayout` → `onLayoutChange`, panel `ref` → `panelRef`). Re-grep until clean.

- [ ] **Step 7.5: Verification gate**

```bash
bunx tsc --noEmit
bun run lint
bun run build
```

Expected: all three succeed. Common error if green elsewhere: `Type 'number' is not assignable to type 'string'` on a `defaultSize` we missed — re-check Step 7.3.

- [ ] **Step 7.6: Dev smoke check — confirm the panel layout renders**

```bash
bun run dev &
sleep 6
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
kill %1
```

Expected: HTTP `200`. (A full visual check is out of scope — the verification gate covers compile/type correctness; runtime panel behavior is observed by the user during PR review.)

- [ ] **Step 7.7: Commit**

```bash
git add package.json bun.lock src/components/ui/resizable.tsx src/components/layout/app-content.tsx
git commit -m "$(cat <<'EOF'
chore(deps): upgrade react-resizable-panels to 4 and refresh shadcn resizable

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Final pass

**Files:** none (verification only; commit only if cleanups required)

- [ ] **Step 8.1: Re-install from clean state**

```bash
rm -rf node_modules
bun install
```

Expected: clean install with no peer warnings. If warnings appear, investigate the warning text. Acceptable to leave optional/dev-only warnings (e.g. ESLint peers from a transitive); blocking warnings must be resolved.

- [ ] **Step 8.2: Full verification**

```bash
bunx tsc --noEmit
bun run lint
bun run build
```

Expected: all three succeed.

- [ ] **Step 8.3: Confirm outdated list is clean (or only constraint-pinned)**

```bash
bun outdated
```

Expected: ideally no rows. Acceptable holdouts:

- Any package where the `Latest` column shows a version that conflicts with a peer (record which peer in the commit/PR notes).
- `streamdown` if pinned by an upstream that requires the older version.

If any major bump from Tasks 3–7 didn't actually land (e.g. `vite` still 7.x), investigate — the bump command may have silently failed.

- [ ] **Step 8.4: Optional finalize commit**

Only commit if Step 8.1 reformatted `bun.lock` or if any cleanup was discovered. If working tree is clean, skip this step entirely.

```bash
git status --porcelain
```

If non-empty:

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore(deps): finalize upgrade pass

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 8.5: Branch status report**

Print the commit log for the upgrade work so the user can review:

```bash
git log --oneline cb24e11..HEAD
```

(Where `cb24e11` is the branch's pre-upgrade tip from the planning baseline. If that SHA is not the actual fork point at execution time, substitute the current `origin/main` or the last commit before Task 1.)

Expected: 7 or 8 `chore(deps): …` commits in order.

**Do not push.** **Do not open a PR.** The user explicitly chose to decide that step after the upgrade lands.

---

## Pause triggers (any task)

Pause execution and ask the user before continuing if any of the following hit:

1. **Baseline gate fails** in the pre-flight section.
2. **TS 6 peer warning** explicitly excludes TS 6 from `babel-plugin-react-compiler`, `oxlint`, `ultracite`, or `vitest` (Step 3.2).
3. **groq-sdk 1.x** changed the public call shape such that `src/lib/llm.ts` needs structural edits beyond renaming (Step 6.2).
4. **Vite 8 + Cloudflare adapter** fails the build, indicating a config-level incompatibility (Step 4.5 or 4.7).
5. **lucide-react** v1 removed an icon we actually import (Step 5.2 — none expected per audit).
6. **Any group's verification gate fails** and the fix is non-mechanical or would require touching files outside the upgrade scope.
7. **`bun update` advances something to a major** that should have been gated (Step 1.3).

## Rollback

If a committed group is later found broken, revert just that commit:

```bash
git log --oneline cb24e11..HEAD
git revert <sha-of-bad-group>
```

The other groups are unaffected. If the failure is in `tsconfig.json` (Task 3) or `vite.config.ts` (Task 4) — which intentionally touch shared config — the revert may need a follow-up fix-up commit; verify the gate after the revert.
