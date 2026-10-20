import { Fragment } from "react";

import { PERSONAL_INFO, SOCIAL_LINKS } from "@/config/personal-info";
import {
  page_about_aria_social,
  page_about_avatar_alt,
} from "@/paraglide/messages.js";

import ContributionSection from "./contribution-section";

export default function AboutPage() {
  return (
    <main className="z-10 min-h-screen">
      <article className="mx-auto max-w-4xl space-y-10 py-8 text-center">
        <div className="mx-auto size-32 rounded-full border-2 border-border bg-transparent">
          <img
            alt={page_about_avatar_alt()}
            className="-mt-12 size-42 rounded-full object-cover"
            height={128}
            src={PERSONAL_INFO.avatar}
            width={128}
          />
        </div>

        <section className="mx-auto space-y-2">
          <h1>{PERSONAL_INFO.name}</h1>
          <div className="mx-auto max-w-md border-border border-y-2 py-3">
            <p className="font-medium">{PERSONAL_INFO.role}</p>
            <p className="text-muted-foreground text-sm">
              {PERSONAL_INFO.location}
            </p>
          </div>
        </section>

        <section className="mx-auto space-y-2">
          <nav
            aria-label={page_about_aria_social()}
            className="flex justify-center space-x-4 text-sm"
          >
            {SOCIAL_LINKS.map((link, index) => (
              <Fragment key={link.label}>
                {index > 0 && <span aria-hidden="true">·</span>}
                <a
                  className="hover:underline"
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              </Fragment>
            ))}
          </nav>

          <div className="text-muted-foreground text-sm">
            <a
              className="hover:underline"
              href={`mailto:${PERSONAL_INFO.contact.email}`}
            >
              {PERSONAL_INFO.contact.email}
            </a>
          </div>
        </section>

        <blockquote className="mx-auto max-w-2xl border-border border-y-2 border-l-0 py-4 font-serif">
          {PERSONAL_INFO.bio}
        </blockquote>

        <ContributionSection />
      </article>
    </main>
  );
}
