import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { getRouteLabel } from "@/config/routes";
import { STORE_KEYS } from "@/config/store-keys";

export interface Tab {
  id: string;
  label: string;
}

interface TabsState {
  tabs: Tab[];
  activeTabId: string | null;
}

interface TabsActions {
  openTab: (path: string) => void;
  closeTab: (tabId: string) => string | null;
  setActiveTab: (tabId: string) => void;
  closeOtherTabs: (keepTabId: string) => string;
  closeAllTabs: () => void;
  closeTabsToRight: (tabId: string) => string;
  closeTabsToLeft: (tabId: string) => string;
}

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

      closeOtherTabs: (keepTabId: string) => {
        const state = get();
        const keepTab = state.tabs.find((t) => t.id === keepTabId);
        if (!keepTab) {
          return state.activeTabId ?? keepTabId;
        }

        set({ tabs: [keepTab], activeTabId: keepTabId });
        return keepTabId;
      },

      closeAllTabs: () => {
        set({ tabs: [], activeTabId: null });
      },

      closeTabsToRight: (tabId: string) => {
        const state = get();
        const targetIndex = state.tabs.findIndex((t) => t.id === tabId);
        if (targetIndex === -1) {
          return state.activeTabId ?? tabId;
        }

        const newTabs = state.tabs.slice(0, targetIndex + 1);
        const activeStillExists = newTabs.some(
          (t) => t.id === state.activeTabId
        );
        const newActiveId = activeStillExists ? state.activeTabId : tabId;

        set({ tabs: newTabs, activeTabId: newActiveId });
        return newActiveId;
      },

      closeTabsToLeft: (tabId: string) => {
        const state = get();
        const targetIndex = state.tabs.findIndex((t) => t.id === tabId);
        if (targetIndex === -1) {
          return state.activeTabId ?? tabId;
        }

        const newTabs = state.tabs.slice(targetIndex);
        const activeStillExists = newTabs.some(
          (t) => t.id === state.activeTabId
        );
        const newActiveId = activeStillExists ? state.activeTabId : tabId;

        set({ tabs: newTabs, activeTabId: newActiveId });
        return newActiveId;
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
      closeOtherTabs: s.closeOtherTabs,
      closeAllTabs: s.closeAllTabs,
      closeTabsToRight: s.closeTabsToRight,
      closeTabsToLeft: s.closeTabsToLeft,
    }))
  );

export const useTabIndex = (tabId: string) =>
  useTabsStore((s) => s.tabs.findIndex((t) => t.id === tabId));

export const useIsFirstTab = (tabId: string) =>
  useTabsStore((s) => s.tabs.length > 0 && s.tabs[0].id === tabId);

export const useIsLastTab = (tabId: string) =>
  useTabsStore((s) => s.tabs.length > 0 && s.tabs.at(-1)?.id === tabId);
