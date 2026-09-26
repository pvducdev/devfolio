import { createFileRoute } from "@tanstack/react-router";

import { DOCK_BUTTONS } from "@/config/mobile-dock";
import { PERSONAL_INFO } from "@/config/personal-info";
import { MOBILE_ROUTES } from "@/config/routes";
import { buildPageHead } from "@/config/seo";
import {
  mobile_home_current_dir,
  mobile_home_greeting,
  mobile_home_hint,
  ui_nav_home,
} from "@/paraglide/messages";

const MobileHome = () => {
  const listings = DOCK_BUTTONS[MOBILE_ROUTES.HOME].filter(
    (button) => button.listing
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
};

export const Route = createFileRoute("/m/home")({
  component: MobileHome,
  head: () => buildPageHead("", ui_nav_home()),
});
