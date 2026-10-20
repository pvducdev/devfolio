import { cn } from "cn";

import { Iphone } from "@/components/ui/iphone";
import { Safari } from "@/components/ui/safari";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectConfig } from "@/config/projects";
import {
  ui_project_loading,
  ui_project_tab_dependencies,
  ui_project_tab_guide,
} from "@/paraglide/messages.js";

import { CodeBlock } from "./code-block";
import Terminal from "./terminal";
import TerminalItem from "./terminal-item";
import { useAutoStep } from "./use-auto-step";
import WindowFrame from "./window-frame";

const DEVICE_CLASS_NAME = "relative z-10 shrink-0 object-fill drop-shadow-xl";

type ProjectTab = "getting-started" | "dependencies";

interface ContainerProps {
  project: ProjectConfig;
}

export const Container = ({ project: config }: ContainerProps) => {
  const { guides } = config;
  const dependenciesStep = guides.length + 1;

  const { currentStep, restart, stopAt } = useAutoStep({
    delay: 3000,
    maxStep: dependenciesStep,
  });

  const activeTab: ProjectTab =
    currentStep === dependenciesStep ? "dependencies" : "getting-started";

  const visitedGuides = guides.slice(0, currentStep);
  const latestGuide = visitedGuides.at(-1);
  const media = {
    imageSrc: latestGuide?.type === "screenshot" ? latestGuide.src : undefined,
    videoSrc: latestGuide?.type === "video" ? latestGuide.src : undefined,
  };

  const handleTabChange = (value: ProjectTab) => {
    if (value === "getting-started") {
      restart();
    } else {
      stopAt(dependenciesStep);
    }
  };

  return (
    <div className="m-10 flex size-full items-center justify-center">
      <div
        className={cn(
          "relative flex items-center gap-4 rounded-lg bg-muted/20 p-4",
          config.type !== "mobile" && "flex-col"
        )}
      >
        <WindowFrame
          className={config.type === "mobile" ? "w-lg" : "w-xl"}
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
                className="wrap-break-word h-auto w-full flex-none justify-start whitespace-normal text-wrap rounded px-2.5 py-1.5 text-left font-medium text-xs transition-colors data-active:bg-muted"
                value="getting-started"
              >
                {ui_project_tab_guide()}
              </TabsTrigger>
              <TabsTrigger
                className="wrap-break-word h-auto w-full flex-none justify-start whitespace-normal text-wrap rounded px-2.5 py-1.5 text-left font-medium text-xs transition-colors data-active:bg-muted"
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
        </WindowFrame>

        {config.type === "mobile" ? (
          <Iphone
            className={cn(DEVICE_CLASS_NAME, "-ml-5 aspect-9/16 w-56")}
            {...media}
          />
        ) : (
          <Safari
            className={cn(DEVICE_CLASS_NAME, "-mt-5 aspect-video w-120")}
            url={config.url}
            {...media}
          />
        )}
      </div>
    </div>
  );
};
