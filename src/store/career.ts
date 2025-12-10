import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import type { CareerSection } from "@/config/career-timeline";

export type ScrollStatus = "idle" | "scrolling" | "looping";

type State = {
  activeSection: CareerSection | null;
  status: ScrollStatus;
};

type Actions = {
  setActiveSection: (section: CareerSection | null) => void;
  setStatus: (status: ScrollStatus) => void;
  reset: () => void;
};

const initialState: State = {
  activeSection: null,
  status: "idle",
};

export const useCareerStore = create<State & Actions>()((set) => ({
  ...initialState,
  setActiveSection: (section) => set({ activeSection: section }),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));

export const useCareerActiveSection = () =>
  useCareerStore((state) => !!state.activeSection);

export const useCareerScrolling = () =>
  useCareerStore((state) => state.status === "scrolling");

export const useCareerLooping = () =>
  useCareerStore((state) => state.status === "looping");

export const useCareerActions = () =>
  useCareerStore(
    useShallow((s) => ({
      setStatus: s.setStatus,
      setActiveSection: s.setActiveSection,
      reset: s.reset,
    }))
  );
