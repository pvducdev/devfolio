import { createFileRoute } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import Container from "@/components/layout/container.tsx";
import { useThemeStore } from "@/store/theme.ts";

export const Route = createFileRoute("/_root-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const theme = useThemeStore(useShallow((state) => state.theme));

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-accent-foreground p-1">
      <Container />
    </div>
  );
}
