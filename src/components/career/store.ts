import { create } from "zustand";
import { useShallow } from "zustand/shallow";

import { DEFAULT_YEAR } from "./config";

type ScrollStatus = "idle" | "scrolling" | "looping";
export type AnimationState = "idle" | "running" | "milestone";

interface State {
  activeYear: string | null;
  lastVisitedYear: string | null;
  status: ScrollStatus;
}

interface Actions {
  setActiveYear: (year: string | null) => void;
  setStatus: (status: ScrollStatus) => void;
  reset: () => void;
}

const initialState: State = {
  activeYear: null,
  lastVisitedYear: null,
  status: "idle",
};

const useCareerStore = create<State & Actions>()((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setActiveYear: (year) =>
    set((state) => ({
      activeYear: year,
      lastVisitedYear: year ?? state.lastVisitedYear,
    })),
  setStatus: (status) => set({ status }),
}));

export const useActiveYear = () => useCareerStore((s) => s.activeYear);

export const useCareerLooping = () =>
  useCareerStore((s) => s.status === "looping");

export const useCharacterAnimationState = (): AnimationState =>
  useCareerStore((s) => {
    if (s.status === "looping") {
      return "running";
    }
    if (s.activeYear) {
      return "milestone";
    }
    if (s.status === "scrolling") {
      return "running";
    }
    return "idle";
  });

export const useDisplayYear = (): string =>
  useCareerStore((s) => {
    if (s.status === "looping") {
      return DEFAULT_YEAR;
    }

    return s.lastVisitedYear ?? DEFAULT_YEAR;
  });

export const useCareerActions = () =>
  useCareerStore(
    useShallow((s) => ({
      reset: s.reset,
      setActiveYear: s.setActiveYear,
      setStatus: s.setStatus,
    }))
  );
