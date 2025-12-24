import { createFileRoute } from "@tanstack/react-router";
import AppContent from "@/components/layout/app-content.tsx";
import AppSkeleton from "@/components/layout/app-skeleton.tsx";
import Header from "@/components/layout/header.tsx";
import { HydrationGate } from "@/components/layout/hydration-gate.tsx";
import RootLayout from "@/components/layout/root-layout.tsx";
import StatusFooter from "@/components/layout/status-footer.tsx";
import ThemeScript from "@/components/theme/theme-script.tsx";
import { useRouteTabSync } from "@/hooks/use-route-tab-sync";
import type { CommandAction, NavigateAction } from "@/lib/search";
import {
  createCommandsSource,
  createContentSource,
  createPagesSource,
  createSearchClient,
} from "@/lib/search";
import { SearchProvider } from "@/lib/search/react";

const searchClient = createSearchClient({
  sources: [createPagesSource(), createCommandsSource(), createContentSource()],
});

searchClient.registerAction<NavigateAction>({
  type: "navigate",
  execute: (action, context) => {
    context.navigate(action.path);
  },
});

searchClient.registerAction<CommandAction>({
  type: "command",
  execute: (action) => {
    console.log("Command selected:", action.commandName);
  },
});

export const Route = createFileRoute("/_root-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  useRouteTabSync();

  return (
    <SearchProvider client={searchClient}>
      <RootLayout>
        <ThemeScript />
        <HydrationGate fallback={<AppSkeleton />}>
          <Header />
          <AppContent />
          <StatusFooter />
        </HydrationGate>
      </RootLayout>
    </SearchProvider>
  );
}
