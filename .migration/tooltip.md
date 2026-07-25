# tooltip

2026-07-16 — transformation engine (legacy `new-york`, in-place). Radix Tooltip → Base UI
Tooltip (Portal > Positioner > Popup). Typecheck clean (0 new errors).

## Changed

- `src/components/ui/tooltip.tsx`
  - Import `radix-ui` → `@base-ui/react/tooltip`; dropped `import * as React`.
  - `TooltipProvider`: `delayDuration` → `delay` (default 0 preserved).
  - `Tooltip` (Root): now accepts `delay` and forwards it to the wrapping `TooltipProvider`
    (Radix put `delayDuration` on Root/Provider; Base UI's shared delay lives on Provider).
  - `TooltipContent`: `Content` → `Portal > Positioner > Popup`. `side/sideOffset/align/
alignOffset` destructured and forwarded to `Positioner` (declare→destructure→forward);
    Positioner gets `isolate z-50`, Popup keeps `z-50`.
  - Animation classes rewritten: `animate-in/out fade/zoom/slide` →
    `transition-[opacity,transform] data-starting-style:opacity-0 data-starting-style:scale-95
data-ending-style:opacity-0 data-ending-style:scale-95`. CSS var
    `--radix-tooltip-content-transform-origin` → `--transform-origin`.
  - Arrow kept inside Popup; Radix-specific `translate-y-[calc(-50%_-_2px)]`/`fill-foreground`
    dropped (Base UI positions the arrow div itself); visual `bg-foreground size-2.5 rotate-45
rounded-[2px]` retained.
- Consumers (`asChild` → `render`):
  - `src/components/common/button-with-tooltip.tsx` — `delayDuration` → `delay` (type Pick,
    destructure default 300, `<Tooltip delay=…>`); `TooltipTrigger asChild` →
    `render={<Button … />}`.
  - `src/components/about/contribution-cell.tsx` — `TooltipTrigger asChild` →
    `render={<ContributionGraph.Cell … />}`.
  - `src/components/about/contribution-section.tsx` — `TooltipTrigger asChild` →
    `render={<ContributionGraph.LegendItem … />}`.

Note: Base UI `Tooltip.Trigger` has NO `nativeButton` prop (Popover/Menu triggers do); it
was not added to the non-button render targets.

Leftover scan clean: no `radix`/`--radix-tooltip-*` in tooltip.tsx or its consumers.

## Behavior changes

- **Arrow position/shape** may differ slightly — Base UI positions the arrow `<div>` via the
  Positioner rather than Radix's manual translate. FLAGGED for visual QA.
- **Enter/exit animation** is now a transition (fade + 95% scale) instead of Radix's
  slide-in keyframes — per the agreed "minimal Base UI animations" decision.

## Verify by hand

- Hover the contribution cells / legend items and the tooltip buttons: tooltip opens
  (instantly for `delay=0`, ~300ms for button-with-tooltip), shows correct text, arrow points
  at the trigger, and dismisses on mouse-out/escape.
