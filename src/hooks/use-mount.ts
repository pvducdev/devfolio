import type { EffectCallback } from "react";
import { useEffect } from "react";
import { isPromise } from "@/lib/utils";

type CleanupFn = () => void;
type AsyncMountCallback = (signal: AbortSignal) => Promise<unknown>;
type MountCallback = EffectCallback | AsyncMountCallback;

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === "AbortError";

export function useMount(fn: MountCallback) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <custom hook>
  useEffect(() => {
    let cleanup: CleanupFn | undefined;
    let isMounted = true;
    const abortController = new AbortController();

    const result = fn?.(abortController.signal);

    if (isPromise(result)) {
      handleAsyncResult(result);
    } else if (result) {
      cleanup = result;
    }

    return () => {
      isMounted = false;
      abortController.abort();
      cleanup?.();
    };

    function handleAsyncResult(promise: Promise<unknown>) {
      promise
        .then((result) => {
          if (typeof result !== "function") {
            return;
          }

          if (isMounted) {
            cleanup = result;
            return;
          }

          result();
        })
        .catch((error) => {
          if (isAbortError(error)) {
            return;
          }
          throw error;
        });
    }
  }, []);
}
