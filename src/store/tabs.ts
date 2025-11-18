import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getFileName, hashPath } from "@/lib/utils.ts";

const STORE_KEY = "tabs-storage";

export type Tab = {
  id: string;
  filePath: string;
  label: string;
};

type TabsState = {
  tabs: Tab[];
  activeTabId: string | null;
};

type TabsActions = {
  openTab: (filePath: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
};

const DEFAULT_STATE: TabsState = { tabs: [], activeTabId: null };

export const useTabsStore = create<TabsState & TabsActions>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      openTab: (filePath: string) => {
        const state = get();
        const tabId = hashPath(filePath);

        const existingTab = state.tabs.find((t) => t.id === tabId);
        if (existingTab) {
          set({ activeTabId: tabId });
          return;
        }

        const newTab: Tab = {
          id: tabId,
          filePath,
          label: getFileName(filePath),
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
    { name: STORE_KEY }
  )
);
