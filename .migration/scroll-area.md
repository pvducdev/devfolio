# scroll-area

2026-07-16 — transformation engine (legacy `new-york`, in-place). Radix ScrollArea →
Base UI ScrollArea. Typecheck clean (0 new errors).

## Changed

- `src/components/ui/scroll-area.tsx`
  - Import `radix-ui` ScrollArea → `@base-ui/react/scroll-area`.
  - Part renames: `ScrollAreaScrollbar` → `Scrollbar`, `ScrollAreaThumb` → `Thumb`
    (`Root`/`Viewport`/`Corner` unchanged).
  - Added the new `ScrollArea.Content` part wrapping `children` inside `Viewport` — Base UI
    needs it to measure horizontal overflow (the tab bar scrolls horizontally).
  - Prop types → `ScrollAreaPrimitive.{Root,Scrollbar}.Props`; React import reduced to a
    type-only import (still used for `viewportRef?: React.Ref<HTMLDivElement>`).
  - `viewportRef`, `data-slot` values and every Tailwind class kept unchanged.

Leftover scan clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/scroll-area.tsx` → none.

## Left alone

- Consumers `tab-bar.tsx` (`viewportRef={listRef}`), `scroll-area-with-anchor.tsx`
  (`ref` on Root + `viewportRef`), `assistant/content.tsx`, `assistant/mobile/content.tsx`
  needed no changes — no consumer passed the dropped `type`/`scrollHideDelay` props, and
  ref forwarding is unchanged (typecheck clean).

## Behavior changes

- Radix `type`/`scrollHideDelay` auto-hide model is replaced by Base UI's CSS-driven model
  (`data-hovering`/`data-scrolling`, scrollbar mounts when scrollable). The current wrapper
  never styled scrollbar visibility on `data-state`, so scrollbars still appear whenever
  content overflows — no visual class change was required. If auto-hide-on-idle is later
  desired, add an opacity transition keyed on `data-hovering`/`data-scrolling`.

## Verify by hand

- Tab bar: overflow the tabs horizontally and confirm the horizontal scrollbar appears and
  drags; wheel-to-horizontal still works (viewport ref intact).
- Assistant panel (`ScrollAreaWithAnchor`): vertical scroll works, the "scroll to bottom"
  button appears when not at bottom, and `scrollTo` reaches the end (viewport ref + Content
  don't break scrollHeight).
