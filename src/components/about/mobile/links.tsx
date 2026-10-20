import { PERSONAL_INFO, SOCIAL_LINKS } from "@/config/personal-info";
import {
  mobile_about_email_label,
  mobile_about_links_label,
} from "@/paraglide/messages";

const LINKS = [
  ...SOCIAL_LINKS,
  {
    href: `mailto:${PERSONAL_INFO.contact.email}`,
    label: mobile_about_email_label(),
  },
];

export default function AboutLinks() {
  return (
    <div className="mt-6">
      <p className="text-muted-foreground text-xs">
        {mobile_about_links_label()}
      </p>
      <p className="text-muted-foreground text-xs">------</p>
      <div className="mt-1 space-y-2">
        {LINKS.map((link) => (
          <a
            className="block text-foreground text-sm active:text-muted-foreground"
            href={link.href}
            key={link.label}
            rel="noopener noreferrer"
            target="_blank"
          >
            {">"} {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
