import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";
import Container from "@/components/layout/container.tsx";
import LayoutSkeleton from "@/components/layout/layout-skeleton.tsx";
import { cn } from "@/lib/utils.ts";
import { useAppLayoutStore } from "@/store/app-layout.ts";

export const Route = createFileRoute("/_root-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isStretchLayout, hasHydrated] = useAppLayoutStore(
    useShallow((state) => [state.isStretchLayout, state._hasHydrated])
  );

  return (
    <div
      className={cn(
        "h-screen w-screen overflow-hidden bg-accent-foreground transition-all duration-300",
        !isStretchLayout && "p-1"
      )}
    >
      {hasHydrated ? <Container /> : <LayoutSkeleton />}
    </div>
  );
}
