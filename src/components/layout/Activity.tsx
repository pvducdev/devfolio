import ButtonWithTooltip from "@/components/common/button-with-tooltip.tsx";
import type { Activity as TActivity } from "@/config/routes.tsx";

type ActivityProps = {
  active: boolean;
  data: TActivity;
  onClick: (data: TActivity) => void;
};

export default function Activity({ active, data, onClick }: ActivityProps) {
  const Icon = data.icon;

  return (
    <ButtonWithTooltip
      className="size-7"
      onClick={() => {
        onClick(data);
      }}
      size="icon"
      tooltip={data.name}
      tooltipProps={{ side: "right" }}
      variant={active ? "outline" : "ghost"}
    >
      <Icon />
    </ButtonWithTooltip>
  );
}
