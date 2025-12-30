import { createRouter } from "@tanstack/react-router";
import ErrorPage from "@/components/common/error-page.tsx";
import { Error as ErrorIcon } from "@/components/ui/svgs/error";
import { NotFound } from "@/components/ui/svgs/not-found";
import {
  page_error_404_description,
  page_error_404_title,
  page_error_action_home,
  page_error_action_retry,
  page_error_generic_description,
  page_error_generic_title,
} from "@/paraglide/messages.js";
import { routeTree } from "./routeTree.gen.ts";

export const getRouter = () =>
  createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: Number.POSITIVE_INFINITY,
    defaultStaleTime: Number.POSITIVE_INFINITY,
    defaultNotFoundComponent: () => (
      <ErrorPage
        actionHref="/home"
        actionLabel={page_error_action_home()}
        description={page_error_404_description()}
        illustration={<NotFound className="h-64 w-auto text-foreground" />}
        title={page_error_404_title()}
      />
    ),
    defaultErrorComponent: ({ error, reset }) => (
      <ErrorPage
        actionLabel={page_error_action_retry()}
        description={error.message || page_error_generic_description()}
        illustration={<ErrorIcon className="h-64 w-auto text-foreground" />}
        onAction={reset}
        title={page_error_generic_title()}
      />
    ),
  });
