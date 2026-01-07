import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import {
  CAREER_SECTIONS,
  DEFAULT_YEAR,
} from "@/components/career-runner/config";

const SECTIONS_BY_ID = new Map(CAREER_SECTIONS.map((s) => [s.id, s]));

export type ScrollStatus = "idle" | "scrolling" | "looping";
export type AnimationState = "idle" | "running" | "milestone";

interface State {
  activeSectionId: string | null;
  lastVisitedSectionId: string | null;
  status: ScrollStatus;
}

interface Actions {
  setActiveSection: (sectionId: string | null) => void;
  setStatus: (status: ScrollStatus) => void;
  reset: () => void;
}

const initialState: State = {
  activeSectionId: null,
  lastVisitedSectionId: null,
  status: "idle",
};

export const useCareerStore = create<State & Actions>()((set) => ({
  ...initialState,
  setActiveSection: (sectionId) =>
    set((state) => ({
      activeSectionId: sectionId,
      lastVisitedSectionId: sectionId ?? state.lastVisitedSectionId,
    })),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));

export const useActiveSectionId = () =>
  useCareerStore((s) => s.activeSectionId);

export const useCareerLooping = () =>
  useCareerStore((s) => s.status === "looping");

export const useCharacterAnimationState = (): AnimationState =>
  useCareerStore((s) => {
    if (s.status === "looping") {
      return "running";
    }
    if (s.activeSectionId) {
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

    const section = s.lastVisitedSectionId
      ? SECTIONS_BY_ID.get(s.lastVisitedSectionId)
      : null;

    return section?.year ?? DEFAULT_YEAR;
  });

export const useCareerActions = () =>
  useCareerStore(
    useShallow((s) => ({
      setStatus: s.setStatus,
      setActiveSection: s.setActiveSection,
      reset: s.reset,
    }))
  );
