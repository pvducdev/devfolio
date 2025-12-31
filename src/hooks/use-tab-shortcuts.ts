import { useHotkeys } from "react-hotkeys-hook";
import { useTabActions } from "@/hooks/use-tab-actions";
import { getHotkeyCombo } from "@/lib/hotkeys";
import { useActiveTabId } from "@/store/tabs";

export function useTabShortcuts() {
  const activeTabId = useActiveTabId();
  const { close, closeAll } = useTabActions();

  useHotkeys(
    getHotkeyCombo("closeTab"),
    () => {
      if (activeTabId) {
        close(activeTabId);
      }
    },
    { preventDefault: true }
  );

  useHotkeys(getHotkeyCombo("closeAllTabs"), closeAll, {
    preventDefault: true,
  });
}
