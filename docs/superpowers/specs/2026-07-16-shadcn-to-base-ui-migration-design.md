# Migrate shadcn/ui (Radix) components to Base UI

**Date:** 2026-07-16
**Status:** Approved design — ready for implementation planning

## Goal

Replace Radix UI primitives with Base UI (`@base-ui/react`) across the 13 shadcn/ui
components in `src/components/ui` that currently depend on the `radix-ui` package,
while keeping each component's public export surface stable so the 46 consumer files
need minimal changes.

## Scope

**In scope — 13 Radix-backed components:**

`button`, `badge`, `breadcrumb`, `tree` (Slot/`asChild` only), `separator`, `tabs`,
`dialog`, `popover`, `tooltip`, `dropdown-menu`, `context-menu`, `select`, `scroll-area`.

**Out of scope — non-Radix headless components (no Base UI equivalent):**

`command` (cmdk), `drawer` (vaul), `carousel` (embla-carousel-react),
`resizable` (react-resizable-panels). These stay as-is. `tree` keeps
`@headless-tree/core`; only its `Slot` usage migrates.

**Removal target:** once all 13 are migrated, the `radix-ui` dependency is removed
from `package.json`.

## Decisions

1. **Target package:** `@base-ui/react` (currently v1.6.0). The older
   `@base-ui-components/react` name is frozen at `1.0.0-rc.0` and must not be used.
2. **Public API preserved:** every exported component name and its prop surface stay
   the same (`Dialog`, `DialogContent`, `SelectTrigger`, …). Base UI's
   `Portal`/`Positioner`/`Popup`/`Backdrop`/`List` restructuring is absorbed _inside_
   each wrapper file, not exposed to consumers.
3. **`asChild` → `render`:** adopt Base UI's native `render` prop. Remove `Slot`. The
   `asChild={true}` prop is dropped from our wrappers; the four Slot-based wrappers
   (`button`, `badge`, `breadcrumb`, `tree`) use the `useRender` hook. All 54
   `asChild` call-sites across 17 consumer files are converted to `render={<X />}`.
4. **Animations:** use simple Base UI-idiomatic transitions (fade/scale via
   `data-starting-style` / `data-ending-style`). Do not attempt to pixel-match the
   current `animate-in`/`animate-out` keyframe motion.
5. **Verification:** after each component, run `bun run build`, `bun run check`
   (ultracite), and `bun run lint` (oxlint). No new tests in this migration.
6. **Increments:** migrate one component per commit, simplest first, so breakage is
   isolated and bisectable.

## API mapping (Radix → Base UI)

| Component                               | Radix parts                                                               | Base UI target                                 | Notable shifts                                                                                                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `button`, `badge`, `breadcrumb`, `tree` | `Slot.Root` + `asChild`                                                   | `useRender({ render, props, defaultTagName })` | remove `asChild`; accept `render`                                                                                                                                               |
| `separator`                             | `Separator.Root` (`decorative`, `orientation`)                            | `Separator`                                    | drop `decorative` (always decorative); keep `orientation`                                                                                                                       |
| `tabs`                                  | Root / List / Trigger / Content                                           | `Tabs.Root` / `List` / `Tab` / `Panel`         | `Trigger`→`Tab`, `Content`→`Panel`; `value` prop preserved on wrappers                                                                                                          |
| `dialog`                                | Root / Trigger / Portal / Overlay / Content / Title / Description / Close | `Dialog.*`                                     | `Overlay`→`Backdrop`, `Content`→`Popup`; keep Portal                                                                                                                            |
| `popover`                               | Root / Trigger / Anchor / Portal / Content                                | `Popover.*`                                    | `Content` wrapper = `Portal`+`Positioner`+`Popup`; `Anchor` supported                                                                                                           |
| `tooltip`                               | Provider / Root / Trigger / Portal / Content / Arrow                      | `Tooltip.*`                                    | `Content` wrapper = `Portal`+`Positioner`+`Popup`; keep `Provider`, `Arrow`                                                                                                     |
| `dropdown-menu`                         | full menu anatomy                                                         | `Menu.*`                                       | add `Positioner` inside `Content`; `ItemIndicator`→`CheckboxItemIndicator`/`RadioItemIndicator`; `SubTrigger`/`SubContent`→`SubmenuTrigger`/`SubmenuRoot`; `Label`→`GroupLabel` |
| `context-menu`                          | full menu anatomy                                                         | `ContextMenu.*`                                | same as dropdown; `ContextMenu.Trigger` wraps the target area                                                                                                                   |
| `select`                                | full select anatomy                                                       | `Select.*`                                     | `Content` wrapper = `Portal`+`Positioner`+`Popup`+`List`; `ScrollUpButton`→`ScrollUpArrow`, `ScrollDownButton`→`ScrollDownArrow`; keep `Value`, `ItemText`, `ItemIndicator`     |
| `scroll-area`                           | Root / Viewport / Scrollbar / Thumb / Corner                              | `ScrollArea.*`                                 | add `Content` wrapper; `Scrollbar`/`Thumb`/`Corner` map directly                                                                                                                |

## Cross-cutting: styling / data-attributes

Radix state classes must be rewritten to Base UI's attribute conventions inside each
migrated wrapper:

- `data-[state=open]` / `data-[state=closed]` → `data-[open]` / `data-[closed]`
- `data-[state=checked]` / `data-[state=unchecked]` → `data-[checked]` / `data-[unchecked]`
- `data-[side=…]`, `data-[align=…]` → `data-[side=…]` (Base UI provides `data-side`)
- `animate-in` / `animate-out` / `fade-in` / `zoom-out` keyframes →
  `transition` + `data-[starting-style]` / `data-[ending-style]` opacity/scale utilities
- keep `data-slot="…"` attributes on our wrappers unchanged (used for our own styling hooks)

`tw-animate-css` may remain installed (used elsewhere / harmless); Radix-specific
keyframe classes are simply no longer referenced by migrated components.

## Component units

Each of the 13 files is an independent unit with one purpose: expose a styled,
API-stable wrapper over a Base UI primitive. Contract per unit:

- **Does:** renders the Base UI parts with shadcn Tailwind styling and `data-slot` hooks.
- **Used by:** consumers importing from `@/components/ui/<name>` — unchanged names/props.
- **Depends on:** `@base-ui/react/<primitive>`, `@/lib/utils` (`cn`), `class-variance-authority` where applicable.

## Consumer changes

- **`asChild` → `render`:** 54 call-sites across 17 files. `<DialogTrigger asChild><Button/></DialogTrigger>`
  becomes `<DialogTrigger render={<Button />} />`; standalone `<Button asChild>` becomes
  `<Button render={<a … />}>`. Where a trigger wrapped children _and_ was `asChild`, the
  child moves into `render` and non-element children are handled via the function form of
  `render` if needed.
- No other consumer edits expected. Any that surface (e.g. a Radix-only prop passed by a
  consumer) are fixed case-by-case during that component's increment.

## Implementation order (simplest → most complex)

1. `separator` — trivial, one part, shakes out install + import path.
2. `button` → `badge` → `breadcrumb` → `tree` — `useRender` pattern + first batch of
   `asChild`→`render` consumer edits.
3. `tabs` — part renames, no portal.
4. `scroll-area` — part mapping.
5. `tooltip` → `popover` — Positioner/Popup restructuring, shared shape.
6. `dialog` — Backdrop/Popup + Portal.
7. `dropdown-menu` → `context-menu` — largest anatomy, indicators/submenus.
8. `select` — most complex anatomy.
9. Cleanup — remove `radix-ui` from `package.json`, run full `build` + `check` + `lint`.

## Error handling & risks

- **Positioner is mandatory in Base UI** for popover/tooltip/menu/select — omitting it
  breaks positioning. Each restructured `*Content` wrapper must include it.
- **`render` prop merges refs/props differently** than Slot; verify triggers that wrap
  custom `Button` still forward click/keyboard handlers.
- **Select value rendering** differs (`Select.Value` children-as-function). Verify current
  usages render the selected label correctly.
- **Controlled/`defaultValue` props** — Base UI Tabs/Select accept `value`/`defaultValue`
  the same way; confirm no consumer relies on Radix-only behavior.
- Mitigation: per-component `bun run build && bun run check`, isolated commits for clean
  bisect/rollback.

## Success criteria

- No file in `src` imports from `radix-ui`; the dependency is removed from `package.json`.
- All 13 components use `@base-ui/react`.
- `bun run build`, `bun run check`, and `bun run lint` pass.
- Consumer call-sites compile with `render` in place of `asChild`.
