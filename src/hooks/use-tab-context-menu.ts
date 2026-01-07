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
      closeOthers: () => closeOthers(tabId),
      closeAll,
      closeToRight: () => closeToRight(tabId),
      closeToLeft: () => closeToLeft(tabId),
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
