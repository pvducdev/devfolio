# popover

2026-07-16 — transformation engine (legacy `new-york`, in-place). Radix Popover → Base UI
Popover (Portal > Positioner > Popup). Typecheck clean (0 new errors).

## Changed

- `src/components/ui/popover.tsx`
  - Import `radix-ui` → `@base-ui/react/popover`.
  - `PopoverContent`: `Content` → `Portal > Positioner > Popup`. `side/sideOffset/align/
alignOffset` destructured and forwarded to `Positioner` (Positioner `isolate z-50`, Popup
    keeps `z-50`). Animation classes rewritten to `transition-[opacity,transform]` +
    `data-starting-style`/`data-ending-style` (opacity + 95% scale). CSS var
    `--radix-popover-content-transform-origin` → `--transform-origin`.
  - **`PopoverAnchor` (Base UI dropped the Anchor part).** Reimplemented with a small React
    context: `Popover` provides `{ anchorRef, registered }`; `PopoverAnchor` uses `useRender`
    to attach `anchorRef` to its rendered child and flips `registered`; `PopoverContent`
    passes `anchor={anchorRef}` to the Positioner only when a `PopoverAnchor` was rendered
    (otherwise the Positioner falls back to the trigger, as before).
- Consumers:
  - `src/components/theme/theme-switcher.tsx` — `PopoverTrigger asChild` →
    `render={<Button … />}` (trigger-anchored popover, no PopoverAnchor).
  - `src/components/assistant/slash-command-popover.tsx` —
    `<PopoverAnchor asChild>{children}</PopoverAnchor>` → `<PopoverAnchor render={children} />`
    (anchor ref attaches to the `<Textarea>`); `onOpenAutoFocus={(e)=>e.preventDefault()}` →
    `initialFocus={false}` (Popup prop); CSS vars in the className
    `--radix-popover-content-available-height` → `--available-height`,
    `--radix-popover-trigger-width` → `--anchor-width`.

Leftover scan clean: no `radix`/`--radix-popover-*` in popover.tsx or its consumers.

## Behavior changes

- **Enter/exit animation** is now a fade + 95% scale transition instead of Radix slide-in
  keyframes (agreed minimal-animation approach).
- **Anchor mechanism** changed from a rendered `Anchor` element to a Positioner `anchor` ref.
  Functionally equivalent (popup still anchors to the textarea), but the implementation
  differs — FLAGGED for QA of the slash-command popover position.

## Verify by hand

- Theme switcher: click the trigger button, popover opens anchored below it, closes on
  outside-press/escape.
- Assistant input: type `/` to open the slash-command popover — it must anchor to the
  textarea, match its width (`--anchor-width`), size to available height, and NOT steal focus
  from the textarea (`initialFocus={false}`), so typing keeps filtering commands.
