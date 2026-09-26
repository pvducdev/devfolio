import { createFileRoute, redirect } from "@tanstack/react-router";

import AppContent from "@/components/layout/app-content";
import AppSkeleton from "@/components/layout/app-skeleton";
import Header from "@/components/layout/header";
import { HydrationGate } from "@/components/layout/hydration-gate";
import RootLayout from "@/components/layout/root-layout";
import StatusFooter from "@/components/layout/status-footer";
import { useRouteTabSync } from "@/components/tabs/use-route-tab-sync";
import ThemeAttributeSync from "@/components/theme/theme-attribute-sync";
import { isMobile, isServer, isSupportedBrowser } from "@/lib/browser";
import { desktopToMobilePath } from "@/lib/routes";
import { msg_error_unsupported_browser } from "@/paraglide/messages";

const RouteComponent = () => {
  useRouteTabSync();

  return (
    <RootLayout>
      <ThemeAttributeSync />
      <HydrationGate fallback={<AppSkeleton />}>
        <Header />
        <AppContent />
        <StatusFooter />
      </HydrationGate>
    </RootLayout>
  );
};

export const Route = createFileRoute("/_root-layout")({
  beforeLoad: ({ location }) => {
    if (isServer()) {
      return;
    }

    if (!isSupportedBrowser()) {
      throw new Error(msg_error_unsupported_browser());
    }

    if (isMobile()) {
      throw redirect({ to: desktopToMobilePath(location.pathname) });
    }
  },
  component: RouteComponent,
});
