import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TooltipProps = ComponentProps<typeof TooltipContent> &
  Pick<ComponentProps<typeof Tooltip>, "delay">;

type ButtonWithTooltipProps = ComponentProps<typeof Button> & {
  tooltip?: ReactNode;
  tooltipProps?: TooltipProps;
};

export default function ButtonWithTooltip({
  children,
  tooltip,
  tooltipProps = {},
  ...rest
}: ButtonWithTooltipProps) {
  const { delay = 300, ...tooltipPropsRest } = tooltipProps;

  if (!tooltip) {
    return <Button {...rest}>{children}</Button>;
  }

  return (
    <Tooltip delay={delay}>
      <TooltipTrigger render={<Button {...rest}>{children}</Button>} />
      <TooltipContent {...tooltipPropsRest}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
