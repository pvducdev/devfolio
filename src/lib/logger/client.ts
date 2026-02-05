import { Logtail as BrowserLogtail } from "@logtail/browser";
import { Logtail as EdgeLogtail } from "@logtail/edge";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getStartContext } from "@tanstack/start-storage-context";
import { env as clientEnv } from "@/env/client";
import { env as serverEnv } from "@/env/server";

export const getLogger = createIsomorphicFn()
  .server(() => {
    const logger = new EdgeLogtail(serverEnv.LOGTAIL_SOURCE_TOKEN, {
      endpoint: `https://${serverEnv.LOGTAIL_INGESTING_HOST}`,
    });

    const startContext = getStartContext({ throwIfNotFound: false });
    const ctx = startContext?.contextAfterGlobalMiddlewares?.ctx;

    return ctx ? logger.withExecutionContext(ctx) : logger;
  })
  .client(
    () =>
      new BrowserLogtail(clientEnv.VITE_LOGTAIL_SOURCE_TOKEN, {
        endpoint: `https://${clientEnv.VITE_LOGTAIL_INGESTING_HOST}`,
      })
  );
