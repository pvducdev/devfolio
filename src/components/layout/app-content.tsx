import CodeEditorContainer from "@/components/code-editor/container.tsx";
import ActivitiesBar from "@/components/layout/activities-bar.tsx";
import Panel from "@/components/layout/panel.tsx";
import Sidebar from "@/components/layout/sidebar.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { LAYOUT_CONFIG } from "@/config/ui";
import {
  useAppLayoutActions,
  usePanelSection,
  usePanelSize,
  useSidebarSection,
  useSidebarSize,
} from "@/store/app-layout.ts";

export default function AppContent() {
  const sidebar = useSidebarSection();
  const panel = usePanelSection();
  const sidebarSize = useSidebarSize();
  const panelSize = usePanelSize();
  const { setSidebarSize, toggleSidebar, togglePanel, setPanelSize } =
    useAppLayoutActions();

  return (
    <div className="flex h-full overflow-hidden">
      <ActivitiesBar
        active={sidebar}
        onClick={(key) => {
          toggleSidebar(key);
        }}
      />
      <ResizablePanelGroup autoSaveId="conditional" direction="horizontal">
        {!!sidebar && (
          <>
            <ResizablePanel
              className="overflow-auto! rounded-xl bg-background"
              defaultSize={sidebarSize}
              id="sidebar"
              maxSize={LAYOUT_CONFIG.sidebar.maxSize}
              minSize={LAYOUT_CONFIG.sidebar.minSize}
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
          defaultSize={LAYOUT_CONFIG.editor.defaultSize}
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
              maxSize={LAYOUT_CONFIG.panel.maxSize}
              minSize={LAYOUT_CONFIG.panel.minSize}
              onResize={(e) => {
                setPanelSize(e);
              }}
              order={3}
            >
              <Panel
                onClose={() => {
                  if (panel) {
                    togglePanel(panel);
                  }
                }}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
