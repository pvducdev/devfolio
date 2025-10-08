import { X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CodeEditorContainer() {
  const [tabs, setTabs] = React.useState([
    { id: "1", label: "Account", content: "Account settings and preferences" },
    { id: "2", label: "Password", content: "Change your password here" },
    {
      id: "3",
      label: "Notifications",
      content: "Manage notification settings",
    },
  ]);
  const [activeTab, setActiveTab] = React.useState("1");

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
    <div className="w-full overflow-auto min-h-dvh">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full gap-0"
      >
        <TabsList className="flex-1 w-full bg-transparent border-b rounded-none justify-start space-x-0.5">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative flex-initial hover:bg-neutral-100 rounded-md group flex items-center data-[state=active]:shadow-none data-[state=active]:bg-neutral-50 text-xs p-1 data-[state=active]:border data-[state=active]:border-neutral-200"
            >
              {tab.label}
              <Button
                className="opacity-0 size-4 group-data-[state=active]:opacity-100 group-hover:opacity-100 hover:bg-gray-100 rounded-full transition-opacity"
                size="icon"
                variant="ghost"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  closeTab(tab.id);
                }}
              >
                <X className="size-3" />
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="">
            <div className="p-6 h-full">
              <h3 className="text-lg font-semibold mb-2">{tab.label}</h3>
              <p className="text-gray-600 dark:text-gray-400">{tab.content}</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
