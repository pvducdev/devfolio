import { getDisplayKeys } from "@/components/keyboard-shortcuts/hotkeys";
import {
  useIsFirstTab,
  useIsLastTab,
  useTabCount,
} from "@/components/tabs/store";
import { useTabActions } from "@/components/tabs/use-tab-actions";
import { getLogger } from "@/lib/logger";

export const useTabContextMenu = (tabId: string) => {
  const tabCount = useTabCount();
  const isFirst = useIsFirstTab(tabId);
  const isLast = useIsLastTab(tabId);
  const { close, closeOthers, closeAll, closeToRight, closeToLeft } =
    useTabActions();

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(tabId);
    } catch (error) {
      await getLogger().error("Failed to copy tab path", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return {
    actions: {
      close: () => close(tabId),
      closeAll,
      closeOthers: () => closeOthers(tabId),
      closeToLeft: () => closeToLeft(tabId),
      closeToRight: () => closeToRight(tabId),
      copyPath: handleCopyPath,
    },
    shortcuts: {
      close: getDisplayKeys("closeTab").join(""),
      closeAll: getDisplayKeys("closeAllTabs").join(""),
    },
    visibility: {
      closeOthers: tabCount > 1,
      closeToLeft: !isFirst,
      closeToRight: !isLast,
    },
  };
};
