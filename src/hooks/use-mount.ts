import type { EffectCallback } from "react";
import { useEffect } from "react";

import { isPromise } from "@/lib/utils";

type CleanupFn = () => void;
type AsyncMountCallback = (signal: AbortSignal) => Promise<unknown>;
type MountCallback = EffectCallback | AsyncMountCallback;

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === "AbortError";

export const useMount = (fn: MountCallback) => {
  useEffect(() => {
    let cleanup: CleanupFn | undefined;
    let isMounted = true;
    const abortController = new AbortController();

    const handleAsyncResult = async (promise: Promise<unknown>) => {
      try {
        const resolved = await promise;
        if (typeof resolved !== "function") {
          return;
        }

        if (isMounted) {
          cleanup = resolved as CleanupFn;
          return;
        }

        resolved();
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }
        throw error;
      }
    };

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
  }, []);
};
