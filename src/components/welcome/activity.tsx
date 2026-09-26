import {
  useAppLayoutActions,
  useSidebarSection,
} from "@/components/layout/store";
import type { Activity as TActivity } from "@/components/sidebar/activities";
import { Button } from "@/components/ui/button";

interface WelcomeActionProps {
  data: TActivity;
}

export default function WelcomeActivity({ data }: WelcomeActionProps) {
  const sidebar = useSidebarSection();
  const { toggleSidebar } = useAppLayoutActions();

  const Icon = data.icon;

  return (
    <Button
      onClick={() => {
        toggleSidebar(data.key);
      }}
      variant={sidebar === data.key ? "default" : "outline"}
    >
      <Icon />
      {data.name()}
    </Button>
  );
}
