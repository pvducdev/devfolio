import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { ABOUT_TREE, PROJECT_TREE } from "@/config/page";
import { hashPath } from "@/lib/utils.ts";

const STORE_KEY = "tabs";

export type Tab = {
  id: string;
  pageId: string;
  label: string;
};

type TabsState = {
  tabs: Tab[];
  activeTabId: string | null;
};

type TabsActions = {
  openTab: (pageId: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
};

function getPageLabel(pageId: string): string {
  if (pageId === "career") {
    return "career.tsx";
  }
  const treeItem = ABOUT_TREE[pageId] || PROJECT_TREE[pageId];
  return treeItem?.name || `${pageId}.tsx`;
}

const DEFAULT_STATE: TabsState = { tabs: [], activeTabId: null };

export const useTabsStore = create<TabsState & TabsActions>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      openTab: (pageId: string) => {
        const state = get();
        const tabId = hashPath(pageId);

        const existingTab = state.tabs.find((t) => t.id === tabId);
        if (existingTab) {
          set({ activeTabId: tabId });
          return;
        }

        const newTab: Tab = {
          id: tabId,
          pageId,
          label: getPageLabel(pageId),
        };

        set({
          tabs: [...state.tabs, newTab],
          activeTabId: tabId,
        });
      },

      closeTab: (tabId: string) => {
        const state = get();
        const newTabs = state.tabs.filter((t) => t.id !== tabId);
        set(() => ({ tabs: newTabs }));

        if (state.activeTabId === tabId && newTabs.length > 0) {
          const closedIndex = state.tabs.findIndex((t) => t.id === tabId);
          const nextActiveId =
            newTabs[Math.min(closedIndex, newTabs.length - 1)]?.id || null;

          set(() => ({ activeTabId: nextActiveId }));
        }
      },

      setActiveTab: (tabId: string) => {
        set({ activeTabId: tabId });
      },
    }),
    {
      name: STORE_KEY,
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
      }),
    }
  )
);

export const useHasOpenTabs = () => useTabsStore((s) => s.tabs.length > 0);

export const useActiveTab = () =>
  useTabsStore((s) => s.tabs.find((t) => t.id === s.activeTabId));

export const useActiveTabId = () => useTabsStore((s) => s.activeTabId);

export const useTabCount = () => useTabsStore((s) => s.tabs.length);

export const useOpenTabs = () => useTabsStore((s) => s.tabs);

export const useTabsActions = () =>
  useTabsStore(
    useShallow((s) => ({
      openTab: s.openTab,
      closeTab: s.closeTab,
      setActiveTab: s.setActiveTab,
    }))
  );
