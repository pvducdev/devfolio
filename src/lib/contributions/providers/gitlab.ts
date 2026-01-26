import { number, record, safeParse, string } from "valibot";
import { getLogger } from "@/lib/logger/client";
import type { ContributionProvider } from "../types";

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
    getLogger().error("GitLab calendar API error", {
      username,
      status: response.status,
      statusText: response.statusText,
    });
    return [];
  }

  const json = await response.json();
  const result = safeParse(GitLabCalendarSchema, json);

  if (!result.success) {
    return [];
  }

  const entries = Object.entries(result.output);

  return entries.map(([date, count]) => ({
    date,
    count,
  }));
};
