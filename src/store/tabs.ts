import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tab, TabsActions, TabsState } from "@/types/tabs";

function hashPath(path: string): string {
  return path.replace(/[^a-zA-Z0-9]/g, "-");
}

function getFileName(path: string): string {
  const name = path.split("/").pop() || path;

  return name;
}

export const useTabsStore = create<TabsState & TabsActions>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,

      openTab: (filePath: string) => {
        const state = get();
        const tabId = hashPath(filePath);

        // Check if tab exists
        const existingTab = state.tabs.find((t) => t.id === tabId);
        if (existingTab) {
          set({ activeTabId: tabId });
          return;
        }

        // Create new tab
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

        // Find next active tab
        let nextActiveId: string | null = null;
        if (state.activeTabId === tabId && newTabs.length > 0) {
          const closedIndex = state.tabs.findIndex((t) => t.id === tabId);
          nextActiveId =
            newTabs[Math.min(closedIndex, newTabs.length - 1)]?.id || null;
        }

        set({ tabs: newTabs, activeTabId: nextActiveId });
      },

      setActiveTab: (tabId: string) => {
        set({ activeTabId: tabId });
      },
    }),
    { name: "tabs-storage" }
  )
);
