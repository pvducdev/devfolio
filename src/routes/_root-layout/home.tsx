import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import { ui_nav_home } from "@/paraglide/messages";
import { useActiveTabId } from "@/store/tabs";

export const Route = createFileRoute("/_root-layout/home")({
  head: () => ({
    meta: [{ title: `${ui_nav_home()} | ${SITE_CONFIG.title}` }],
    links: buildCanonicalLink(SITE_CONFIG.url),
  }),
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
