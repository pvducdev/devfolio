import {
  createFileRoute,
  useHydrated,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { MOBILE_ROUTES, ROUTES } from "@/config/routes";
import { isMobile } from "@/lib/browser";
import { useActiveTabId } from "@/store/tabs";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
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
    navigate({ to: target, replace: true });
  }, [activeTabId, hasHydrated, navigate]);

  return null;
}
