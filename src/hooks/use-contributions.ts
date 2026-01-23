import { useState } from "react";
import { useMount } from "@/hooks/use-mount";
import type { ContributionData } from "@/lib/contributions/types";
import { getLogger } from "@/lib/logger/client";

export function useContributions() {
  const [data, setData] = useState<ContributionData[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useMount(async (signal) => {
    setStatus("loading");

    try {
      const response = await fetch("/api/contributions", { signal });
      const contributions = await response.json();
      setData(contributions);
      setStatus("idle");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      getLogger().error("Failed to fetch contributions", {
        endpoint: "/api/contributions",
        error: message,
      });
      setStatus("error");
    }
  });

  return { data, status, isLoading: status === "loading" };
}
