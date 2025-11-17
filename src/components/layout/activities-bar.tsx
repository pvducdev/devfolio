import { useShallow } from "zustand/react/shallow";
import Activity from "@/components/layout/activity.tsx";
import { activities } from "@/config/routes.ts";
import { useAppLayoutStore } from "@/store/app-layout.ts";

export default function ActivitiesBar() {
  const [sidebar, toggleSidebar] = useAppLayoutStore(
    useShallow((state) => [state.sidebar, state.toggleSidebar])
  );

  return (
    <aside className="flex h-full w-8 flex-col items-center space-y-2 bg-sidebar p-0.5">
      {activities.map((act) => (
        <Activity
          active={act.key === sidebar}
          data={act}
          key={act.name}
          onClick={(values) => {
            toggleSidebar(values.key);
          }}
        />
      ))}
    </aside>
  );
}
