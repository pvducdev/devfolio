import ButtonWithTooltip from "@/components/common/button-with-tooltip";
import type { Activity as TActivity } from "@/config/routes";
import { cn } from "@/lib/utils";

interface ActivityProps {
  active: boolean;
  data: TActivity;
  onClick: (data: TActivity) => void;
}

export default function Activity({ active, data, onClick }: ActivityProps) {
  const Icon = data.icon;

  return (
    <ButtonWithTooltip
      className={cn(
        "size-7 border-none",
        active ? "bg-accent text-accent-foreground" : ""
      )}
      onClick={() => {
        onClick(data);
      }}
      size="icon"
      tooltip={data.name()}
      tooltipProps={{ side: "right" }}
      variant={active ? "outline" : "ghost"}
    >
      <Icon />
    </ButtonWithTooltip>
  );
}
