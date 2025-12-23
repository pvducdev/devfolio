import { Outlet } from "@tanstack/react-router";
import TabBar from "@/components/tabs/tab-bar";
import { Tabs } from "@/components/ui/tabs";
import PortfolioWelcome from "@/components/welcome/container.tsx";
import { useTabShortcuts } from "@/hooks/use-tab-shortcuts";
import { useActiveTabId, useHasOpenTabs } from "@/store/tabs";

export default function CodeEditorContainer() {
  const hasOpenTabs = useHasOpenTabs();
  const activeTabId = useActiveTabId();

  useTabShortcuts();

  if (!hasOpenTabs) {
    return <PortfolioWelcome />;
  }

  return (
    <Tabs
      className="flex size-full flex-col overflow-hidden"
      value={activeTabId || undefined}
    >
      <TabBar />
      <div className="size-full overflow-auto">
        <Outlet />
      </div>
    </Tabs>
  );
}
