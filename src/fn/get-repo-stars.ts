import { Octokit } from "@octokit/rest";
import { createServerFn } from "@tanstack/react-start";
import { SITE_CONFIG } from "@/config/site";
import { env } from "@/env/server";

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
  } catch {
    return null;
  }
});

export default getRepoStars;
