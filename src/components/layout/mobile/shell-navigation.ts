import { createContext, use } from "react";

type NavigateWithCommand = (command: string, to: string) => void;

export const ShellNavigationContext = createContext<NavigateWithCommand | null>(
  null
);

export const useShellNavigate = (): NavigateWithCommand => {
  const navigate = use(ShellNavigationContext);
  if (!navigate) {
    throw new Error("useShellNavigate must be used inside the mobile Shell");
  }
  return navigate;
};
