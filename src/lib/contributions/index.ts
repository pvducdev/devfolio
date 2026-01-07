import { createServerOnlyFn } from "@tanstack/react-start";
import { CONTRIBUTIONS_CONFIG } from "@/config/contributions";
import { env } from "@/env/server";
import { getProvider } from "./providers";
import type { ContributionData, DateRange } from "./types";

export type { ContributionData, ContributionSource, DateRange } from "./types";

export const fetchContributions = createServerOnlyFn(
  (range?: DateRange): Promise<ContributionData[]> => {
    const { source, username } = CONTRIBUTIONS_CONFIG;
    const provider = getProvider(source);

    return provider(username, env.GIT_CONTRIBUTION_TOKEN as string, range);
  }
);
