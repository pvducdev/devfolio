import { useNavigate } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { ROUTES } from "@/config/routes";
import { useActiveTabId, useTabsActions } from "@/store/tabs";

export function useTabShortcuts() {
  const navigate = useNavigate();
  const activeTabId = useActiveTabId();
  const { closeTab, closeAllTabs } = useTabsActions();

  useHotkeys(
    "alt+w",
    () => {
      if (!activeTabId) {
        return;
      }
      const nextActiveId = closeTab(activeTabId);
      navigate({ to: nextActiveId ?? ROUTES.HOME });
    },
    { preventDefault: true }
  );

  useHotkeys(
    "alt+shift+w",
    () => {
      closeAllTabs();
      navigate({ to: ROUTES.HOME });
    },
    { preventDefault: true }
  );
}
