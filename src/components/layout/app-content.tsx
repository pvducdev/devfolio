import { useDebounceCallback } from "usehooks-ts";
import CodeEditorContainer from "@/components/code-editor/container";
import ActivitiesBar from "@/components/layout/activities-bar";
import Panel from "@/components/layout/panel";
import Sidebar from "@/components/layout/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { LAYOUT_CONFIG } from "@/config/ui";
import {
  useAppLayoutActions,
  usePanelSection,
  usePanelSize,
  useSidebarSection,
  useSidebarSize,
} from "@/store/app-layout";

export default function AppContent() {
  const sidebar = useSidebarSection();
  const panel = usePanelSection();
  const sidebarSize = useSidebarSize();
  const panelSize = usePanelSize();
  const { setSidebarSize, toggleSidebar, togglePanel, setPanelSize } =
    useAppLayoutActions();

  const debouncedSetSidebarSize = useDebounceCallback(setSidebarSize, 100);
  const debouncedSetPanelSize = useDebounceCallback(setPanelSize, 100);

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
              onResize={debouncedSetSidebarSize}
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
              onResize={debouncedSetPanelSize}
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
