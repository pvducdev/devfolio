"use client";

import { useState } from "react";
import { Iphone } from "@/components/ui/iphone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjectById } from "@/config/projects";
import { useGuideSequence } from "@/hooks/use-guide-sequence";
import { Card } from "./card";
import { CodeBlock } from "./code-block";
import { Terminal } from "./terminal";
import { TerminalItem } from "./terminal-item";

export type ContainerProps = {
  projectId: string;
};

export function Container({ projectId }: ContainerProps) {
  const config = getProjectById(projectId);
  const [activeTab, setActiveTab] = useState("getting-started");

  const { currentGuide, visitedGuides, isLoading, reset, start } =
    useGuideSequence({
      guides: config?.guides ?? [],
      autoStart: true,
      autoSequence: true,
      delay: 3000,
      onComplete: () => setActiveTab("package"),
    });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    reset();
    if (value === "getting-started") {
      start();
    }
  };

  return (
    <div className="flex size-full items-center justify-center">
      <div className="grid grid-cols-[auto_240px] items-center">
        <div className="relative z-10">
          <Card title={config?.name ?? ""}>
            <Tabs
              className="flex min-h-48 min-w-100 flex-row"
              onValueChange={handleTabChange}
              orientation="vertical"
              value={activeTab}
            >
              <TabsList className="h-auto flex-col justify-start rounded-none border-border border-r bg-transparent p-1">
                <TabsTrigger
                  className="h-auto w-full flex-none justify-start rounded-sm px-3 py-1.5 text-xs data-[state=active]:bg-muted"
                  value="getting-started"
                >
                  Getting Started
                </TabsTrigger>
                <TabsTrigger
                  className="h-auto w-full flex-none justify-start rounded-sm px-3 py-1.5 text-xs data-[state=active]:bg-muted"
                  value="package"
                >
                  Dependencies
                </TabsTrigger>
              </TabsList>

              <TabsContent className="flex-1" value="getting-started">
                <Terminal>
                  {isLoading ? (
                    <TerminalItem key="loading" variant="info">
                      Loading...
                    </TerminalItem>
                  ) : null}
                  {visitedGuides.map((guide, i) => (
                    <TerminalItem
                      key={guide.title}
                      variant={
                        i === visitedGuides.length - 1 ? "command" : "success"
                      }
                    >
                      {guide.title}
                    </TerminalItem>
                  ))}
                </Terminal>
              </TabsContent>
              <TabsContent className="flex-1" value="package">
                <CodeBlock json={config?.package ?? {}} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="-ml-5 relative z-20 w-full max-w-60">
          <Iphone
            src={currentGuide?.type === "screenshot" ? currentGuide.src : ""}
            videoSrc={currentGuide?.type === "video" ? currentGuide.src : ""}
          />
        </div>
      </div>
    </div>
  );
}
