import { Suspense } from "react";
import { activities } from "@/config/routes.ts";

type SidebarProps = {
  activeView: string;
};

export default function Sidebar({ activeView }: SidebarProps) {
  const Component = activities.find((a) => a.key === activeView)?.sidebar;

  if (!Component) {
    return null;
  }

  return (
    <Suspense fallback={<p className="mx-auto">Loading...</p>}>
      <Component />
    </Suspense>
  );
}
