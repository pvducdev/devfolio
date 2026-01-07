import { Octokit } from "@octokit/rest";
import { createServerFn } from "@tanstack/react-start";
import { env } from "std-env";
import { SITE_CONFIG } from "@/config/site";
import { getLogger } from "@/lib/logger/client.ts";

const getRepoStars = createServerFn().handler(async () => {
  const octokit = new Octokit({
    userAgent: SITE_CONFIG.title,
    auth: env.GITHUB_TOKEN,
  });

  try {
    const { data } = await octokit.repos.get({
      owner: SITE_CONFIG.repository.owner,
      repo: SITE_CONFIG.repository.name,
    });

    return data.stargazers_count;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    getLogger().error(message);

    return null;
  }
});

export default getRepoStars;
