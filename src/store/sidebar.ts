import { create } from "zustand";
import { persist } from "zustand/middleware";

const key = "sidebar";

export type SidebarState = {
  visible: boolean;
  size: number;
  activeView?: string;
};

export type SidebarActions = {
  onChangeVisible: (v: boolean) => void;
  onChangeSize: (v: number) => void;
  onChangeActiveView: (v?: string) => void;
};

export const useSidebarStore = create<SidebarState & SidebarActions>()(
  persist(
    (set) => ({
      visible: true,
      size: 25,
      activeView: undefined,
      onChangeVisible: (v) => set({ visible: v }),
      onChangeSize: (v) => set({ size: v }),
      onChangeActiveView: (v) => set({ activeView: v }),
    }),
    {
      name: key,
    }
  )
);
