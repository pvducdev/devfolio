import { createEnv } from "@t3-oss/env-core";
import {
  type BaseIssue,
  type BaseSchema,
  minLength,
  object,
  optional,
  parse,
  pipe,
  string,
} from "valibot";

export const env = createEnv({
  server: {
    GEMINI_API_KEY: pipe(string(), minLength(1)),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "VITE_",

  client: {
    VITE_APP_TITLE: optional(pipe(string(), minLength(1))),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), the validator will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,

  /**
   * Create a schema factory that returns a standard schema interface
   * compatible with @t3-oss/env-core
   */
  createFinalSchema: <TSchema extends Record<string, BaseSchema>>(
    schema: TSchema
  ) => ({
    "~standard": {
      version: 1,
      vendor: "valibot",
      validate: (data: unknown) => {
        try {
          const result = parse(object(schema), data);
          return {
            value: result,
            issues: undefined,
          };
        } catch (error) {
          return {
            issues: (error as { issues?: BaseIssue[] }).issues,
          };
        }
      },
    } as const,
  }),
});
