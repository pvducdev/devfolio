import { Logtail as BrowserLogtail } from "@logtail/browser";
import { Logtail as EdgeLogtail } from "@logtail/edge";
import { createIsomorphicFn } from "@tanstack/react-start";
import { env as clientEnv } from "@/env/client";
import { env as serverEnv } from "@/env/server";

export const getLogger = createIsomorphicFn()
  // biome-ignore lint/suspicious/noExplicitAny: <safe>
  .server((ctx?: any) => {
    const logger = new EdgeLogtail(serverEnv.LOGTAIL_SOURCE_TOKEN, {
      endpoint: `https://${serverEnv.LOGTAIL_INGESTING_HOST}`,
    });

    if (ctx) {
      logger.withExecutionContext(ctx);
    }

    return logger;
  })
  .client(
    () =>
      new BrowserLogtail(clientEnv.VITE_LOGTAIL_SOURCE_TOKEN, {
        endpoint: `https://${clientEnv.VITE_LOGTAIL_INGESTING_HOST}`,
      })
  );
