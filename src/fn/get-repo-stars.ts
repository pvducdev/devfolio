import { Octokit } from "@octokit/rest";
import { createServerFn } from "@tanstack/react-start";
import { env } from "std-env";

import { SITE_CONFIG } from "@/config/site";
import { getLogger } from "@/lib/logger/client";

const getRepoStars = createServerFn().handler(async () => {
  const octokit = new Octokit({
    auth: env.GITHUB_TOKEN,
    userAgent: SITE_CONFIG.title,
  });

  try {
    const { data } = await octokit.repos.get({
      owner: SITE_CONFIG.repository.owner,
      repo: SITE_CONFIG.repository.name,
    });

    return data.stargazers_count;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    getLogger().error("Failed to fetch repository stars", {
      error: message,
      owner: SITE_CONFIG.repository.owner,
      repo: SITE_CONFIG.repository.name,
    });

    return null;
  }
});

export default getRepoStars;
