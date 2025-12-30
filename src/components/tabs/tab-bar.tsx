import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useRef } from "react";
import { TabContextMenu } from "@/components/tabs/tab-context-menu";
import { Button } from "@/components/ui/button";
import { ReactLight } from "@/components/ui/svgs/reactLight.tsx";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCloseTab } from "@/hooks/use-close-tab";
import { useWheelToHorizontal } from "@/hooks/use-scroll";
import { useActiveTabId, useOpenTabs } from "@/store/tabs";

export default function TabBar() {
  const tabs = useOpenTabs();
  const activeTabId = useActiveTabId();
  const closeTab = useCloseTab();
  const listRef = useRef<HTMLDivElement>(null);

  useWheelToHorizontal(listRef);

  return (
    <TabsList
      className="scrollbar-thin h-auto w-full justify-start space-x-0.5 overflow-x-auto rounded-none border-b bg-transparent p-0.5"
      ref={listRef}
    >
      {tabs.map((tab) => (
        <TabsTrigger
          asChild
          className="group relative flex flex-initial items-center space-x-0.5 rounded-lg px-1 text-xs shadow-none! hover:bg-accent hover:text-accent-foreground data-[state=active]:border-border data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          key={tab.id}
          value={tab.id}
        >
          <TabContextMenu tabId={tab.id}>
            <Link to={tab.id}>
              <ReactLight className="size-4" />
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
                    e.preventDefault();
                    closeTab(tab.id, activeTabId);
                  }}
                >
                  <X className="size-full" />
                </span>
              </Button>
            </Link>
          </TabContextMenu>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
