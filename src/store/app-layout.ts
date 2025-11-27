import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORE_KEY = "app-layout";

export type AppLayoutState = {
  sidebar?: string;
  panel?: string;
  sidebarSize: number;
  panelSize: number;
  isStretchLayout: boolean;
  _hasHydrated: boolean;
};

export type AppLayoutActions = {
  toggleSidebar: (value?: string) => void;
  togglePanel: (value?: string) => void;
  setSidebarSize: (size: number) => void;
  setPanelSize: (size: number) => void;
  toggleStretchLayout: () => void;
  setHasHydrated: (state: boolean) => void;
};

const DEFAULT_APP_LAYOUT: Omit<AppLayoutState, "_hasHydrated"> = {
  sidebar: undefined,
  panel: "assistant",
  sidebarSize: 25,
  panelSize: 25,
  isStretchLayout: false,
};

export const useAppLayoutStore = create<AppLayoutState & AppLayoutActions>()(
  persist(
    (set) => ({
      ...DEFAULT_APP_LAYOUT,
      _hasHydrated: false,
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
      toggleStretchLayout: () => {
        set((state) => ({ isStretchLayout: !state.isStretchLayout }));
      },
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: STORE_KEY,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        sidebar: state.sidebar,
        panel: state.panel,
        sidebarSize: state.sidebarSize,
        panelSize: state.panelSize,
        isStretchLayout: state.isStretchLayout,
      }),
    }
  )
);
