import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { isValidTabRoute, ROUTES } from "@/config/routes";
import { useHasHydrated } from "@/store/app-layout";
import { useActiveTabId, useTabCount, useTabsActions } from "@/store/tabs";

type SyncSource = "route" | "tab" | null;

export function useRouteTabSync() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTabId = useActiveTabId();
  const { openTab } = useTabsActions();
  const tabCount = useTabCount();
  const isHydrated = useHasHydrated();
  const lastSyncSource = useRef<SyncSource>(null);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (lastSyncSource.current === "tab") {
      lastSyncSource.current = null;
      return;
    }

    const currentPath = location.pathname;
    if (!isValidTabRoute(currentPath)) {
      return;
    }

    lastSyncSource.current = "route";
    openTab(currentPath);
  }, [location.pathname, openTab, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (lastSyncSource.current === "route") {
      lastSyncSource.current = null;
      return;
    }

    if (!activeTabId) {
      if (tabCount === 0 && location.pathname !== ROUTES.HOME) {
        lastSyncSource.current = "tab";
        navigate({ to: ROUTES.HOME });
      }
      return;
    }

    if (location.pathname !== activeTabId) {
      lastSyncSource.current = "tab";
      navigate({ to: activeTabId });
    }
  }, [activeTabId, tabCount, navigate, location.pathname, isHydrated]);
}
