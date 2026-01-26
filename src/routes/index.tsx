import {
  createFileRoute,
  useHydrated,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { ROUTES } from "@/config/routes";
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

    navigate({ to: activeTabId ?? ROUTES.HOME, replace: true });
  }, [activeTabId, hasHydrated, navigate]);

  return null;
}
