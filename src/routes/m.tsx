import { createFileRoute, redirect } from "@tanstack/react-router";

import { HydrationGate } from "@/components/layout/hydration-gate";
import MobileSkeleton from "@/components/layout/mobile/mobile-skeleton";
import Shell from "@/components/layout/mobile/shell";
import ThemeAttributeSync from "@/components/theme/theme-attribute-sync";
import { isMobile, isServer } from "@/lib/browser";
import { mobileToDesktopPath } from "@/lib/routes";

const MobileLayout = () => (
  <div className="h-dvh w-screen overflow-hidden bg-accent-foreground">
    <div className="h-full bg-sidebar">
      <ThemeAttributeSync />
      <HydrationGate fallback={<MobileSkeleton />}>
        <Shell />
      </HydrationGate>
    </div>
  </div>
);

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
