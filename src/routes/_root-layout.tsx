import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";
import AppContent from "@/components/layout/app-content.tsx";
import AppSkeleton from "@/components/layout/app-skeleton.tsx";
import Header from "@/components/layout/header.tsx";
import RootLayout from "@/components/layout/root-layout.tsx";
import StatusFooter from "@/components/layout/status-footer.tsx";
import ThemeScript from "@/components/theme/theme-script.tsx";
import { useAppLayoutStore } from "@/store/app-layout.ts";

export const Route = createFileRoute("/_root-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const hasHydrated = useAppLayoutStore(
    useShallow((state) => state._hasHydrated)
  );

  return (
    <RootLayout>
      {hasHydrated ? (
        <>
          <Header />
          <AppContent />
          <StatusFooter />
          <ThemeScript />
        </>
      ) : (
        <AppSkeleton />
      )}
    </RootLayout>
  );
}
