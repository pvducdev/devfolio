import { useShallow } from "zustand/react/shallow";
import CodeEditorContainer from "@/components/code-editor/container.tsx";
import ActivitiesBar from "@/components/layout/activities-bar.tsx";
import Panel from "@/components/layout/panel.tsx";
import Sidebar from "@/components/layout/sidebar.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { useAppLayoutStore } from "@/store/app-layout.ts";

export default function AppContent() {
  const {
    sidebar,
    panel,
    sidebarSize,
    setSidebarSize,
    panelSize,
    setPanelSize,
  } = useAppLayoutStore(useShallow((state) => state));

  return (
    <div className="flex h-full overflow-hidden">
      <ActivitiesBar />
      <ResizablePanelGroup autoSaveId="conditional" direction="horizontal">
        {!!sidebar && (
          <>
            <ResizablePanel
              className="overflow-auto! rounded-xl bg-background"
              defaultSize={sidebarSize}
              id="sidebar"
              onResize={(e) => {
                setSidebarSize(e);
              }}
              order={1}
            >
              <Sidebar activeView={sidebar} />
            </ResizablePanel>
            <ResizableHandle className="w-1.5 bg-transparent" />
          </>
        )}
        <ResizablePanel
          className="rounded-xl bg-background"
          defaultSize={50}
          id="code-editor"
          order={2}
        >
          <CodeEditorContainer />
        </ResizablePanel>
        {!!panel && (
          <>
            <ResizableHandle className="w-1.5 bg-transparent" />
            <ResizablePanel
              className="rounded-xl bg-background"
              defaultSize={panelSize}
              id="panel"
              onResize={(e) => {
                setPanelSize(e);
              }}
              order={3}
            >
              <Panel />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
