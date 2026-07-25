import { PERSONAL_INFO } from "@/config/personal-info";
import { mobile_about_links_label } from "@/paraglide/messages";

const SOCIAL_LINKS = [
  { href: PERSONAL_INFO.contact.linkedin, label: "LinkedIn" },
  { href: PERSONAL_INFO.contact.github, label: "GitHub" },
  { href: PERSONAL_INFO.contact.gitlab, label: "GitLab" },
  { href: `mailto:${PERSONAL_INFO.contact.email}`, label: "Email" },
];

export default function AboutLinks() {
  return (
    <div className="mt-6">
      <p className="text-muted-foreground text-xs">
        {mobile_about_links_label()}
      </p>
      <p className="text-muted-foreground text-xs">------</p>
      <div className="mt-1 space-y-2">
        {SOCIAL_LINKS.map((link) => (
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
