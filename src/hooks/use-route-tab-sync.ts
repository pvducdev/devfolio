import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { isValidTabRoute } from "@/config/routes";
import { useHasHydrated } from "@/store/app-layout";
import { useTabsActions } from "@/store/tabs";

export function useRouteTabSync() {
  const location = useLocation();
  const { openTab } = useTabsActions();
  const isHydrated = useHasHydrated();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const currentPath = location.pathname;
    if (!isValidTabRoute(currentPath)) {
      return;
    }

    openTab(currentPath);
  }, [location.pathname, openTab, isHydrated]);
}
