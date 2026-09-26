import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useActiveTabId } from "@/components/tabs/store";
import { buildPageHead } from "@/config/seo";
import { ui_nav_home } from "@/paraglide/messages";

const HomeRedirect = () => {
  const navigate = useNavigate();
  const activeTabId = useActiveTabId();

  useEffect(() => {
    if (activeTabId) {
      navigate({ replace: true, to: activeTabId });
    }
  }, [activeTabId, navigate]);

  return null;
};

export const Route = createFileRoute("/_root-layout/home")({
  component: HomeRedirect,
  head: () => buildPageHead("", ui_nav_home()),
});
