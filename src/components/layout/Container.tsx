import type * as React from "react";
import AiContainer from "@/components/ai/container.tsx";
import ActivitiesBar from "@/components/layout/ActivitiesBar.tsx";
import Header from "@/components/layout/Header.tsx";
import StatusFooter from "@/components/layout/StatusFooter.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";

export default function Container({ children }: React.PropsWithChildren) {
  return (
    <div className="rounded-2xl size-full bg-white overflow-hidden grid grid-rows-[auto_1fr_auto]">
      <Header />
      <div className="h-full flex overflow-hidden">
        <ActivitiesBar />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25}>One</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>{children}</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25}>
            <AiContainer />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <StatusFooter />
    </div>
  );
}
