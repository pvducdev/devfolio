import { createFileRoute } from "@tanstack/react-router";

import { DOCK_BUTTONS } from "@/config/mobile-dock";
import { PERSONAL_INFO } from "@/config/personal-info";
import { MOBILE_ROUTES } from "@/config/routes";
import { buildCanonicalLink } from "@/config/seo";
import { SITE_CONFIG } from "@/config/site";
import {
  mobile_home_current_dir,
  mobile_home_greeting,
  mobile_home_hint,
  ui_nav_home,
} from "@/paraglide/messages";

export const Route = createFileRoute("/m/home")({
  component: MobileHome,
  head: () => ({
    links: buildCanonicalLink(SITE_CONFIG.url),
    meta: [{ title: `${ui_nav_home()} | ${SITE_CONFIG.title}` }],
  }),
});

function MobileHome() {
  const listings = DOCK_BUTTONS[MOBILE_ROUTES.HOME].buttons.filter(
    (b) => b.listing
  );

  return (
    <div className="py-6">
      <div className="mt-4 space-y-1">
        <p className="font-bold text-foreground text-lg">
          {mobile_home_greeting({ name: PERSONAL_INFO.name })}
        </p>
        <p className="text-muted-foreground text-sm">{PERSONAL_INFO.role}</p>
      </div>

      <p className="mt-6 text-muted-foreground text-xs">
        {mobile_home_current_dir()}
      </p>
      <div className="mt-2 space-y-1 rounded-md border border-dashed p-2 text-muted-foreground text-xs">
        {listings.map((button) => (
          <p key={button.id}>{button.listing}</p>
        ))}
      </div>

      <p className="mt-4 text-center text-muted-foreground/60 text-xs">
        {mobile_home_hint()}
      </p>
    </div>
  );
}
