import { Button } from "@/components/ui/button.tsx";
import type { Activity as TActivity } from "@/config/routes.ts";
import { useAppLayoutActions, useSidebarSection } from "@/store/app-layout.ts";

type WelcomeActionProps = {
  data: TActivity;
};

export default function WelcomeActivity({ data }: WelcomeActionProps) {
  const sidebar = useSidebarSection();
  const { toggleSidebar } = useAppLayoutActions();

  const Icon = data.icon;

  return (
    <Button
      key={data.key}
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
