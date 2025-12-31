import { Outlet } from "@tanstack/react-router";
import TabsContainer from "@/components/tabs/container.tsx";
import PortfolioWelcome from "@/components/welcome/container.tsx";
import { useHasOpenTabs } from "@/store/tabs";

export default function CodeEditorContainer() {
  const hasOpenTabs = useHasOpenTabs();

  if (!hasOpenTabs) {
    return <PortfolioWelcome />;
  }

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <TabsContainer />
      <div className="size-full flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
