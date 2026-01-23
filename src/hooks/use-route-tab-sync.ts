import { useHydrated, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { isValidTabRoute } from "@/config/routes";
import { useTabsActions } from "@/store/tabs";

export function useRouteTabSync() {
  const location = useLocation();
  const { openTab } = useTabsActions();
  const isHydrated = useHydrated();

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
