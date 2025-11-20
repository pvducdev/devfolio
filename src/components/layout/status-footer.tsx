import ThemeSwitcher from "@/components/theme-switcher.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Gitlab } from "@/components/ui/svgs/gitlab";
import { Linkedin } from "@/components/ui/svgs/linkedin";
import { PERSONAL_INFO } from "@/config/personal.ts";
import { SITE_CONFIG } from "@/config/site.ts";
import { Badge } from "../ui/badge";

export default function StatusFooter() {
  return (
    <footer className="flex h-6 w-full items-center justify-between bg-sidebar px-3">
      <Breadcrumb>
        <BreadcrumbList className="gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink className="text-muted-foreground text-xs" href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground text-xs">
              Welcome
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center space-x-4">
        {SITE_CONFIG.features.showThemeSwitcher && <ThemeSwitcher />}
        <div className="flex items-center space-x-2">
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
        <Badge
          className="rounded-full border-green-500! text-green-500"
          variant="outline"
        >
          Open to work
        </Badge>
      </div>
    </footer>
  );
}
