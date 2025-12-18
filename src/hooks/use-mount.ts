import type { EffectCallback } from "react";
import { useEffect } from "react";
import { isPromise } from "@/lib/utils";

type MountCallback = EffectCallback | (() => Promise<undefined | (() => void)>);

export function useMount(fn: MountCallback) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <custom hook>
  useEffect(() => {
    const result = fn?.();
    if (isPromise(result)) {
      return;
    }

    return result as ReturnType<EffectCallback>;
  }, []);
}
