import {
  createFileRoute,
  useHydrated,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { useActiveTabId } from "@/components/tabs/store";
import { isMobile } from "@/lib/browser";
import { MOBILE_ROUTES, ROUTES } from "@/lib/routes";

const IndexRedirect = () => {
  const navigate = useNavigate();
  const activeTabId = useActiveTabId();
  const hasHydrated = useHydrated();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const target = isMobile()
      ? MOBILE_ROUTES.HOME
      : (activeTabId ?? ROUTES.HOME);
    navigate({ replace: true, to: target });
  }, [activeTabId, hasHydrated, navigate]);

  return null;
};

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});
