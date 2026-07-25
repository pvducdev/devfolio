# dialog

2026-07-16 — transformation engine (legacy `new-york`, in-place). Radix Dialog → Base UI
Dialog (centered modal: Popup without a Positioner). Typecheck clean (0 new errors).

## Changed

- `src/components/ui/dialog.tsx`
  - Import `radix-ui` → `@base-ui/react/dialog`; `import * as React` → `import type * as React`
    (still used by DialogHeader/Footer prop types).
  - Part renames: `Overlay` → `Backdrop` (kept the public `DialogOverlay` name),
    `Content` → `Popup` (public `DialogContent`). `Root/Trigger/Portal/Close/Title/Description`
    map directly.
  - `DialogPortal` no longer passes `data-slot` — Base UI `Dialog.Portal.Props` is narrow
    (`keepMounted`/`container`/`children` only) and rejects arbitrary attributes.
  - Prop types → `DialogPrimitive.{Root,Trigger,Portal,Close,Backdrop,Popup,Title,Description}.Props`.
  - Animation classes rewritten: Backdrop and Popup `data-[state=open/closed]:animate-in/out
fade/zoom` → `transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0`
    (fade-only, per the agreed minimal-animation approach). Centered positioning
    (`fixed top/left 50% + translate`) kept static.
  - Dropped the vestigial `data-[state=open]:bg-accent data-[state=open]:text-muted-foreground`
    on the built-in close button (Base UI `Close` has no open-state; those classes never
    applied meaningfully).
- Consumers (`asChild` → `render`):
  - `src/components/resume-viewer/dialog-container.tsx` — `DialogTrigger asChild` and
    `DialogClose asChild` → `render={<Button … />}`.
- Downstream type fix (caused by the migration, not a dialog file):
  - `src/components/ui/command.tsx` (cmdk — otherwise untouched) — `CommandDialog` props
    changed to `Omit<ComponentProps<typeof Dialog>, "children"> & { …; children?: ReactNode }`
    because Base UI `Dialog.Root`'s `children` type widened to include a payload render
    function, which is not assignable to cmdk's `<Command>` children.

Leftover scan clean: no `radix`/`data-[state=…]` in dialog.tsx or dialog-container.tsx.

## Left alone

- `keyboard-shortcuts/modal.tsx` uses `Dialog`/`DialogContent`/`DialogTitle` with only
  `open`/`onOpenChange` — no change needed (Base UI Root keeps `open`/`onOpenChange`/`modal`).
- cmdk `command.tsx` remains on cmdk; only the one type annotation above changed.

## Behavior changes

- **Focus handling** props were not in use (`onOpenAutoFocus`/`onCloseAutoFocus` absent in
  consumers), so no `initialFocus`/`finalFocus` mapping was needed. Base UI focuses the first
  tabbable element on open by default.
- **Animation** is now a fade transition (no zoom-in), per the minimal-animation decision.

## Verify by hand

- Resume dialog: trigger button opens it, backdrop fades in, ESC / the Cancel button
  (`DialogClose render`) closes it, focus returns to the trigger.
- Keyboard-shortcuts modal opens/closes via its `open` state and renders title/rows.
- Command palette (cmdk in a Dialog) still opens and filters.
