import { createEnv } from "@t3-oss/env-core";
import { minLength, optional, pipe, string } from "valibot";

export const env = createEnv({
  server: {
    GEMINI_API_KEY: pipe(string(), minLength(1)),
    GIT_CONTRIBUTION_TOKEN: optional(pipe(string(), minLength(1))),
    LOGTAIL_SOURCE_TOKEN: pipe(string(), minLength(1)),
    LOGTAIL_ENDPOINT: pipe(string(), minLength(1)),
  },

  clientPrefix: "VITE_",

  client: {
    VITE_APP_TITLE: optional(pipe(string(), minLength(1))),
    VITE_BASE_URL: optional(
      pipe(string(), minLength(1)),
      "http://localhost:3000"
    ),
    VITE_LOGTAIL_SOURCE_TOKEN: pipe(string(), minLength(1)),
    VITE_LOGTAIL_ENDPOINT: pipe(string(), minLength(1)),
  },

  runtimeEnv: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GIT_CONTRIBUTION_TOKEN: process.env.GIT_CONTRIBUTION_TOKEN,
    LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN,
    LOGTAIL_ENDPOINT: process.env.LOGTAIL_ENDPOINT,
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
    VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
    VITE_LOGTAIL_SOURCE_TOKEN: import.meta.env.VITE_LOGTAIL_SOURCE_TOKEN,
    VITE_LOGTAIL_ENDPOINT: import.meta.env.VITE_LOGTAIL_ENDPOINT,
  },

  emptyStringAsUndefined: true,
});
