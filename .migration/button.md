# button / badge / breadcrumb / tree (Slot users)

2026-07-16 — transformation engine (legacy `new-york`, in-place). Slot/asChild → Base UI
`render`. Typecheck clean (0 new errors).

## Changed

- `src/components/ui/button.tsx`
  - `radix-ui` `Slot` idiom → real `@base-ui/react/button` primitive (`ButtonPrimitive`),
    which supports `render` natively. Removed `asChild` and the `Comp` switch.
  - Props typed `Omit<ButtonPrimitive.Props, "className"> & VariantProps<…> & { className?: string }`
    so `cn(buttonVariants(...))` keeps a `string` className (Base UI's `className` also
    allows a state function, which cva would reject).
  - Kept `data-slot`, cva variants, and every class unchanged.
- `src/components/ui/badge.tsx`
  - Slot idiom → `useRender` + `mergeProps` (`@base-ui/react/{use-render,merge-props}`);
    `asChild` → `render`. `data-*` object literal cast to `React.ComponentProps<"span">`.
- `src/components/ui/breadcrumb.tsx`
  - `BreadcrumbLink` Slot idiom → `useRender` + `mergeProps`; `asChild` → `render`.
    Other breadcrumb parts unchanged.
- `src/components/ui/tree.tsx`
  - `TreeItem` Slot idiom → `useRender` + `mergeProps`; `asChild` → `render`. All
    `data-*`/`aria-expanded`/`style`/`children` moved into the merged props object,
    still wrapped in the existing `TreeContext.Provider`.
- `src/components/common/contribution-graph-primitive.tsx` (hand-rolled, NOT a shadcn
  wrapper — imported radix `Slot` directly)
  - All 9 polymorphic parts (`Grid`, `Head`, `Body`, `Row`, `HeaderCell`, `Cell`,
    `Label`, `Legend`, `LegendItem`) converted from `asChild ? Slot.Root : tag` to
    `useRender` + `mergeProps`. `Cell` keeps `type: render ? undefined : "button"` to
    match the old `type={asChild ? undefined : "button"}` behavior and stays wrapped in
    its `<td>`.
- Consumer call-sites (`asChild` → `render`, `nativeButton={false}` for non-buttons):
  - `src/components/common/error-page.tsx:49` — `<Button asChild><Link/></Button>` →
    `<Button render={<Link … />} nativeButton={false}>{label}</Button>`.
  - `src/components/tabs/tab-bar.tsx` — inner close `<Button asChild><span/></Button>` →
    `render={<span onPointerDown=… />} nativeButton={false}`. (The OUTER `TabsTrigger
asChild` on the same block is still Radix Tabs; migrated in the tabs step.)

Leftover scan clean: `grep -n "radix-ui\|@radix-ui\|Slot"` on all touched files → none.

## Left alone

- `TabsTrigger`, `DropdownMenuTrigger`, `TooltipTrigger`, `PopoverTrigger`,
  `DialogTrigger`/`DialogClose` `asChild` call-sites — belong to their own component
  migrations (still Radix at this point).
- `DrawerClose asChild` (settings-drawer), `ContextMenuTrigger asChild`
  (tab-context-menu), `PopoverAnchor asChild` (slash-command-popover) — Drawer is vaul
  (not radix, untouched); the menu/popover ones migrate in their steps.

## Behavior changes

- Base UI's `Button` primitive renders `type="button"` by default (Radix Slot did not
  force a type on the plain `<button>` path — but our old default element was a bare
  `<button>` which defaults to `type="submit"`). Net: standalone `<Button>` now defaults
  to `type="button"`. This is the shadcn-base-registry behavior and is the safer default
  (no accidental form submits); flagged, not patched.

## Verify by hand

- Error page action button that links (`<Button render={<Link/>}>`) navigates and looks
  identical.
- Tab close "x" button (span render) still stops propagation and closes the tab.
- Badges, breadcrumb links, and the file tree render and style exactly as before.
- Any `<Button type="submit">` inside a form still submits (explicit type still wins).
