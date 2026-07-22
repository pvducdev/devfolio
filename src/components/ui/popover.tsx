import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

type PopoverAnchorContextValue = {
  anchorRef: React.RefObject<HTMLElement | null>
  registered: React.RefObject<boolean>
}

const PopoverAnchorContext =
  React.createContext<PopoverAnchorContextValue | null>(null)

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  const anchorRef = React.useRef<HTMLElement | null>(null)
  const registered = React.useRef(false)
  const value = React.useMemo(() => ({ anchorRef, registered }), [])

  return (
    <PopoverAnchorContext.Provider value={value}>
      <PopoverPrimitive.Root data-slot="popover" {...props} />
    </PopoverAnchorContext.Provider>
  )
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  side,
  sideOffset = 4,
  alignOffset,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "side" | "sideOffset" | "align" | "alignOffset"
  >) {
  const anchorContext = React.useContext(PopoverAnchorContext)

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={
          anchorContext?.registered.current
            ? anchorContext.anchorRef
            : undefined
        }
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "bg-popover text-popover-foreground z-50 w-72 origin-(--transform-origin) rounded-md border p-4 shadow-md outline-hidden transition-[opacity,transform] data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({ render, ...props }: useRender.ComponentProps<"div">) {
  const anchorContext = React.useContext(PopoverAnchorContext)

  if (anchorContext) {
    anchorContext.registered.current = true
  }

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { "data-slot": "popover-anchor" } as React.ComponentProps<"div">,
      props
    ),
    ref: anchorContext?.anchorRef,
    render,
  })
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
