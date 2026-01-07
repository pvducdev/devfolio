import { createEnv } from "@t3-oss/env-core";
import { minLength, optional, pipe, string } from "valibot";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_APP_TITLE: optional(pipe(string(), minLength(1))),
    VITE_BASE_URL: optional(
      pipe(string(), minLength(1)),
      "http://localhost:3000"
    ),
    VITE_LOGTAIL_SOURCE_TOKEN: pipe(string(), minLength(1)),
    VITE_LOGTAIL_INGESTING_HOST: pipe(string(), minLength(1)),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
