import { useEffect, useState } from "react";
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: projectId is intentional to reset on project change
  useEffect(() => {
    reset();
    setActiveTab("getting-started");
  }, [projectId, reset]);

  return (
    <div className="m-10 flex size-full items-center justify-center">
      <div
        className={cn(
          "relative flex items-center gap-4 rounded-lg bg-muted/20 p-4",
          config.type !== "mobile" && "flex-col"
        )}
      >
        <Card
          className={cn("", config.type === "mobile" ? "w-lg" : "w-xl")}
          title={config.name}
        >
          <Tabs
            className="flex max-h-100 min-h-44 w-full flex-row"
            onValueChange={handleTabChange}
            orientation="vertical"
            value={activeTab}
          >
            <TabsList className="h-auto w-32 flex-col justify-start space-y-0.5 rounded-none border-border border-r bg-transparent p-1">
              <TabsTrigger
                className="wrap-break-word h-auto w-full flex-none justify-start whitespace-normal text-wrap rounded px-2.5 py-1.5 text-left font-medium text-xs transition-colors data-[state=active]:bg-muted"
                value="getting-started"
              >
                {ui_project_tab_guide()}
              </TabsTrigger>
              <TabsTrigger
                className="wrap-break-word h-auto w-full flex-none justify-start whitespace-normal text-wrap rounded px-2.5 py-1.5 text-left font-medium text-xs transition-colors data-[state=active]:bg-muted"
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
            <TabsContent
              className="flex-1 overflow-y-auto"
              value="dependencies"
            >
              <CodeBlock json={config.package} />
            </TabsContent>
          </Tabs>
        </Card>

        <DeviceMock
          className={cn(
            "relative z-10 shrink-0 object-fill drop-shadow-xl",
            config.type === "mobile"
              ? "-ml-5 aspect-9/16 w-56"
              : "-mt-5 aspect-video w-120"
          )}
          imageSrc={
            latestVisitedGuides?.type === "screenshot"
              ? latestVisitedGuides.src
              : ""
          }
          type={config.type}
          url={config.url}
          videoSrc={
            latestVisitedGuides?.type === "video" ? latestVisitedGuides.src : ""
          }
        />
      </div>
    </div>
  );
}
