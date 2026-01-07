import { createFileRoute } from "@tanstack/react-router";

import AppContent from "@/components/layout/app-content.tsx";
import AppSkeleton from "@/components/layout/app-skeleton.tsx";
import Header from "@/components/layout/header.tsx";
import { HydrationGate } from "@/components/layout/hydration-gate.tsx";
import RootLayout from "@/components/layout/root-layout.tsx";
import StatusFooter from "@/components/layout/status-footer.tsx";
import ThemeScript from "@/components/theme/theme-script.tsx";
import { SITE_CONFIG } from "@/config/site";
import getRepoStars from "@/fn/get-repo-stars";
import { useRouteTabSync } from "@/hooks/use-route-tab-sync";
import { isMobile, isSupportedBrowser } from "@/lib/browser";
import {
  msg_error_mobile_only,
  msg_error_unsupported_browser,
} from "@/paraglide/messages";

export const Route = createFileRoute("/_root-layout")({
  beforeLoad: () => {
    if (!isSupportedBrowser()) {
      throw new Error(msg_error_unsupported_browser());
    }

    if (isMobile()) {
      throw new Error(msg_error_mobile_only());
    }
  },
  loader: () => ({
    repoStarsPromise: SITE_CONFIG.features.showRepoStars
      ? getRepoStars()
      : Promise.resolve(null),
  }),
  component: RouteComponent,
});

function RouteComponent() {
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
}
