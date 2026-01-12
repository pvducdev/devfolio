import { Gitlab } from "@/components/ui/svgs/gitlab.tsx";
import { Linkedin } from "@/components/ui/svgs/linkedin.tsx";
import WelcomeActivity from "@/components/welcome/activity.tsx";
import { PERSONAL_INFO } from "@/config/personal-info.ts";
import { activities } from "@/config/routes.ts";
import { SITE_CONFIG } from "@/config/site.ts";
import { page_welcome_desc, page_welcome_title } from "@/paraglide/messages.js";

export default function WelcomeContainer() {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-3">
          {page_welcome_title()}{" "}
          <span className="text-primary">{SITE_CONFIG.title}</span>
        </h1>
        <p className="mb-10 font-serif text-muted-foreground leading-relaxed">
          {PERSONAL_INFO.bio}
        </p>

        <div className="mb-8 grid gap-3">
          {activities.map((act) => (
            <WelcomeActivity data={act} key={act.key} />
          ))}
        </div>

        <div className="mx-auto my-6 w-48 border-border border-t" />

        <div className="flex justify-center space-x-5 text-muted-foreground">
          <a
            className="transition-colors hover:text-[#FC6D26]"
            href={PERSONAL_INFO.contact.gitlab}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Gitlab className="size-6 [&>path]:fill-current" />
          </a>
          <a
            className="transition-colors hover:text-[#0A66C2]"
            href={PERSONAL_INFO.contact.linkedin}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Linkedin className="size-6 [&>path]:fill-current" />
          </a>
        </div>

        <p className="mt-10 text-muted-foreground text-xs">
          {page_welcome_desc({ highlight: "WebStorm" })}
        </p>
      </div>
    </div>
  );
}
