# Project migration: Radix UI → Base UI

2026-07-16 — whole-project migration, transformation engine (legacy `new-york` style,
in-place). All 13 Radix-backed components migrated to `@base-ui/react@1.6.0`.

## Dependency swap

- Added `@base-ui/react@^1.6.0`; removed `radix-ui`. Package manager: **bun** (`bun.lock`).
- Baseline (captured before any change, after generating `src/paraglide`): `tsc --noEmit`
  **0 errors**.
- Final: `tsc --noEmit` **0 errors** · `bun run build` **✓ built** · `bun run lint` (oxlint)
  **0 warnings/0 errors** · `bun run check` (ultracite) **0 warnings/0 errors**.

## Components migrated (13)

separator · button/badge/breadcrumb/tree (Slot→render) · tabs · scroll-area ·
tooltip+popover · dialog · dropdown-menu+context-menu · select.

See the per-component `.migration/<component>.md` files for details and per-primitive
"verify by hand" checklists.

**Commit granularity note:** intended as one commit per step. The `lefthook` pre-commit
reformats staged files with `ultracite fix`; for `separator`, `scroll-area`, and `select`
my hand-formatting differed, the hook reformatted them and aborted those three commits, so
their (now-formatted) changes were swept into the next successful commit
(`separator` → the Slot-batch commit, `scroll-area` → the tooltip+popover commit,
`select` → the remove-radix commit). All content is present and correct in HEAD — only the
per-commit split for those three was lost; nothing needs re-doing.

## App-code sweep (call-site changes beyond the wrappers)

- **`asChild` → `render`** (all 54 sites): `error-page`, `tab-bar` (×2), `theme-switcher`,
  `resume-viewer/dialog-container` (×2), `about/contribution-cell`,
  `about/contribution-section`, `common/button-with-tooltip`, `layout/header`,
  `tabs/tab-context-menu`, `assistant/slash-command-popover`. Non-button render targets got
  `nativeButton={false}` where the trigger supports it (Popover/Menu/Dialog/Tabs triggers;
  Tooltip.Trigger has no such prop).
- **`Slot` (radix) idiom → `useRender` + `mergeProps`** in hand-rolled app code:
  `common/contribution-graph-primitive.tsx` (9 parts) and `tabs/tab-context-menu.tsx`.
- **`data-[state=…]` class rewrites**: tabs `data-[state=active]` → `data-active` (in
  `tab-bar`, `project/container`); menu/overlay `data-[state=open/closed]` animation classes
  → `data-starting-style`/`data-ending-style`; menu item `focus:*` → `data-highlighted:*`;
  submenu-trigger `data-[state=open]` → `data-popup-open`.
- **CSS var rewrites**: `--radix-*-content-available-height` → `--available-height`,
  `--radix-*-content-transform-origin` → `--transform-origin`, `--radix-*-trigger-width`
  → `--anchor-width` (in `slash-command-popover` and every overlay/menu/select wrapper).
- **Prop mappings**: TooltipProvider `delayDuration` → `delay` (+ `button-with-tooltip`);
  Popover `PopoverAnchor` reimplemented via a Positioner `anchor` ref (Base UI dropped the
  Anchor part); Popover `onOpenAutoFocus` → Popup `initialFocus`; Select `position` →
  `alignItemWithTrigger`; Separator `decorative` dropped; menu `onSelect` → `onClick`.
- **Downstream type-only fix**: `command.tsx` (cmdk) `CommandDialog` props now
  `Omit<…, "children"> & { children?: ReactNode }` because Base UI `Dialog.Root`'s children
  type widened.

## Intentionally untouched (not Radix)

`command.tsx` (cmdk), `drawer.tsx` (vaul), `carousel.tsx` (embla-carousel-react),
`resizable.tsx` (react-resizable-panels) — Base UI has no equivalent; these keep their
libraries. `DrawerClose asChild` (settings-drawer) is vaul's API and was left as-is.
`tree.tsx` keeps `@headless-tree/core`; only its `Slot` usage migrated.

## Style switched to Base UI

`components.json` `"style"` is now `"base-vega"` (was `"new-york"`). There is no
`base-new-york` registry variant, so the existing 13 components were migrated **in place**
(keeping the app's exact Tailwind classes) and are unaffected by this switch. The style
string is the only lever the shadcn CLI reads to pick a base: `base-vega` makes future
`shadcn add <component>` deliver **Base UI** variants instead of Radix. `base-vega` was
chosen because its `rounded-md` radius matches the prior New York look most closely; colors
remain zinc (driven by `src/styles.css`, `cssVariables: true`). Newly added components will
follow base-vega's class conventions and may need light class cleanup to match existing ones.

## FLAG — behavior/visual deltas to QA (agreed minimal-animation approach)

- Open/close animations are now transitions (fade + 95% scale) instead of Radix keyframe
  slide-ins.
- Tabs default to **manual** activation (arrow moves focus, Enter/Space selects).
- Tooltip/popover arrow placement uses Base UI's positioning (Radix translate tweaks dropped).
- Menu items highlight via `data-highlighted` (pointer + keyboard) instead of DOM focus;
  Checkbox/Radio menu items default `closeOnClick={false}` (none in use today).
- Select defaults to `alignItemWithTrigger` (item-aligned) vs the old `position="popper"`
  (Select is currently unused).

## Derived status

**0 wrappers remain on Radix** (`grep -rl "radix-ui\|@radix-ui" src/components/ui/` → none).
The only remaining `radix-ui` string in `src` is a source-attribution comment in
`hooks/use-controllable-state.ts` (not an import).
