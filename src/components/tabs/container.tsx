import TabBar from "@/components/tabs/tab-bar.tsx";
import { Tabs } from "@/components/ui/tabs.tsx";
import { useTabShortcuts } from "@/hooks/use-tab-shortcuts.ts";
import { useActiveTabId } from "@/store/tabs.ts";

export default function TabsContainer() {
  const activeTabId = useActiveTabId();

  useTabShortcuts();

  return (
    <Tabs value={activeTabId || undefined}>
      <TabBar />
    </Tabs>
  );
}
