import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/config/routes";
import { isMac } from "@/lib/utils";
import {
  useActiveTabId,
  useIsFirstTab,
  useIsLastTab,
  useTabCount,
  useTabsActions,
} from "@/store/tabs";

export function useTabContextMenu(tabId: string) {
  const navigate = useNavigate();
  const activeTabId = useActiveTabId();
  const tabCount = useTabCount();
  const isFirst = useIsFirstTab(tabId);
  const isLast = useIsLastTab(tabId);

  const {
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    closeTabsToRight,
    closeTabsToLeft,
  } = useTabsActions();

  const handleClose = () => {
    const nextActiveId = closeTab(tabId);
    if (nextActiveId !== activeTabId) {
      navigate({ to: nextActiveId ?? ROUTES.HOME });
    }
  };

  const handleCloseOthers = () => {
    const nextActiveId = closeOtherTabs(tabId);
    if (nextActiveId !== activeTabId) {
      navigate({ to: nextActiveId });
    }
  };

  const handleCloseAll = () => {
    closeAllTabs();
    navigate({ to: ROUTES.HOME });
  };

  const handleCloseToRight = () => {
    const nextActiveId = closeTabsToRight(tabId);
    if (nextActiveId !== activeTabId) {
      navigate({ to: nextActiveId });
    }
  };

  const handleCloseToLeft = () => {
    const nextActiveId = closeTabsToLeft(tabId);
    if (nextActiveId !== activeTabId) {
      navigate({ to: nextActiveId });
    }
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(tabId);
  };

  return {
    actions: {
      close: handleClose,
      closeOthers: handleCloseOthers,
      closeAll: handleCloseAll,
      closeToRight: handleCloseToRight,
      closeToLeft: handleCloseToLeft,
      copyPath: handleCopyPath,
    },
    visibility: {
      closeOthers: tabCount > 1,
      closeToRight: !isLast,
      closeToLeft: !isFirst,
    },
    shortcuts: {
      close: isMac() ? "⌥W" : "Alt+W",
      closeAll: isMac() ? "⌥⇧W" : "Alt+Shift+W",
    },
  };
}
