import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORE_KEY = "app-layout";

export type AppLayoutState = {
  sidebar?: string;
  panel?: string;
  sidebarSize: number;
  panelSize: number;
};

export type AppLayoutActions = {
  toggleSidebar: (value?: string) => void;
  togglePanel: (value?: string) => void;
  setSidebarSize: (size: number) => void;
  setPanelSize: (size: number) => void;
};

const DEFAULT_APP_LAYOUT: AppLayoutState = {
  sidebar: undefined,
  panel: "assistant",
  sidebarSize: 25,
  panelSize: 25,
};

export const useAppLayoutStore = create<AppLayoutState & AppLayoutActions>()(
  persist(
    (set) => ({
      ...DEFAULT_APP_LAYOUT,
      toggleSidebar: (value) => {
        set((state) => ({
          sidebar: state.sidebar === value ? undefined : value,
        }));
      },
      togglePanel: (value) => {
        set((state) => ({ panel: state.panel === value ? undefined : value }));
      },
      setSidebarSize: (size) => {
        set(() => ({ sidebarSize: size }));
      },
      setPanelSize: (size) => {
        set(() => ({ panelSize: size }));
      },
    }),
    {
      name: STORE_KEY,
    }
  )
);
