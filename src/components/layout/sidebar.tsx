import { Suspense } from "react";
import { useShallow } from "zustand/react/shallow";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable.tsx";
import { activities } from "@/config/routes.tsx";
import { useSidebarStore } from "@/store/sidebar.ts";

export default function Sidebar() {
  const { size, activeView, onChangeSize } = useSidebarStore(
    useShallow((state) => ({
      activeView: state.activeView,
      size: state.size,
      onChangeSize: state.onChangeSize,
    }))
  );

  const Component = activities.find((a) => a.key === activeView)?.sidebar;

  if (!Component) {
    return null;
  }

  return (
    <>
      <ResizablePanel
        className="overflow-auto! rounded-xl bg-background"
        defaultSize={size}
        id="sidebar"
        onResize={(e) => {
          onChangeSize(e);
        }}
        order={1}
      >
        <Suspense fallback={<p className="mx-auto">Loading...</p>}>
          <Component />
        </Suspense>
      </ResizablePanel>
      <ResizableHandle className="w-1.5 bg-transparent" />
    </>
  );
}
