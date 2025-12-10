import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import { CAREER_SECTIONS } from "@/config/career-timeline";

export type ScrollStatus = "idle" | "scrolling" | "looping";
export type AnimationState = "idle" | "running" | "milestone";

type State = {
  activeSectionId: string | null;
  status: ScrollStatus;
};

type Actions = {
  setActiveSection: (sectionId: string | null) => void;
  setStatus: (status: ScrollStatus) => void;
  reset: () => void;
};

const initialState: State = {
  activeSectionId: null,
  status: "idle",
};

export const useCareerStore = create<State & Actions>()((set) => ({
  ...initialState,
  setActiveSection: (sectionId) => set({ activeSectionId: sectionId }),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));

export const useActiveSectionId = () =>
  useCareerStore((s) => s.activeSectionId);

export const useActiveSection = () =>
  useCareerStore((s) =>
    s.activeSectionId
      ? (CAREER_SECTIONS.find((sec) => sec.id === s.activeSectionId) ?? null)
      : null
  );

export const useCareerActiveSection = () =>
  useCareerStore((s) => !!s.activeSectionId);

export const useCareerScrolling = () =>
  useCareerStore((s) => s.status === "scrolling");

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

const DEFAULT_YEAR = "2001";
export const useDisplayYear = (): string =>
  useCareerStore((s) => {
    if (s.status === "looping") {
      return DEFAULT_YEAR;
    }
    const section = CAREER_SECTIONS.find((sec) => sec.id === s.activeSectionId);
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
