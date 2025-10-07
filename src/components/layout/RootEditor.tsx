import type * as React from "react";
import AiContainer from "@/components/ai/container.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";

export default function RootEditor({ children }: React.PropsWithChildren) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25}>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>{children}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25}>
        <AiContainer />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
