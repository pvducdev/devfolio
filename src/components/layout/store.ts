import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

import { LAYOUT_CONFIG } from "@/components/layout/layout-config";

export interface AppLayoutState {
  sidebar: string | null;
  panel: string | null;
  sidebarSize: number;
  panelSize: number;
  isStretchLayout: boolean;
}

export interface AppLayoutActions {
  toggleSidebar: (value?: string) => void;
  togglePanel: (value?: string) => void;
  setSidebarSize: (size: number) => void;
  setPanelSize: (size: number) => void;
  toggleStretchLayout: () => void;
}

const DEFAULT_APP_LAYOUT: AppLayoutState = {
  isStretchLayout: LAYOUT_CONFIG.stretchLayout,
  panel: LAYOUT_CONFIG.panel.defaultSection,
  panelSize: LAYOUT_CONFIG.panel.defaultSize,
  sidebar: LAYOUT_CONFIG.sidebar.defaultSection,
  sidebarSize: LAYOUT_CONFIG.sidebar.defaultSize,
};

const useAppLayoutStore = create<AppLayoutState & AppLayoutActions>()(
  persist(
    (set) => ({
      ...DEFAULT_APP_LAYOUT,
      setPanelSize: (size) => {
        set(() => ({ panelSize: size }));
      },
      setSidebarSize: (size) => {
        set(() => ({ sidebarSize: size }));
      },
      togglePanel: (value) => {
        set((state) => ({ panel: state.panel === value ? null : value }));
      },
      toggleSidebar: (value) => {
        set((state) => ({
          sidebar: state.sidebar === value ? null : value,
        }));
      },
      toggleStretchLayout: () => {
        set((state) => ({ isStretchLayout: !state.isStretchLayout }));
      },
    }),
    {
      name: "app-layout",
    }
  )
);

export const useIsStretchLayout = () =>
  useAppLayoutStore((s) => s.isStretchLayout);

export const useSidebarSection = () => useAppLayoutStore((s) => s.sidebar);

export const usePanelSection = () => useAppLayoutStore((s) => s.panel);

export const useSidebarSize = () => useAppLayoutStore((s) => s.sidebarSize);

export const usePanelSize = () => useAppLayoutStore((s) => s.panelSize);

export const useAppLayoutActions = () =>
  useAppLayoutStore(
    useShallow((s) => ({
      setPanelSize: s.setPanelSize,
      setSidebarSize: s.setSidebarSize,
      togglePanel: s.togglePanel,
      toggleSidebar: s.toggleSidebar,
      toggleStretchLayout: s.toggleStretchLayout,
    }))
  );
