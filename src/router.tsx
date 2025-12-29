import { createRouter } from "@tanstack/react-router";
import ErrorPage from "@/components/common/error-page.tsx";
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
        actionLabel={page_error_action_home()}
        code="404"
        description={page_error_404_description()}
        showCode={false}
        title={page_error_404_title()}
      />
    ),
    defaultErrorComponent: ({ error, reset }) => (
      <ErrorPage
        actionLabel={page_error_action_retry()}
        code="500"
        description={error.message || page_error_generic_description()}
        onAction={reset}
        title={page_error_generic_title()}
      />
    ),
  });
