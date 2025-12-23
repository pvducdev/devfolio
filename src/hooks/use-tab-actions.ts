import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/config/routes";
import { useActiveTabId, useTabsActions } from "@/store/tabs";

export function useTabActions() {
  const navigate = useNavigate();
  const activeTabId = useActiveTabId();
  const {
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    closeTabsToRight,
    closeTabsToLeft,
  } = useTabsActions();

  const close = (tabId: string) => {
    const nextActiveId = closeTab(tabId);
    if (nextActiveId !== activeTabId) {
      navigate({ to: nextActiveId ?? ROUTES.HOME });
    }
  };

  const closeOthers = (tabId: string) => {
    const nextActiveId = closeOtherTabs(tabId);
    if (nextActiveId !== activeTabId) {
      navigate({ to: nextActiveId });
    }
  };

  const closeAll = () => {
    closeAllTabs();
    navigate({ to: ROUTES.HOME });
  };

  const closeToRight = (tabId: string) => {
    const nextActiveId = closeTabsToRight(tabId);
    if (nextActiveId !== activeTabId) {
      navigate({ to: nextActiveId });
    }
  };

  const closeToLeft = (tabId: string) => {
    const nextActiveId = closeTabsToLeft(tabId);
    if (nextActiveId !== activeTabId) {
      navigate({ to: nextActiveId });
    }
  };

  return {
    close,
    closeOthers,
    closeAll,
    closeToRight,
    closeToLeft,
  };
}
