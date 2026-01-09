import { createEnv } from "@t3-oss/env-core";
import { minLength, optional, pipe, string } from "valibot";

export const env = createEnv({
  server: {
    LLM_API_KEY: pipe(string(), minLength(1)),
    GIT_CONTRIBUTION_TOKEN: optional(pipe(string(), minLength(1))),
    GITHUB_TOKEN: optional(pipe(string(), minLength(1))),
    LOGTAIL_SOURCE_TOKEN: pipe(string(), minLength(1)),
    LOGTAIL_INGESTING_HOST: pipe(string(), minLength(1)),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
