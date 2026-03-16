import TabBar from "@/components/tabs/tab-bar";
import { Tabs } from "@/components/ui/tabs";
import { useTabShortcuts } from "@/hooks/use-tab-shortcuts";
import { useActiveTabId } from "@/store/tabs";

export default function TabsContainer() {
  const activeTabId = useActiveTabId();

  useTabShortcuts();

  return (
    <Tabs value={activeTabId || undefined}>
      <TabBar />
    </Tabs>
  );
}
