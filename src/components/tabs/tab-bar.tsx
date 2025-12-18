import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownLight } from "@/components/ui/svgs/markdownLight.tsx";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tab } from "@/store/tabs.ts";

type TabBarProps = {
  tabs: Tab[];
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
};

export default function TabBar({ tabs, onTabClick, onTabClose }: TabBarProps) {
  return (
    <TabsList className="h-auto w-full justify-start space-x-0.5 overflow-x-auto rounded-none border-b bg-transparent p-0.5">
      {tabs.map((tab) => (
        <TabsTrigger
          className="group relative flex flex-initial items-center space-x-0.5 rounded-lg px-1 text-xs shadow-none! hover:bg-accent hover:text-accent-foreground data-[state=active]:border-border data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          key={tab.id}
          onClick={() => {
            onTabClick(tab.id);
          }}
          value={tab.id}
        >
          <MarkdownLight className="size-4" />
          <span className="max-w-28 truncate">{tab.label}</span>
          <Button
            asChild
            className="size-3 rounded-full p-px opacity-0 transition-opacity hover:bg-background group-hover:opacity-100 group-data-[state=active]:opacity-100"
            size="icon"
            variant="ghost"
          >
            <span
              onPointerDown={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
            >
              <X className="size-full" />
            </span>
          </Button>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
