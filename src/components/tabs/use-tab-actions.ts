import { useNavigate } from "@tanstack/react-router";

import { useActiveTabId, useTabsActions } from "@/components/tabs/store";
import { ROUTES } from "@/config/routes";

export const useTabActions = () => {
  const navigate = useNavigate();
  const activeTabId = useActiveTabId();
  const {
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    closeTabsToRight,
    closeTabsToLeft,
  } = useTabsActions();

  const navigateIfChanged = (nextActiveId: string | null) => {
    if (nextActiveId !== activeTabId) {
      navigate({ to: nextActiveId ?? ROUTES.HOME });
    }
  };

  const close = (tabId: string) => navigateIfChanged(closeTab(tabId));

  const closeOthers = (tabId: string) =>
    navigateIfChanged(closeOtherTabs(tabId));

  const closeAll = () => {
    closeAllTabs();
    navigate({ to: ROUTES.HOME });
  };

  const closeToRight = (tabId: string) =>
    navigateIfChanged(closeTabsToRight(tabId));

  const closeToLeft = (tabId: string) =>
    navigateIfChanged(closeTabsToLeft(tabId));

  return {
    close,
    closeAll,
    closeOthers,
    closeToLeft,
    closeToRight,
  };
};
