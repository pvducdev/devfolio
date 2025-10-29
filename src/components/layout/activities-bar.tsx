import { useShallow } from "zustand/react/shallow";
import Activity from "@/components/layout/activity.tsx";
import { activities } from "@/config/routes.tsx";
import { useSidebarStore } from "@/store/sidebar.ts";

export default function ActivitiesBar() {
  const [activeView, toggleActiveView] = useSidebarStore(
    useShallow((state) => [state.activeView, state.toggleActiveView])
  );

  return (
    <aside className="flex h-full w-8 flex-col items-center space-y-2 bg-sidebar p-0.5">
      {activities.map((act) => (
        <Activity
          active={act.key === activeView}
          data={act}
          key={act.name}
          onClick={(values) => {
            toggleActiveView(values.key);
          }}
        />
      ))}
    </aside>
  );
}
