import { createContext, useContext } from "react";

function createCtx<T extends unknown | null>(
  errMsg = "useCtx` must be inside a Provider with value.",
  defaultValue?: T
) {
  const ctx = createContext<T | undefined>(defaultValue);

  const useCtx = () => {
    const c = useContext(ctx);

    if (c === undefined) {
      throw new Error(errMsg);
    }

    return c;
  };

  return [useCtx, ctx.Provider] as const;
}

export default createCtx;
