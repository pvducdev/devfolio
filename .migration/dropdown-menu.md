# dropdown-menu

2026-07-16 — transformation engine (legacy `new-york`, in-place). Radix DropdownMenu →
Base UI Menu. Typecheck clean (0 new errors).

## Changed

- `src/components/ui/dropdown-menu.tsx`
  - Import `radix-ui` DropdownMenu → `@base-ui/react/menu` (`Menu as DropdownMenuPrimitive`).
  - Part renames: `Content` → `Portal > Positioner > Popup`; `Label` → plain styled `<div>`
    (see fix note below — NOT `GroupLabel`);
    `ItemIndicator` → `CheckboxItemIndicator`/`RadioItemIndicator`; `Sub` → `SubmenuRoot`;
    `SubTrigger` → `SubmenuTrigger`; `SubContent` rebuilt as its own `Portal > Positioner >
Popup`. `Root`/`Trigger`/`Group`/`RadioGroup`/`CheckboxItem`/`RadioItem`/`Item`/`Separator`
    map directly. `Root`/`SubmenuRoot`/`Portal` no longer carry `data-slot` (context/narrow
    parts).
  - `DropdownMenuContent`: `sideOffset`(=4) plus new `side`/`align`/`alignOffset` forwarded to
    the Positioner (`isolate z-50`); Popup keeps the content classes.
  - `DropdownMenuSubContent`: submenu Positioner defaults `align="start" alignOffset={-3}
side="right" sideOffset={0}` (per the golden wrapper shape).
  - Class rewrites: item highlight `focus:bg-accent focus:text-accent-foreground` →
    `data-highlighted:bg-accent data-highlighted:text-accent-foreground` (Base UI menus
    highlight via `data-highlighted`, not DOM focus) — applied to Item / CheckboxItem /
    RadioItem / SubmenuTrigger, including the `data-[variant=destructive]:*` combos.
    SubmenuTrigger open state `data-[state=open]:` → `data-popup-open:`. Animations
    `animate-in/out fade/zoom/slide` → `transition-[opacity,transform]` +
    `data-starting-style`/`data-ending-style`. CSS vars
    `--radix-dropdown-menu-content-available-height` → `--available-height`,
    `--radix-dropdown-menu-content-transform-origin` → `--transform-origin`.
- Consumers:
  - `src/components/layout/header.tsx` — `DropdownMenuTrigger asChild` →
    `render={<ButtonWithTooltip … />}`. Existing `DropdownMenuItem onClick` handlers already
    match Base UI's `onClick` model (no change).
  - `src/components/layout/repo-star-link.tsx` — `DropdownMenuItem onClick` unchanged.

Leftover scan clean: no `radix`/`--radix`/`onSelect`/`data-[state=…]` in the file or consumers.

## Post-migration fix — `DropdownMenuLabel` runtime crash

First pass mapped `DropdownMenuLabel` → `Menu.GroupLabel`, which throws at runtime
("MenuGroupContext is missing. Menu group parts must be used within `<Menu.Group>` or
`<Menu.RadioGroup>`") because Base UI's `GroupLabel` requires a `Menu.Group` ancestor.
`header.tsx` uses `DropdownMenuLabel` as a floating menu heading (no group). Base UI has no
standalone menu-label part (docs: use a plain element), and Radix's `Label` floated freely —
so `DropdownMenuLabel` now renders a plain styled `<div>` (same `data-slot`/`data-inset`/
classes), matching the prior behavior with zero consumer churn.

## Behavior changes

- **CheckboxItem/RadioItem close-on-click**: Base UI defaults `closeOnClick={false}` on these
  (Radix closed the menu on select). No consumer uses checkbox/radio menu items today, so no
  divergence in practice — FLAGGED for if any are added later.
- **Highlight** is now driven by `data-highlighted` (pointer + keyboard) instead of DOM focus.
- **Animation** is a fade + 95% scale transition (minimal-animation decision).

## Verify by hand

- Header settings dropdown: trigger (button + tooltip) opens the menu, items highlight on
  hover/arrow-keys, "Toggle shortcuts" item fires and the menu closes, keyboard shortcut label
  shows on the right.
