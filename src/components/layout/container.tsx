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
    <div className="grid size-full grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl bg-sidebar">
      <Header />
      <div className="flex h-full overflow-hidden">
        <ActivitiesBar />
        <ResizablePanelGroup autoSaveId="conditional" direction="horizontal">
          <Sidebar />
          <ResizablePanel
            className="rounded-xl bg-background"
            defaultSize={50}
            id="code-editor"
            order={2}
          >
            <CodeEditorContainer />
          </ResizablePanel>
          <ResizableHandle className="w-1.5 bg-transparent" />
          <ResizablePanel
            className="rounded-xl bg-background"
            defaultSize={25}
            id="panel"
            order={3}
          >
            <AiContainer />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <StatusFooter />
    </div>
  );
}
