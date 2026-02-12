import { createFileRoute, redirect } from "@tanstack/react-router";
import { HydrationGate } from "@/components/layout/hydration-gate";
import MobileSkeleton from "@/components/mobile/mobile-skeleton";
import Shell from "@/components/mobile/shell";
import ThemeScript from "@/components/theme/theme-script";
import { isMobile } from "@/lib/browser";
import { mobileToDesktopPath } from "@/lib/routes";
import { isServer } from "@/lib/utils";

export const Route = createFileRoute("/m")({
  beforeLoad: ({ location }) => {
    if (isServer()) {
      return;
    }
    if (!isMobile()) {
      throw redirect({ to: mobileToDesktopPath(location.pathname) });
    }
  },
  component: MobileLayout,
});

function MobileLayout() {
  return (
    <div className="h-dvh w-screen overflow-hidden bg-accent-foreground">
      <div className="h-full bg-sidebar">
        <ThemeScript />
        <HydrationGate fallback={<MobileSkeleton />}>
          <Shell />
        </HydrationGate>
      </div>
    </div>
  );
}
