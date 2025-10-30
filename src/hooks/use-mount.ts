import type { EffectCallback } from "react";
import { useEffect } from "react";

type MountCallback = EffectCallback | (() => Promise<undefined | (() => void)>);

export function useMount(fn: MountCallback) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <custom hook>
  useEffect(() => {
    const result = fn?.();
    if (
      result &&
      typeof result === "object" &&
      // biome-ignore lint/suspicious/noExplicitAny: <.>
      typeof (result as any).then === "function"
    ) {
      return;
    }

    return result as ReturnType<EffectCallback>;
  }, []);
}
