import { X } from "lucide-react";
import { useState } from "react";
import PortfolioWelcome from "@/components/layout/welcome.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CodeEditorContainer() {
  const [tabs, setTabs] = useState([
    { id: "1", label: "Account", content: "Account settings and preferences" },
    { id: "2", label: "Password", content: "Change your password here" },
    {
      id: "3",
      label: "Notifications",
      content: "Manage notification settings",
    },
  ]);
  const [activeTab, setActiveTab] = useState("1");

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTab === tabId && newTabs.length > 0) {
      const currentIndex = tabs.findIndex((tab) => tab.id === tabId);
      const nextTab = newTabs[Math.min(currentIndex, newTabs.length - 1)];
      setActiveTab(nextTab.id);
    }
  };

  return (
    <div className="h-full w-full overflow-auto">
      {tabs && tabs.length > 0 ? (
        <Tabs
          className="w-full gap-0"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="w-full flex-1 justify-start space-x-0.5 rounded-none border-b bg-transparent">
            {tabs.map((tab) => (
              <TabsTrigger
                className="group relative flex flex-initial items-center rounded-md p-1 text-xs hover:bg-background/90 data-[state=active]:border data-[state=active]:bg-background/90 data-[state=active]:shadow-none"
                key={tab.id}
                value={tab.id}
              >
                {tab.label}
                <Button
                  asChild
                  className="size-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100 group-data-[state=active]:opacity-100"
                  size="icon"
                  variant="ghost"
                >
                  <span
                    onPointerDown={() => {
                      closeTab(tab.id);
                    }}
                  >
                    <X className="size-3" />
                  </span>
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent className="" key={tab.id} value={tab.id}>
              <div className="h-full p-6">
                <h3 className="mb-2 font-semibold text-lg">{tab.label}</h3>
                <p className="">{tab.content}</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <PortfolioWelcome />
      )}
    </div>
  );
}
