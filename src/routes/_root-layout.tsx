import { createFileRoute, redirect } from "@tanstack/react-router";

import AppContent from "@/components/layout/app-content";
import AppSkeleton from "@/components/layout/app-skeleton";
import Header from "@/components/layout/header";
import { HydrationGate } from "@/components/layout/hydration-gate";
import RootLayout from "@/components/layout/root-layout";
import StatusFooter from "@/components/layout/status-footer";
import ThemeScript from "@/components/theme/theme-script";
import { useRouteTabSync } from "@/hooks/use-route-tab-sync";
import { isMobile, isSupportedBrowser } from "@/lib/browser";
import { desktopToMobilePath } from "@/lib/routes";
import { isServer } from "@/lib/utils";
import { msg_error_unsupported_browser } from "@/paraglide/messages";

const RouteComponent = () => {
  useRouteTabSync();

  return (
    <RootLayout>
      <ThemeScript />
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
