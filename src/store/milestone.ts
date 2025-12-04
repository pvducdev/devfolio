import { create } from "zustand";

type State = {
  activeSectionId: string | null;
  isInMilestoneZone: boolean;
};

type Actions = {
  setActiveSection: (id: string | null) => void;
  setMilestoneZone: (isIn: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  activeSectionId: null,
  isInMilestoneZone: false,
};

export const useMilestoneStore = create<State & Actions>()((set) => ({
  ...initialState,
  setActiveSection: (id) => set({ activeSectionId: id }),
  setMilestoneZone: (isIn) => set({ isInMilestoneZone: isIn }),
  reset: () => set(initialState),
}));
