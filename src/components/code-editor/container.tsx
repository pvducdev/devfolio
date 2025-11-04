import { useShallow } from "zustand/react/shallow";
import MDXViewer from "@/components/tabs/mdx-viewer";
import TabBar from "@/components/tabs/tab-bar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PortfolioWelcome from "@/components/welcome/container.tsx";
import { useTabsStore } from "@/store/tabs";

export default function CodeEditorContainer() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useTabsStore(
    useShallow((state) => ({
      tabs: state.tabs,
      activeTabId: state.activeTabId,
      setActiveTab: state.setActiveTab,
      closeTab: state.closeTab,
    }))
  );

  if (tabs.length === 0) {
    return <PortfolioWelcome />;
  }

  return (
    <Tabs
      className="flex h-full w-full flex-col overflow-hidden"
      onValueChange={setActiveTab}
      value={activeTabId || undefined}
    >
      <TabBar
        activeTabId={activeTabId}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        tabs={tabs}
      />
      {tabs.map((tab) => (
        <TabsContent
          className="flex-1 overflow-hidden"
          key={tab.id}
          value={tab.id}
        >
          <MDXViewer tab={tab} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
