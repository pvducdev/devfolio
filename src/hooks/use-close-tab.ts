import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/config/routes";
import { useTabsActions } from "@/store/tabs";

export function useCloseTab() {
  const navigate = useNavigate();
  const { closeTab } = useTabsActions();

  return (tabId: string, currentActiveTabId: string | null) => {
    const nextActiveId = closeTab(tabId);

    if (nextActiveId !== currentActiveTabId) {
      navigate({ to: nextActiveId ?? ROUTES.HOME });
    }
  };
}
