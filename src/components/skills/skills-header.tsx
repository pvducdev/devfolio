import { page_skills_header_subtitle } from "@/paraglide/messages.js";

export default function SkillsHeader() {
  return (
    <header className="pointer-events-none absolute top-4 left-4 flex w-[calc(100%-2rem)] items-center justify-end text-background mix-blend-difference md:top-8 md:left-8 md:w-[calc(100%-4rem)]">
      <span className="hidden font-mono text-muted-foreground text-xs uppercase tracking-widest opacity-40 md:block">
        {page_skills_header_subtitle({ year: new Date().getFullYear() })}
      </span>
    </header>
  );
}
