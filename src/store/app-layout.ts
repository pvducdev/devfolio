import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { STORE_KEYS } from "@/config/store-keys";
import { LAYOUT_CONFIG } from "@/config/ui";

export interface AppLayoutState {
  sidebar: string | null;
  panel: string | null;
  sidebarSize: number;
  panelSize: number;
  isStretchLayout: boolean;
  _hasHydrated: boolean;
}

export interface AppLayoutActions {
  toggleSidebar: (value?: string) => void;
  togglePanel: (value?: string) => void;
  setSidebarSize: (size: number) => void;
  setPanelSize: (size: number) => void;
  toggleStretchLayout: () => void;
  setHasHydrated: (state: boolean) => void;
}

const DEFAULT_APP_LAYOUT: Omit<AppLayoutState, "_hasHydrated"> = {
  sidebar: LAYOUT_CONFIG.sidebar.defaultSection,
  panel: LAYOUT_CONFIG.panel.defaultSection,
  sidebarSize: LAYOUT_CONFIG.sidebar.defaultSize,
  panelSize: LAYOUT_CONFIG.panel.defaultSize,
  isStretchLayout: LAYOUT_CONFIG.stretchLayout,
};

export const useAppLayoutStore = create<AppLayoutState & AppLayoutActions>()(
  persist(
    (set) => ({
      ...DEFAULT_APP_LAYOUT,
      _hasHydrated: false,
      toggleSidebar: (value) => {
        set((state) => ({
          sidebar: state.sidebar === value ? null : value,
        }));
      },
      togglePanel: (value) => {
        set((state) => ({ panel: state.panel === value ? null : value }));
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
      name: STORE_KEYS.APP_LAYOUT,
      onRehydrateStorage: (state) => () => state.setHasHydrated(true),
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

export const useIsSidebarOpen = () =>
  useAppLayoutStore((s) => s.sidebar !== null);

export const useIsPanelOpen = () => useAppLayoutStore((s) => s.panel !== null);

export const useIsStretchLayout = () =>
  useAppLayoutStore((s) => s.isStretchLayout);

export const useHasHydrated = () => useAppLayoutStore((s) => s._hasHydrated);

export const useSidebarSection = () => useAppLayoutStore((s) => s.sidebar);

export const usePanelSection = () => useAppLayoutStore((s) => s.panel);

export const useSidebarSize = () => useAppLayoutStore((s) => s.sidebarSize);

export const usePanelSize = () => useAppLayoutStore((s) => s.panelSize);

export const useAppLayoutActions = () =>
  useAppLayoutStore(
    useShallow((s) => ({
      toggleSidebar: s.toggleSidebar,
      togglePanel: s.togglePanel,
      setSidebarSize: s.setSidebarSize,
      setPanelSize: s.setPanelSize,
      toggleStretchLayout: s.toggleStretchLayout,
    }))
  );
