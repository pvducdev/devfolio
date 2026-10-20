import { useActiveTabId } from "@/components/tabs/store";
import TabBar from "@/components/tabs/tab-bar";
import { useTabShortcuts } from "@/components/tabs/use-tab-shortcuts";
import { Tabs } from "@/components/ui/tabs";

export default function TabsContainer() {
  const activeTabId = useActiveTabId();

  useTabShortcuts();

  return (
    <Tabs value={activeTabId || undefined}>
      <TabBar />
    </Tabs>
  );
}
