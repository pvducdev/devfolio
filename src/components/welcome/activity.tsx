import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button.tsx";
import type { Activity as TActivity } from "@/config/routes.tsx";
import { useSidebarStore } from "@/store/sidebar.ts";

type WelcomeActionProps = {
  data: TActivity;
};

export default function WelcomeActivity({ data }: WelcomeActionProps) {
  const [activeView, toggleActiveView] = useSidebarStore(
    useShallow((state) => [state.activeView, state.toggleActiveView])
  );

  const Icon = data.icon;

  return (
    <Button
      key={data.key}
      onClick={() => {
        toggleActiveView(data.key);
      }}
      variant={activeView === data.key ? "default" : "outline"}
    >
      <Icon />
      {data.name}
    </Button>
  );
}
