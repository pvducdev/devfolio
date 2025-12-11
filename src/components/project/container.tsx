"use client";

import { Iphone } from "@/components/ui/iphone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProjectById } from "@/config/projects";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import { CodeBlock } from "./code-block";

export type ContainerProps = {
  projectId?: string;
  packageJson?: Record<string, unknown>;
  codeFilename?: string;
  screenshotSrc?: string;
  videoSrc?: string;
  className?: string;
};

export function Container({
  projectId,
  packageJson: propPackageJson,
  codeFilename,
  screenshotSrc: propScreenshot,
  videoSrc: propVideo,
  className,
}: ContainerProps) {
  const config = projectId ? getProjectById(projectId) : undefined;

  const screenshotSrc = propScreenshot ?? config?.screenshotSrc ?? "";
  const videoSrc = propVideo ?? config?.videoSrc;
  const packageJson = propPackageJson ?? config?.packageJson ?? {};
  const filename = codeFilename ?? config?.codeFilename ?? "package.json";

  return (
    <div
      className={cn(
        "m-auto flex max-w-3xl items-center justify-center rounded-2xl bg-muted/20 p-20",
        className
      )}
    >
      <div className="grid grid-cols-[auto_240px] items-center">
        <div className="relative z-10">
          <Card filename={filename}>
            <Tabs
              className="flex min-h-48 flex-row"
              defaultValue="package"
              orientation="vertical"
            >
              <TabsList className="h-auto flex-col justify-start rounded-none border-border border-r bg-transparent p-1">
                <TabsTrigger
                  className="h-auto w-full flex-none justify-start rounded-sm px-3 py-1.5 text-xs data-[state=active]:bg-muted"
                  value="package"
                >
                  Dependencies
                </TabsTrigger>
              </TabsList>

              <TabsContent className="mt-0 flex-1" value="package">
                <CodeBlock json={packageJson} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="-ml-10 relative z-20 w-full max-w-60">
          <Iphone
            className="drop-shadow-2xl"
            src={screenshotSrc}
            videoSrc={videoSrc}
          />
        </div>
      </div>
    </div>
  );
}
