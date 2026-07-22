# tabs

2026-07-16 — transformation engine (legacy `new-york`, in-place). Radix Tabs → Base UI
Tabs. Typecheck clean (0 new errors).

## Changed

- `src/components/ui/tabs.tsx`
  - Import `radix-ui` Tabs → `@base-ui/react/tabs`.
  - `TabsPrimitive.Root`→`Root`, `List`→`List`, `Trigger`→`Tab`, `Content`→`Panel`.
  - Prop types `React.ComponentProps<typeof TabsPrimitive.X>` →
    `TabsPrimitive.{Root,List,Tab,Panel}.Props`; dropped the now-unused React import.
  - Class rewrites on `TabsTrigger`: `data-[state=active]:*` → `data-active:*` (5 occurrences)
    and added `aria-disabled:pointer-events-none aria-disabled:opacity-50` alongside the
    existing `disabled:*` (Base UI Tab surfaces disabled as `aria-disabled`). All other
    classes and `data-slot` values unchanged.
- Consumers (class + call-site rewrites):
  - `src/components/tabs/tab-bar.tsx`
    - Outer `TabsTrigger asChild` → `render={<TabContextMenu tabId={tab.id} />}` +
      `nativeButton={false}`; the `<Link>` chain moved to `TabsTrigger` children.
    - `data-[state=active]:*` → `data-active:*` on the trigger; the inner close Button's
      `group-data-[state=active]:opacity-100` → `group-data-active:opacity-100`.
  - `src/components/project/container.tsx` — `data-[state=active]:bg-muted` →
    `data-active:bg-muted` on both vertical-tab triggers.

Leftover scan clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/tabs.tsx` → none;
no `data-[state=active]` remains anywhere in `src`.

## Left alone

- `src/components/tabs/tab-context-menu.tsx` still uses radix `Slot` + radix
  `context-menu`; it works as a Base UI `render` target because it forwards injected
  props to its inner `Slot.Root`. It is fully migrated in the context-menu step.
- `container.tsx` / `language-switcher.tsx` tab usages needed no change (typecheck clean).

## Behavior changes

- **Activation mode.** Radix Tabs defaulted to AUTOMATIC activation (arrow keys move
  selection). Base UI Tabs defaults to MANUAL activation (arrow keys move focus; Enter/Space
  selects). No consumer set `activationMode`, and the shadcn base registry accepts this
  default — FLAGGED, not patched. Opt back in per-list with `<TabsList activateOnFocus>`
  if the old feel is required.

## Verify by hand

- Keyboard: focus a tab, press Left/Right — focus moves; press Enter/Space — panel switches
  (manual activation). Confirm this is acceptable.
- The browser tab bar: active tab shows the accent background (`data-active:*`), the close
  "x" appears on hover / when active (`group-data-active`), and right-click still opens the
  TabContextMenu on the tab (nested render chain intact).
- Project page vertical tabs highlight the active item (`data-active:bg-muted`).
