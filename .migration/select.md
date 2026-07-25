# select

2026-07-16 — transformation engine (legacy `new-york`, in-place). Radix Select → Base UI
Select. Typecheck clean (0 new errors).

## Changed

- `src/components/ui/select.tsx`
  - Import `radix-ui` Select → `@base-ui/react/select`.
  - `Select` is now a bare re-export (`const Select = SelectPrimitive.Root`) — Base UI
    `Select.Root.Props` is generic (`<Value, Multiple>`), so the usual
    `React.ComponentProps` wrapper pattern doesn't fit; the re-export sidesteps it (Root
    renders no DOM, so the old `data-slot="select"` is dropped harmlessly).
  - `SelectContent`: `Content` → `Portal > Positioner > Popup > List`. `ScrollUpButton`/
    `ScrollDownButton` → `ScrollUpArrow`/`ScrollDownArrow`; `Viewport` → `List`. The Radix
    `position="popper"` prop is dropped in favor of `alignItemWithTrigger` (Positioner);
    `sideOffset`(=4)/`align`/`alignItemWithTrigger` forwarded to the Positioner. `isolate z-50`
    lives on the Popup (per the golden shape).
  - `SelectLabel` → `GroupLabel`. `SelectItem` keeps `ItemText` + `ItemIndicator` (renamed
    parts); item highlight `focus:*` → `data-highlighted:*`.
  - `SelectTrigger`'s `Icon asChild` → `Icon render={<ChevronDownIcon … />}`.
  - Animations rewritten to `transition-[opacity,transform]` +
    `data-starting-style`/`data-ending-style`; CSS vars
    `--radix-select-content-available-height`/`-transform-origin`/`--radix-select-trigger-*`
    → `--available-height`/`--transform-origin`/`--anchor-*`. The `position==="popper"`
    translate/size classes were removed with the `position` prop.

Leftover scan clean: no `radix`/`--radix`/`data-[state=…]` in select.tsx.

## Left alone

- **No consumers.** No file outside `components/ui` imports the Select wrapper (the one
  `onValueChange` in `language-switcher.tsx` is on `Tabs`, not Select). So there was no
  call-site sweep; this is a wrapper-only migration.

## Behavior changes

- **Alignment default**: Radix wrapper defaulted to `position="popper"`; Base UI now defaults
  to `alignItemWithTrigger` (item-aligned) unless a caller passes `alignItemWithTrigger={false}`.
  No consumer exercises this today. FLAGGED.
- **Highlight** via `data-highlighted`; **animation** is fade + scale.

## Verify by hand

- The Select component is currently unused in the app. If it gets adopted: open the select,
  confirm the popup positions/aligns correctly, items highlight on hover/keys, the check
  indicator shows on the selected item, and the chosen label appears in the trigger.
