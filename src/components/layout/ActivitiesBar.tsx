import Activity from "@/components/layout/Activity.tsx";
import { activities } from "@/config/routes.tsx";

export default function ActivitiesBar() {
  return (
    <aside className="flex h-full w-8 flex-col items-center space-y-2 border-r bg-gray-100 p-0.5">
      {activities.map((act) => (
        <Activity data={act} key={act.name} />
      ))}
    </aside>
  );
}
