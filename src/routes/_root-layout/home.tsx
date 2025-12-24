import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useActiveTabId } from "@/store/tabs";

export const Route = createFileRoute("/_root-layout/home")({
  component: HomeRedirect,
});

function HomeRedirect() {
  const navigate = useNavigate();
  const activeTabId = useActiveTabId();

  useEffect(() => {
    if (activeTabId) {
      navigate({ to: activeTabId, replace: true });
    }
  }, [activeTabId, navigate]);

  return null;
}
