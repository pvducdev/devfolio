import type { ContributionSource } from "@/lib/contributions";
import { PERSONAL_INFO } from "./personal-info";

const SOURCE: ContributionSource = "GitLab";
const TRAILING_SLASH = /\/$/;

const extractUsername = (url: string): string =>
  url.replace(TRAILING_SLASH, "").split("/").at(-1) ?? "";

const USERNAME = extractUsername(PERSONAL_INFO.contact.gitlab);

export const CONTRIBUTIONS_CONFIG = {
  source: SOURCE,
  username: USERNAME,
} as const;

export type ContributionsConfig = typeof CONTRIBUTIONS_CONFIG;
