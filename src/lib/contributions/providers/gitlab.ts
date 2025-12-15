import { number, record, safeParse, string } from "valibot";
import type { ContributionProvider } from "../types";
import { calculateContributionLevel } from "../utils";

const GitLabCalendarSchema = record(string(), number());

export const gitlabProvider: ContributionProvider = async (username, token) => {
  if (!token) {
    return [];
  }

  const response = await fetch(
    `https://gitlab.com/users/${encodeURIComponent(username)}/calendar.json`,
    { headers: { "PRIVATE-TOKEN": token } }
  );

  if (!response.ok) {
    console.error(`GitLab calendar API error: ${response.status}`);
    return [];
  }

  const json = await response.json();
  const result = safeParse(GitLabCalendarSchema, json);

  if (!result.success) {
    console.error("GitLab calendar validation failed:", result.issues);
    return [];
  }

  const entries = Object.entries(result.output);
  const maxCount = Math.max(...entries.map(([, count]) => count), 1);

  return entries.map(([date, count]) => ({
    date,
    count,
    level: calculateContributionLevel(count / maxCount),
  }));
};
