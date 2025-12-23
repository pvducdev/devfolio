import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useHasHydrated } from "@/store/app-layout";
import { useActiveTabId } from "@/store/tabs";

export const Route = createFileRoute("/_root-layout/home")({
  component: HomeRedirect,
});

function HomeRedirect() {
  const navigate = useNavigate();
  const activeTabId = useActiveTabId();
  const hasHydrated = useHasHydrated();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (activeTabId) {
      navigate({ to: activeTabId, replace: true });
    }
  }, [activeTabId, hasHydrated, navigate]);

  return null;
}
