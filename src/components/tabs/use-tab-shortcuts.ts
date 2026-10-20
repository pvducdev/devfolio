import { useHotkeys } from "react-hotkeys-hook";

import { getHotkeyCombo } from "@/components/keyboard-shortcuts/hotkeys";
import { useActiveTabId } from "@/components/tabs/store";
import { useTabActions } from "@/components/tabs/use-tab-actions";

export const useTabShortcuts = () => {
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
};
