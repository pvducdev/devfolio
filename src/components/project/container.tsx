import { useState } from "react";
import DeviceMock from "@/components/common/device-mock.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjectById } from "@/config/projects";
import { useAutoStep } from "@/hooks/use-auto-step";
import { cn } from "@/lib/utils.ts";
import {
  ui_project_loading,
  ui_project_tab_dependencies,
  ui_project_tab_guide,
} from "@/paraglide/messages.js";
import { Card } from "./card";
import { CodeBlock } from "./code-block";
import { Terminal } from "./terminal";
import { TerminalItem } from "./terminal-item";

export interface ContainerProps {
  projectId: string;
}

export function Container({ projectId }: ContainerProps) {
  const config = getProjectById(projectId);
  const [activeTab, setActiveTab] = useState("getting-started");

  const guides = config.guides ?? [];

  const { currentStep, start, reset } = useAutoStep({
    maxStep: guides.length + 1,
    autoAdvance: true,
    delay: 3000,
    loop: true,
    onStepChange: (step) => {
      if (step > guides.length) {
        setActiveTab("dependencies");
      }
    },
    onLoop: () => {
      setActiveTab("getting-started");
    },
  });

  const visitedGuides = guides.slice(0, currentStep);
  const latestVisitedGuides = visitedGuides.at(-1);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "getting-started") {
      start();
    } else {
      reset();
    }
  };

  return (
    <div className="flex size-full items-center justify-center">
      <div
        className={cn(
          "flex items-center rounded-xl bg-muted/20 p-10",
          config.type === "mobile" ? "max-w-5xl" : "max-w-3xl flex-col"
        )}
      >
        <Card title={config.name}>
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
                <TerminalItem key="initial" variant="output">
                  {ui_project_loading()}
                </TerminalItem>
                {visitedGuides.map((guide) => (
                  <TerminalItem key={guide.title} variant="command">
                    {guide.title}
                  </TerminalItem>
                ))}
              </Terminal>
            </TabsContent>
            <TabsContent className="flex-1" value="dependencies">
              <CodeBlock json={config.package} />
            </TabsContent>
          </Tabs>
        </Card>

        <div
          className={cn(
            "relative z-10 drop-shadow-2xl",
            config.type === "mobile"
              ? "-ml-3 aspect-video w-60"
              : "-mt-3 h-96 w-150"
          )}
        >
          <DeviceMock
            className="size-full"
            imageSrc={
              latestVisitedGuides?.type === "screenshot"
                ? latestVisitedGuides.src
                : ""
            }
            type={config.type}
            url={config.url}
            videoSrc={
              latestVisitedGuides?.type === "video"
                ? latestVisitedGuides.src
                : ""
            }
          />
        </div>
      </div>
    </div>
  );
}
