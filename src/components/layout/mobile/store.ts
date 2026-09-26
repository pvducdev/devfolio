import { create } from "zustand";
import { useShallow } from "zustand/shallow";

interface State {
  currentCommand: string;
  isDrawerOpen: boolean;
  isAssistantOpen: boolean;
  isDockExpanded: boolean;
}

interface Actions {
  setCurrentCommand: (command: string) => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleDockExpanded: () => void;
  collapseDock: () => void;
}

const initialState: State = {
  currentCommand: "",
  isAssistantOpen: false,
  isDockExpanded: false,
  isDrawerOpen: false,
};

const useMobileShellStore = create<State & Actions>()((set) => ({
  ...initialState,
  closeAssistant: () => set({ isAssistantOpen: false }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  collapseDock: () => set({ isDockExpanded: false }),
  openAssistant: () => set({ isAssistantOpen: true, isDrawerOpen: false }),
  setCurrentCommand: (command) => set({ currentCommand: command }),
  toggleDockExpanded: () => set((s) => ({ isDockExpanded: !s.isDockExpanded })),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
}));

export const useCurrentCommand = () =>
  useMobileShellStore((s) => s.currentCommand);

export const useIsDrawerOpen = () => useMobileShellStore((s) => s.isDrawerOpen);

export const useIsAssistantOpen = () =>
  useMobileShellStore((s) => s.isAssistantOpen);

export const useIsDockExpanded = () =>
  useMobileShellStore((s) => s.isDockExpanded);

export const useMobileShellActions = () =>
  useMobileShellStore(
    useShallow((s) => ({
      closeAssistant: s.closeAssistant,
      closeDrawer: s.closeDrawer,
      collapseDock: s.collapseDock,
      openAssistant: s.openAssistant,
      setCurrentCommand: s.setCurrentCommand,
      toggleDockExpanded: s.toggleDockExpanded,
      toggleDrawer: s.toggleDrawer,
    }))
  );
