# context-menu

2026-07-16 — transformation engine (legacy `new-york`, in-place). Radix ContextMenu →
Base UI ContextMenu (`@base-ui/react/context-menu`). Typecheck clean (0 new errors).

## Changed

- `src/components/ui/context-menu.tsx`
  - Same anatomy migration as dropdown-menu (Content → Portal > Positioner > Popup, Label →
    GroupLabel, ItemIndicator → CheckboxItemIndicator/RadioItemIndicator, Sub → SubmenuRoot,
    SubTrigger → SubmenuTrigger). `Root`/`Trigger`/`SubmenuRoot`/`Portal` shed `data-slot`
    where the part is context-only or has a narrow prop type; `Trigger` keeps its `data-slot`
    (renders a `<div>`).
  - `ContextMenuContent`: main content is POINTER-anchored — Positioner gets only
    `isolate z-50`, NO `side`/`align` (would mis-place the right-click menu).
  - `ContextMenuSubContent`: submenu Positioner defaults `align="start" alignOffset={4}
side="right" sideOffset={0}` (context-menu golden shape).
  - Same class rewrites as dropdown-menu: `focus:*` → `data-highlighted:*`,
    SubmenuTrigger `data-[state=open]:` → `data-popup-open:`, animation idiom →
    `transition` + `data-starting-style`/`data-ending-style`, CSS vars → `--available-height`
    / `--transform-origin`.
- Consumer `src/components/tabs/tab-context-menu.tsx` (was a radix `Slot` composition):
  - Dropped `radix-ui` `Slot`; `TabContextMenu` now forwards the props injected by
    `Tabs.Tab` (it is used as that tab's `render` target) straight to `ContextMenuTrigger`
    via `render={children}` + `{...triggerProps}`, so the tab's `<Link>` is simultaneously
    the tab trigger and the context-menu trigger (same behavior the double-Slot chain gave).
  - `ContextMenuItem onSelect={…}` → `onClick={…}` (Base UI Menu.Item selection handler;
    `closeOnClick` defaults true, so the menu still closes on select).

Leftover scan clean: no `radix`/`--radix`/`onSelect`/`data-[state=…]` in the file or consumer.

## Post-migration fix — `ContextMenuLabel`

Same fix as dropdown-menu: `ContextMenuLabel` renders a plain styled `<div>` instead of
`Menu.GroupLabel` (Base UI's `GroupLabel` throws unless inside a `Menu.Group`/`RadioGroup`;
there is no standalone menu-label part). Not currently used in the app, but kept consistent
with `DropdownMenuLabel` so it can float freely like the Radix original.

## Left alone

- Base UI `ContextMenu.Root` has no `modal` and `ContextMenu.Trigger` has no `disabled`;
  neither was used by the consumer, so nothing to drop.

## Behavior changes

- **Highlight** via `data-highlighted` instead of DOM focus; **animation** is fade + scale.
- CheckboxItem/RadioItem `closeOnClick` defaults false (unused here) — FLAGGED for future use.

## Verify by hand

- Right-click a browser tab in the tab bar: the context menu opens at the pointer, "Close",
  "Close others/all/left/right", and "Copy path" each run their action and close the menu;
  the tab still activates on left-click and the tab is still selectable/scrollable.
