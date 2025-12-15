import { useEffect, useState } from "react";
import { ABOUT } from "@/config/about";
import { PERSONAL_INFO } from "@/config/personal-info";
import fetchContributionsServer from "@/fn/fetch-contributions";
import type { ContributionData } from "@/lib/contributions";
import { page_portfolio_header } from "@/paraglide/messages.js";

export default function AboutPage() {
  const [_, setContributions] = useState<ContributionData[]>([]);

  useEffect(() => {
    fetchContributionsServer({ data: {} })
      .then(setContributions)
      .catch(() => setContributions([]));
  }, []);

  return (
    <div className="relative min-h-screen">
      <main className="relative z-10">
        <article className="space-y-6 py-8 text-center">
          <header className="inline-block">
            <div className="rounded-lg bg-linear-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 px-8 py-3 backdrop-blur-sm">
              <span className="font-medium text-sm tracking-wider">
                {page_portfolio_header()}
              </span>
            </div>
          </header>

          <div className="flex justify-center">
            <div
              aria-label="Developer profile avatar"
              className="flex size-32 items-center justify-center rounded-full border-2 border-gray-300 text-6xl dark:border-gray-700"
              role="img"
            >
              👨‍💻
            </div>
          </div>

          <section className="space-y-2">
            <h1 className="font-bold text-4xl tracking-tight">
              {PERSONAL_INFO.name}
            </h1>
            <div className="mx-auto max-w-md border-gray-300 border-y-2 py-3 dark:border-gray-700">
              <p className="font-medium">
                {PERSONAL_INFO.role} · {PERSONAL_INFO.location}
              </p>
              <p className="text-gray-600 text-sm dark:text-gray-400">
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

          <div className="text-gray-600 text-sm dark:text-gray-400">
            <a
              className="hover:underline"
              href={`mailto:${PERSONAL_INFO.contact.email}`}
            >
              {PERSONAL_INFO.contact.email}
            </a>
          </div>

          <blockquote className="mx-auto max-w-2xl border-gray-300 border-y py-4 dark:border-gray-700">
            <p className="text-base italic">{ABOUT.shortBio}</p>
          </blockquote>
        </article>
      </main>
    </div>
  );
}
