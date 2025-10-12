import { Link } from "@tanstack/react-router";
import ButtonWithTooltip from "@/components/common/ButtonWithTooltip.tsx";
import type { Activity as TActivity } from "@/config/routes.tsx";

type ActivityProps = {
  data: TActivity;
};

export default function Activity({ data }: ActivityProps) {
  const Icon = data.icon;

  return (
    <ButtonWithTooltip
      asChild
      className="size-7"
      size="icon"
      tooltip={data.name}
      tooltipProps={{ side: "right" }}
      variant="ghost"
    >
      <Link to={data.path}>
        <Icon />
      </Link>
    </ButtonWithTooltip>
  );
}
