import { create } from "zustand";
import type { JobType } from "@/config/career-timeline";

type State = {
  activeSectionId: string | null;
  activeJobType: JobType | null;
  isInMilestoneZone: boolean;
};

type Actions = {
  setActiveSection: (id: string | null, jobType: JobType | null) => void;
  setMilestoneZone: (isIn: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  activeSectionId: null,
  activeJobType: null,
  isInMilestoneZone: false,
};

export const useMilestoneStore = create<State & Actions>()((set) => ({
  ...initialState,
  setActiveSection: (id, jobType) =>
    set({ activeSectionId: id, activeJobType: jobType }),
  setMilestoneZone: (isIn) => set({ isInMilestoneZone: isIn }),
  reset: () => set(initialState),
}));
