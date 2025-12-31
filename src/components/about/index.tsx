import { PERSONAL_INFO } from "@/config/personal-info";
import { page_portfolio_header } from "@/paraglide/messages.js";

import ContributionSection from "./contribution-section";

export default function AboutPage() {
  return (
    <main className="z-10 min-h-screen">
      <article className="mx-auto max-w-4xl space-y-6 py-8 text-center">
        <header className="inline-block">
          <div className="rounded-lg bg-linear-to-br from-primary/10 via-accent/10 to-secondary/10 px-8 py-3 backdrop-blur-sm">
            <span className="font-medium text-sm tracking-wider">
              {page_portfolio_header()}
            </span>
          </div>
        </header>

        <div className="flex justify-center">
          <div
            aria-label="Developer profile avatar"
            className="flex size-32 items-center justify-center rounded-full border-2 border-border text-6xl"
            role="img"
          >
            👨‍💻
          </div>
        </div>

        <section className="space-y-2">
          <h1>{PERSONAL_INFO.name}</h1>
          <div className="mx-auto max-w-md border-border border-y-2 py-3">
            <p className="font-medium">
              {PERSONAL_INFO.role} · {PERSONAL_INFO.location}
            </p>
            <p className="text-muted-foreground text-sm">
              Age {new Date().getFullYear() - PERSONAL_INFO.dob}
            </p>
          </div>
        </section>

        <nav
          aria-label="Social media links"
          className="flex justify-center gap-4 text-sm"
        >
          <a
            className="hover:underline"
            href={PERSONAL_INFO.contact.linkedin}
            rel="noopener noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
          <span aria-hidden="true">·</span>
          <a
            className="hover:underline"
            href={PERSONAL_INFO.contact.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <span aria-hidden="true">·</span>
          <a
            className="hover:underline"
            href={PERSONAL_INFO.contact.gitlab}
            rel="noopener noreferrer"
            target="_blank"
          >
            GitLab
          </a>
        </nav>

        <div className="text-muted-foreground text-sm">
          <a
            className="hover:underline"
            href={`mailto:${PERSONAL_INFO.contact.email}`}
          >
            {PERSONAL_INFO.contact.email}
          </a>
        </div>

        <blockquote className="mx-auto max-w-2xl border-border border-y-2 border-l-0 py-4 font-serif">
          {PERSONAL_INFO.shortBio}
        </blockquote>

        <ContributionSection />
      </article>
    </main>
  );
}
