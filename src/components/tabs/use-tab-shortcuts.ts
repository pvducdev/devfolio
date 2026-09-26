import { useHotkeys } from "react-hotkeys-hook";

import { useActiveTabId } from "@/components/tabs/store";
import { useTabActions } from "@/components/tabs/use-tab-actions";
import { getHotkeyCombo } from "@/lib/hotkeys";

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
