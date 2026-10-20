import { createServerFn } from "@tanstack/react-start";
import { number, object, parse } from "valibot";

import { SITE_CONFIG } from "@/config/site";
import { env } from "@/env/server";
import { cacheMiddleware } from "@/middleware/cache";

const RepoSchema = object({ stargazers_count: number() });

const getRepoStars = createServerFn()
  .middleware([cacheMiddleware])
  .handler(async () => {
    const { owner, name } = SITE_CONFIG.repository;
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${name}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(env.GITHUB_TOKEN && {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          }),
          "User-Agent": SITE_CONFIG.title,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `GitHub repo API responded ${response.status} ${response.statusText}`
      );
    }

    return parse(RepoSchema, await response.json()).stargazers_count;
  });

export default getRepoStars;
