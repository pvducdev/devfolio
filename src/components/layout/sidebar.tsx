import { useShallow } from "zustand/react/shallow";
import About from "@/components/sidebar/about.tsx";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable.tsx";
import { useSidebarStore } from "@/store/sidebar.ts";

export default function Sidebar() {
  const { size, activeView } = useSidebarStore(
    useShallow((state) => ({ activeView: state.activeView, size: state.size }))
  );

  switch (activeView) {
    case "about":
      return (
        <>
          <ResizablePanel defaultSize={size}>
            <About />
          </ResizablePanel>
          <ResizableHandle />
        </>
      );
    default:
      return null;
  }
}
