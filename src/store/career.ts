import { create } from "zustand";
import type { CareerSection } from "@/config/career-timeline";

type State = {
  activeSection: CareerSection | null;
};

type Actions = {
  setActiveSection: (section: CareerSection | null) => void;
  reset: () => void;
};

const initialState: State = {
  activeSection: null,
};

export const useCareerStore = create<State & Actions>()((set) => ({
  ...initialState,
  setActiveSection: (section) => set({ activeSection: section }),
  reset: () => set(initialState),
}));
