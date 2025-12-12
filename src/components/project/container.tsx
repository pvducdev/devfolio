import { useState } from "react";
import { Iphone } from "@/components/ui/iphone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectConfig } from "@/config/projects";
import { getProjectById } from "@/config/projects";
import { useSequence } from "@/hooks/use-sequence";
import {
  ui_project_loading,
  ui_project_tab_dependencies,
  ui_project_tab_guide,
} from "@/paraglide/messages.js";
import { Card } from "./card";
import { CodeBlock } from "./code-block";
import { Terminal } from "./terminal";
import { TerminalItem } from "./terminal-item";

type Guide = ProjectConfig["guides"][number];

export type ContainerProps = {
  projectId: string;
};

export function Container({ projectId }: ContainerProps) {
  const config = getProjectById(projectId);
  const [activeTab, setActiveTab] = useState("getting-started");

  const guides = config?.guides ?? [];
  const steps = guides.map((_, i) => ({ id: `guide-${i}` }));

  const { pendingIndex, isFirst, start } = useSequence({
    steps,
    autoStart: true,
    autoSequence: true,
    delay: 3000,
    onComplete: () => {
      setTimeout(() => setActiveTab("dependencies"), 3000);
    },
  });

  const activeGuide = guides[pendingIndex - 1] as Guide | undefined;
  const visitedGuides = guides.slice(0, pendingIndex);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
                  {ui_project_tab_guide()}
                </TabsTrigger>
                <TabsTrigger
                  className="h-auto w-full flex-none justify-start rounded-sm px-3 py-1.5 text-xs data-[state=active]:bg-muted"
                  value="dependencies"
                >
                  {ui_project_tab_dependencies()}
                </TabsTrigger>
              </TabsList>

              <TabsContent className="flex-1" value="getting-started">
                <Terminal>
                  {isFirst ? (
                    <TerminalItem key="initial" variant="info">
                      {ui_project_loading()}
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
              <TabsContent className="flex-1" value="dependencies">
                <CodeBlock json={config?.package ?? {}} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="-ml-5 relative z-20 w-full max-w-60">
          <Iphone
            src={activeGuide?.type === "screenshot" ? activeGuide.src : ""}
            videoSrc={activeGuide?.type === "video" ? activeGuide.src : ""}
          />
        </div>
      </div>
    </div>
  );
}
