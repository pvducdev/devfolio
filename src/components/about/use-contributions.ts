import { useEffect, useState } from "react";

import type { ContributionData } from "@/lib/contributions";
import { getLogger } from "@/lib/logger";

type ContributionsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: ContributionData[] };

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

const requestContributions = async (
  signal: AbortSignal
): Promise<ContributionData[]> => {
  const response = await fetch("/api/contributions", { signal });
  if (!response.ok) {
    throw new Error(`/api/contributions responded ${response.status}`);
  }
  return response.json();
};

export const useContributions = (): ContributionsState => {
  const [state, setState] = useState<ContributionsState>({
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadContributions = async () => {
      try {
        const data = await requestContributions(controller.signal);
        setState({ data, status: "success" });
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }
        setState({ status: "error" });
        await getLogger().error("Failed to fetch contributions", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };

    loadContributions();

    return () => controller.abort();
  }, []);

  return state;
};
