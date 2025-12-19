import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { getRouteLabel } from "@/config/routes";
import { STORE_KEYS } from "@/config/store-keys";

export type Tab = {
  id: string;
  label: string;
};

type TabsState = {
  tabs: Tab[];
  activeTabId: string | null;
};

type TabsActions = {
  openTab: (path: string) => void;
  closeTab: (tabId: string) => string | null;
  setActiveTab: (tabId: string) => void;
};

const DEFAULT_STATE: TabsState = { tabs: [], activeTabId: null };

export const useTabsStore = create<TabsState & TabsActions>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      openTab: (path: string) => {
        const state = get();

        const existingTab = state.tabs.find((t) => t.id === path);
        if (existingTab) {
          set({ activeTabId: path });
          return;
        }

        const newTab: Tab = {
          id: path,
          label: getRouteLabel(path),
        };

        set({
          tabs: [...state.tabs, newTab],
          activeTabId: path,
        });
      },

      closeTab: (tabId: string) => {
        const state = get();
        const newTabs = state.tabs.filter((t) => t.id !== tabId);

        if (state.activeTabId !== tabId) {
          set({ tabs: newTabs });
          return state.activeTabId;
        }

        const closedIndex = state.tabs.findIndex((t) => t.id === tabId);
        const nextActiveId =
          newTabs[Math.min(closedIndex, newTabs.length - 1)]?.id ?? null;

        set({ tabs: newTabs, activeTabId: nextActiveId });

        return nextActiveId;
      },

      setActiveTab: (tabId: string) => {
        set({ activeTabId: tabId });
      },
    }),
    {
      name: STORE_KEYS.TABS,
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
