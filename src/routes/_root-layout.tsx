import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";
import Container from "@/components/layout/container.tsx";
import { useMount } from "@/hooks/use-mount.ts";
import applyTheme from "@/lib/applyTheme.ts";
import { useThemeStore } from "@/store/theme.ts";

export const Route = createFileRoute("/_root-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const theme = useThemeStore(useShallow((state) => state.theme));

  useMount(() => {
    if (theme) {
      applyTheme(theme);
    }
  });

  return (
    <div className="h-screen w-screen overflow-hidden bg-accent-foreground p-1">
      <Container />
    </div>
  );
}
