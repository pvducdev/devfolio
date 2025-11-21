import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/layout/container.tsx";
import { cn } from "@/lib/utils.ts";
import { useAppLayoutStore } from "@/store/app-layout.ts";

export const Route = createFileRoute("/_root-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const isStretchLayout = useAppLayoutStore((state) => state.isStretchLayout);

  return (
    <div
      className={cn(
        "h-screen w-screen overflow-hidden bg-accent-foreground transition-all duration-300",
        !isStretchLayout && "p-1"
      )}
    >
      <Container />
    </div>
  );
}
