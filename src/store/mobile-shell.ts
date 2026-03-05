import { create } from "zustand";
import { useShallow } from "zustand/shallow";

interface PendingNavigation {
  command: string;
  to: string;
}

interface State {
  currentCommand: string;
  isDrawerOpen: boolean;
  pendingNavigation: PendingNavigation | null;
}

interface Actions {
  setCurrentCommand: (command: string) => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  requestNavigation: (command: string, to: string) => void;
  clearNavigation: () => void;
}

const initialState: State = {
  currentCommand: "",
  isDrawerOpen: false,
  pendingNavigation: null,
};

export const useMobileShellStore = create<State & Actions>()((set) => ({
  ...initialState,
  setCurrentCommand: (command) => set({ currentCommand: command }),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
  closeDrawer: () => set({ isDrawerOpen: false }),
  requestNavigation: (command, to) =>
    set({ pendingNavigation: { command, to } }),
  clearNavigation: () => set({ pendingNavigation: null }),
}));

export const useCurrentCommand = () =>
  useMobileShellStore((s) => s.currentCommand);

export const useIsDrawerOpen = () => useMobileShellStore((s) => s.isDrawerOpen);

export const usePendingNavigation = () =>
  useMobileShellStore((s) => s.pendingNavigation);

export const useMobileShellActions = () =>
  useMobileShellStore(
    useShallow((s) => ({
      setCurrentCommand: s.setCurrentCommand,
      toggleDrawer: s.toggleDrawer,
      closeDrawer: s.closeDrawer,
      requestNavigation: s.requestNavigation,
      clearNavigation: s.clearNavigation,
    }))
  );
