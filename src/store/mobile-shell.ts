import { create } from "zustand";
import { useShallow } from "zustand/shallow";

interface PendingNavigation {
  command: string;
  to: string;
}

interface State {
  currentCommand: string;
  isDrawerOpen: boolean;
  isAssistantOpen: boolean;
  isDockExpanded: boolean;
  pendingNavigation: PendingNavigation | null;
}

interface Actions {
  setCurrentCommand: (command: string) => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleDockExpanded: () => void;
  collapseDock: () => void;
  requestNavigation: (command: string, to: string) => void;
  clearNavigation: () => void;
}

const initialState: State = {
  currentCommand: "",
  isAssistantOpen: false,
  isDockExpanded: false,
  isDrawerOpen: false,
  pendingNavigation: null,
};

export const useMobileShellStore = create<State & Actions>()((set) => ({
  ...initialState,
  clearNavigation: () => set({ pendingNavigation: null }),
  closeAssistant: () => set({ isAssistantOpen: false }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  collapseDock: () => set({ isDockExpanded: false }),
  openAssistant: () => set({ isAssistantOpen: true, isDrawerOpen: false }),
  requestNavigation: (command, to) =>
    set({ pendingNavigation: { command, to } }),
  setCurrentCommand: (command) => set({ currentCommand: command }),
  toggleDockExpanded: () => set((s) => ({ isDockExpanded: !s.isDockExpanded })),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
}));

export const useCurrentCommand = () =>
  useMobileShellStore((s) => s.currentCommand);

export const useIsDrawerOpen = () => useMobileShellStore((s) => s.isDrawerOpen);

export const useIsAssistantOpen = () =>
  useMobileShellStore((s) => s.isAssistantOpen);

export const usePendingNavigation = () =>
  useMobileShellStore((s) => s.pendingNavigation);

export const useIsDockExpanded = () =>
  useMobileShellStore((s) => s.isDockExpanded);

export const useMobileShellActions = () =>
  useMobileShellStore(
    useShallow((s) => ({
      clearNavigation: s.clearNavigation,
      closeAssistant: s.closeAssistant,
      closeDrawer: s.closeDrawer,
      collapseDock: s.collapseDock,
      openAssistant: s.openAssistant,
      requestNavigation: s.requestNavigation,
      setCurrentCommand: s.setCurrentCommand,
      toggleDockExpanded: s.toggleDockExpanded,
      toggleDrawer: s.toggleDrawer,
    }))
  );
