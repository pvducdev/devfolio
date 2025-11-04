import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tab } from "@/types/tabs";

type TabBarProps = {
  tabs: Tab[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
};

export default function TabBar({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
}: TabBarProps) {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <TabsList className="h-auto w-full justify-start rounded-none border-b bg-sidebar p-1">
      {tabs.map((tab) => (
        <TabsTrigger
          className="group relative flex items-center gap-2 pr-7 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          data-state={tab.id === activeTabId ? "active" : "inactive"}
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          value={tab.id}
        >
          <span className="max-w-[150px] truncate">{tab.label}</span>
          <Button
            className="absolute right-1 size-4 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            size="icon"
            variant="ghost"
          >
            <X className="size-3" />
          </Button>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
