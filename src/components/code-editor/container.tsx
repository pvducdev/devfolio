import MDXViewer from "@/components/tabs/mdx-viewer";
import TabBar from "@/components/tabs/tab-bar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PortfolioWelcome from "@/components/welcome/container.tsx";
import { useActiveTabId, useOpenTabs, useTabsActions } from "@/store/tabs";

export default function CodeEditorContainer() {
  const tabs = useOpenTabs();
  const activeTabId = useActiveTabId();
  const { setActiveTab, closeTab } = useTabsActions();

  if (tabs.length === 0) {
    return <PortfolioWelcome />;
  }

  return (
    <Tabs
      className="flex size-full flex-col overflow-hidden"
      onValueChange={setActiveTab}
      value={activeTabId || undefined}
    >
      <TabBar onTabClick={setActiveTab} onTabClose={closeTab} tabs={tabs} />
      {tabs.map((tab) => (
        <TabsContent className="overflow-hidden" key={tab.id} value={tab.id}>
          <MDXViewer tab={tab} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
