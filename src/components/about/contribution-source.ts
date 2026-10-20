import { PERSONAL_INFO } from "@/config/personal-info";

const extractUsername = (profileUrl: string): string => {
  const path = new URL(profileUrl).pathname;
  return path.slice(path.lastIndexOf("/") + 1);
};

export const CONTRIBUTIONS_CONFIG = {
  source: "GitLab",
  username: extractUsername(PERSONAL_INFO.contact.gitlab),
} as const;
