import { useShallow } from "zustand/react/shallow";
import Activity from "@/components/layout/activity.tsx";
import { activities } from "@/config/routes.tsx";
import { useSidebarStore } from "@/store/sidebar.ts";

export default function ActivitiesBar() {
  const [activeView, onChangeActiveView] = useSidebarStore(
    useShallow((state) => [state.activeView, state.onChangeActiveView])
  );

  return (
    <aside className="flex h-full w-8 flex-col items-center space-y-2 border-r bg-gray-100 p-0.5">
      {activities.map((act) => (
        <Activity
          active={act.key === activeView}
          data={act}
          key={act.name}
          onClick={(values) => {
            onChangeActiveView(act.key !== activeView ? values.key : undefined);
          }}
        />
      ))}
    </aside>
  );
}
