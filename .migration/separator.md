# separator

2026-07-16 — transformation engine (legacy `new-york` style, in-place). Clean 1:1 migration.

## Changed

- `src/components/ui/separator.tsx`
  - Import `radix-ui` `Separator.Root` → callable `Separator` from `@base-ui/react/separator`.
  - Dropped the `decorative` prop (Base UI Separator is always semantic `role="separator"`;
    no consumer passed it).
  - Props type `React.ComponentProps<typeof SeparatorPrimitive.Root>` → `SeparatorPrimitive.Props`;
    removed the now-unused `import * as React`.
  - Kept `data-slot="separator"`, `orientation`, and every Tailwind class unchanged
    (`data-[orientation=...]` selectors are identical on both libraries).
  - Leftover scan clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/separator.tsx` → none.

## Left alone

- No consumers import `ui/separator` directly outside `components/ui`, and none passed
  `decorative`, so no call-site sweep was required.

## Behavior changes

None. Data attribute (`data-orientation`) and visual output are identical.

## Verify by hand

- Render a horizontal and a vertical separator; confirm 1px line, correct axis sizing.
- Confirm screen readers still announce it as a separator (role unchanged).
