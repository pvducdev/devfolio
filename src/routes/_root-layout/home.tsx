import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { ui_nav_home } from "@/paraglide/messages";
import { useActiveTabId } from "@/store/tabs";

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
  head: () => ({
    links: buildCanonicalLink(SITE_CONFIG.url),
    meta: [{ title: `${ui_nav_home()} | ${SITE_CONFIG.title}` }],
  }),
});
