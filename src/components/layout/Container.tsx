import AiContainer from "@/components/assistant/container.tsx";
import CodeEditorContainer from "@/components/code-editor/container.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import ActivitiesBar from "./activities-bar.tsx";
import Header from "./header.tsx";
import Sidebar from "./sidebar.tsx";
import StatusFooter from "./status-footer.tsx";

export default function Container() {
  return (
    <div className="grid size-full grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl bg-white">
      <Header />
      <div className="flex h-full overflow-hidden">
        <ActivitiesBar />
        <ResizablePanelGroup direction="horizontal">
          <Sidebar />
          <ResizablePanel>
            <CodeEditorContainer />
          </ResizablePanel>
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
