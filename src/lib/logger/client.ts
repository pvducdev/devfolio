import { Logtail as BrowserLogtail } from "@logtail/browser";
import { Logtail as NodeLogtail } from "@logtail/node";
import { createIsomorphicFn } from "@tanstack/react-start";
import { env as clientEnv } from "@/env/client";
import { env as serverEnv } from "@/env/server";

export const getLogger = createIsomorphicFn()
  .server(
    () =>
      new NodeLogtail(serverEnv.LOGTAIL_SOURCE_TOKEN, {
        endpoint: `https://${serverEnv.LOGTAIL_INGESTING_HOST}`,
      })
  )
  .client(
    () =>
      new BrowserLogtail(clientEnv.VITE_LOGTAIL_SOURCE_TOKEN, {
        endpoint: `https://${clientEnv.VITE_LOGTAIL_INGESTING_HOST}`,
      })
  );
