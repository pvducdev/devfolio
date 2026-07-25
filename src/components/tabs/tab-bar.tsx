import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useRef } from "react";

import { TabContextMenu } from "@/components/tabs/tab-context-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ReactLight } from "@/components/ui/svgs/reactLight.tsx";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWheelToHorizontal } from "@/hooks/use-scroll";
import { useTabActions } from "@/hooks/use-tab-actions";
import { useOpenTabs } from "@/store/tabs";

export default function TabBar() {
  const tabs = useOpenTabs();
  const { close } = useTabActions();
  const listRef = useRef<HTMLDivElement>(null);

  useWheelToHorizontal(listRef);

  return (
    <ScrollArea viewportRef={listRef}>
      <TabsList className="h-auto w-full justify-start space-x-0.5 rounded-none border-b bg-transparent p-0.5">
        {tabs.map((tab) => (
          <TabsTrigger
            className="group relative flex flex-initial items-center space-x-0.5 rounded-lg px-1 text-xs shadow-none! hover:bg-accent hover:text-accent-foreground data-active:border-border data-active:bg-accent data-active:text-accent-foreground"
            key={tab.id}
            nativeButton={false}
            render={<TabContextMenu tabId={tab.id} />}
            value={tab.id}
          >
            <Link to={tab.id}>
              <ReactLight className="size-4" />
              <span className="max-w-28 truncate">{tab.label}</span>
              <Button
                className="size-3 rounded-full p-px opacity-0 transition-opacity hover:bg-background group-hover:opacity-100 group-data-active:opacity-100"
                nativeButton={false}
                render={
                  <span
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      close(tab.id);
                    }}
                  />
                }
                size="icon"
                variant="ghost"
              >
                <X className="size-full" />
              </Button>
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
      <ScrollBar className="h-2" orientation="horizontal" />
    </ScrollArea>
  );
}
