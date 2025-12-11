import ThemeSwitcher from "@/components/theme/theme-switcher.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GithubLight } from "@/components/ui/svgs/githubLight.tsx";
import { Gitlab } from "@/components/ui/svgs/gitlab";
import { Linkedin } from "@/components/ui/svgs/linkedin";
import { PERSONAL_INFO } from "@/config/personal-info.ts";
import { SITE_CONFIG } from "@/config/site.ts";
import {
  label_status_hired,
  label_status_opentowork,
  ui_nav_home,
} from "@/paraglide/messages.js";
import { Badge } from "../ui/badge";

export default function StatusFooter() {
  return (
    <footer className="flex h-6 w-full items-center justify-between bg-sidebar px-3">
      <Breadcrumb>
        <BreadcrumbList className="gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink className="text-muted-foreground text-xs">
              /
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground text-xs">
              {ui_nav_home()}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center space-x-4">
        {!!SITE_CONFIG.features.showThemeSwitcher && <ThemeSwitcher />}
        <div className="flex items-center space-x-2">
          <a
            href={PERSONAL_INFO.contact.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubLight className="size-3 text-muted-foreground [&>path]:fill-current" />
          </a>
          <a
            href={PERSONAL_INFO.contact.gitlab}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Gitlab className="size-3 text-muted-foreground [&>path]:fill-current" />
          </a>
          <a
            href={PERSONAL_INFO.contact.linkedin}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Linkedin className="size-3 text-muted-foreground [&>path]:fill-current" />
          </a>
        </div>
        <small className="text-muted-foreground text-xs leading-none">
          {PERSONAL_INFO.location}
        </small>
        {PERSONAL_INFO.openToWork ? (
          <Badge
            className="rounded-full border-green-500! text-green-500"
            variant="outline"
          >
            {label_status_opentowork()}
          </Badge>
        ) : (
          <Badge className="rounded-full" variant="outline">
            {label_status_hired()}
          </Badge>
        )}
      </div>
    </footer>
  );
}
