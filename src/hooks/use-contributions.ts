import { useState } from "react";
import { useMount } from "@/hooks/use-mount";
import type { ContributionData } from "@/lib/contributions/types";

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
    } catch {
      setStatus("error");
    }
  });

  return { data, status, isLoading: status === "loading" };
}
