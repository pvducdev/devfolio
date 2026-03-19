import { useTabActions } from "@/hooks/use-tab-actions";
import { isMac } from "@/lib/browser";
import { useIsFirstTab, useIsLastTab, useTabCount } from "@/store/tabs";

export function useTabContextMenu(tabId: string) {
  const tabCount = useTabCount();
  const isFirst = useIsFirstTab(tabId);
  const isLast = useIsLastTab(tabId);
  const { close, closeOthers, closeAll, closeToRight, closeToLeft } =
    useTabActions();

  const handleCopyPath = () => {
    navigator.clipboard.writeText(tabId);
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
      close: isMac() ? "⌥W" : "Alt+W",
      closeAll: isMac() ? "⌥⇧W" : "Alt+Shift+W",
    },
    visibility: {
      closeOthers: tabCount > 1,
      closeToLeft: !isFirst,
      closeToRight: !isLast,
    },
  };
}
