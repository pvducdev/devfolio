import AppContent from "@/components/layout/app-content.tsx";
import { cn } from "@/lib/utils.ts";
import { useAppLayoutStore } from "@/store/app-layout.ts";
import Header from "./header.tsx";
import StatusFooter from "./status-footer.tsx";

export default function Container() {
  const isStretchLayout = useAppLayoutStore((state) => state.isStretchLayout);

  return (
    <div
      className={cn(
        "grid size-full grid-rows-[auto_1fr_auto] overflow-hidden bg-sidebar transition-all duration-300",
        !isStretchLayout && "rounded-2xl"
      )}
    >
      <Header />
      <AppContent />
      <StatusFooter />
    </div>
  );
}
