import { create } from "zustand";
import { useShallow } from "zustand/shallow";

interface State {
  currentCommand: string;
  isDrawerOpen: boolean;
}

interface Actions {
  setCurrentCommand: (command: string) => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
}

const initialState: State = {
  currentCommand: "",
  isDrawerOpen: false,
};

export const useMobileShellStore = create<State & Actions>()((set) => ({
  ...initialState,
  setCurrentCommand: (command) => set({ currentCommand: command }),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
  closeDrawer: () => set({ isDrawerOpen: false }),
}));

export const useCurrentCommand = () =>
  useMobileShellStore((s) => s.currentCommand);

export const useIsDrawerOpen = () => useMobileShellStore((s) => s.isDrawerOpen);

export const useMobileShellActions = () =>
  useMobileShellStore(
    useShallow((s) => ({
      setCurrentCommand: s.setCurrentCommand,
      toggleDrawer: s.toggleDrawer,
      closeDrawer: s.closeDrawer,
    }))
  );
