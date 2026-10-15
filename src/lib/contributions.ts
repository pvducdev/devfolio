import { createServerOnlyFn } from "@tanstack/react-start";
import { number, parse, record, string } from "valibot";

import { CONTRIBUTIONS_CONFIG } from "@/config/contributions";
import { env } from "@/env/server";

export interface ContributionData {
  date: string;
  count: number;
}

const GitLabCalendarSchema = record(string(), number());

export const fetchContributions = createServerOnlyFn(
  async (): Promise<ContributionData[]> => {
    const { username } = CONTRIBUTIONS_CONFIG;
    const response = await fetch(
      `https://gitlab.com/users/${encodeURIComponent(username)}/calendar.json`,
      { headers: { "PRIVATE-TOKEN": env.GIT_CONTRIBUTION_TOKEN } }
    );

    if (!response.ok) {
      throw new Error(
        `GitLab calendar API responded ${response.status} ${response.statusText}`
      );
    }

    const calendar = parse(GitLabCalendarSchema, await response.json());

    return Object.entries(calendar).map(([date, count]) => ({ count, date }));
  }
);
