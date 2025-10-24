import { useEffect } from "react";

export type UseMount = (fn: () => void) => void;

export const useMount: UseMount = (fn: () => void) => {
  if (typeof fn !== "function") {
    throw new Error(
      `useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`
    );
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <custom hook>
  useEffect(() => {
    fn?.();
  }, []);
};
