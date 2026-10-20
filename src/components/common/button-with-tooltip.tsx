import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ButtonWithTooltipProps = ComponentProps<typeof Button> & {
  tooltip: ReactNode;
  tooltipProps?: ComponentProps<typeof TooltipContent>;
};

export default function ButtonWithTooltip({
  children,
  tooltip,
  tooltipProps,
  ...rest
}: ButtonWithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button {...rest}>{children}</Button>} />
      <TooltipContent {...tooltipProps}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
