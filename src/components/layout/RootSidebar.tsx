import Activity from "@/components/layout/Activity.tsx";
import { activities } from "@/config/routes.tsx";

export default function RootSidebar() {
  return (
    <div className="w-8 h-full bg-gray-100 border-r flex flex-col space-y-2 p-0.5 items-center">
      {activities.map((act) => (
        <Activity data={act} key={act.name} />
      ))}
    </div>
  );
}
