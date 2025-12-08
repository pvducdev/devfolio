import { Suspense } from "react";
import { activities } from "@/config/routes.ts";
import { ui_state_loading } from "@/paraglide/messages.js";

type SidebarProps = {
  activeView: string;
};

export default function Sidebar({ activeView }: SidebarProps) {
  const Component = activities.find((a) => a.key === activeView)?.sidebar;

  if (!Component) {
    return null;
  }

  return (
    <Suspense fallback={<p className="mx-auto">{ui_state_loading()}</p>}>
      <Component />
    </Suspense>
  );
}
