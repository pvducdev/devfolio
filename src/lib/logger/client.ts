import { Logtail as BrowserLogtail } from "@logtail/browser";
import { Logtail as NodeLogtail } from "@logtail/node";
import { createIsomorphicFn } from "@tanstack/react-start";
import { env } from "@/env";

export const getLogger = createIsomorphicFn()
  .server(
    () =>
      new NodeLogtail(env.LOGTAIL_SOURCE_TOKEN, {
        endpoint: env.LOGTAIL_ENDPOINT,
      })
  )
  .client(
    () =>
      new BrowserLogtail(env.VITE_LOGTAIL_SOURCE_TOKEN, {
        endpoint: env.VITE_LOGTAIL_ENDPOINT,
      })
  );
