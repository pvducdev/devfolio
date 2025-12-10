import Activity from "@/components/layout/activity.tsx";
import { activities } from "@/config/routes.ts";

type ActivitiesBarProps = {
  active: string | null;
  onClick: (key: string) => void;
};

export default function ActivitiesBar({ active, onClick }: ActivitiesBarProps) {
  return (
    <aside className="flex h-full w-8 flex-col items-center space-y-2 bg-sidebar p-0.5">
      {activities.map((act) => (
        <Activity
          active={act.key === active}
          data={act}
          key={act.key}
          onClick={(values) => {
            onClick(values.key);
          }}
        />
      ))}
    </aside>
  );
}
