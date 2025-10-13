import { create } from "zustand";
import { persist } from "zustand/middleware";

const key = "sidebar";

export type SidebarState = {
  size: number;
  activeView?: string;
};

export type SidebarActions = {
  onChangeSize: (v: number) => void;
  toggleActiveView: (v: string) => void;
};

export const useSidebarStore = create<SidebarState & SidebarActions>()(
  persist(
    (set) => ({
      size: 25,
      activeView: undefined,
      onChangeSize: (v) => {
        set({ size: v });
      },
      toggleActiveView: (v) => {
        set((state) => ({
          activeView: state.activeView === key ? undefined : v,
        }));
      },
    }),
    {
      name: key,
    }
  )
);
