import { useHotkeys } from "react-hotkeys-hook";
import { useTabActions } from "@/hooks/use-tab-actions";
import { useActiveTabId } from "@/store/tabs";

export function useTabShortcuts() {
  const activeTabId = useActiveTabId();
  const { close, closeAll } = useTabActions();

  useHotkeys(
    "alt+w",
    () => {
      if (activeTabId) {
        close(activeTabId);
      }
    },
    { preventDefault: true }
  );

  useHotkeys("alt+shift+w", closeAll, { preventDefault: true });
}
