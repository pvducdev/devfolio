import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button.tsx";
import type { Activity as TActivity } from "@/config/routes.tsx";
import { useSidebarStore } from "@/store/sidebar.ts";

type WelcomeActionProps = {
  data: TActivity;
};

export default function WelcomeAction({ data }: WelcomeActionProps) {
  const [activeView, toggleActiveView] = useSidebarStore(
    useShallow((state) => [state.activeView, state.toggleActiveView])
  );

  const Icon = data.icon;

  return (
    <Button
      className="justify-center border-gray-300 transition-all hover:border-primary hover:text-primary"
      key={data.key}
      onClick={() => {
        toggleActiveView(data.key);
      }}
      variant={activeView === data.key ? "default" : "outline"}
    >
      <Icon className="mr-2 h-4 w-4" />
      {data.name}
    </Button>
  );
}
