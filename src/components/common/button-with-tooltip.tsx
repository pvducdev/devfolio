import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ButtonWithTooltipProps = React.ComponentProps<typeof Button> & {
  tooltip?: React.ReactNode;
  tooltipProps?: React.ComponentProps<typeof TooltipContent> &
    Pick<React.ComponentProps<typeof Tooltip>, "delayDuration">;
};

export default function ButtonWithTooltip({
  children,
  tooltip,
  tooltipProps = {},
  ...rest
}: ButtonWithTooltipProps) {
  const { delayDuration = 300, ...tooltipPropsRest } = tooltipProps;

  if (!tooltip) {
    return <Button {...rest}>{children}</Button>;
  }

  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>
        <Button {...rest}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent {...tooltipPropsRest}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
