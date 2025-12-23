import { SKILLS } from "@/config/skills";

export default function SkillsPage() {
  const skills = SKILLS;

  return (
    <div className="relative bg-background p-4 font-sans text-foreground selection:bg-foreground selection:text-background md:p-8 lg:p-12">
      <header className="pointer-events-none absolute top-4 left-4 flex w-[calc(100%-2rem)] items-center justify-end text-background mix-blend-difference md:top-8 md:left-8 md:w-[calc(100%-4rem)]">
        <span className="hidden font-mono text-muted-foreground text-xs uppercase tracking-widest opacity-40 md:block">
          My Skillet in {new Date().getFullYear()} and beyond.
        </span>
      </header>

      <main className="mx-auto mt-12 grid max-w-300 grid-cols-1 gap-x-7 gap-y-24 pb-24 md:mt-8 md:grid-cols-12">
        <section className="group/section col-span-1 flex flex-col gap-2 md:col-span-12 lg:col-span-10">
          <div className="mb-3 flex max-w-45 items-center gap-3 border-border border-b pb-1.5">
            <span className="font-bold font-mono text-muted-foreground text-xs">
              01
            </span>
            <span className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
              The Core
            </span>
          </div>

          {skills.core.map((skill, index) => (
            <div
              className={`group relative cursor-crosshair ${index > 0 ? "-mt-2 md:-mt-4 md:ml-[15%]" : ""}`}
              key={skill.name}
            >
              <h1 className="text-[10vw] leading-[0.85] tracking-[-0.05em] opacity-90 transition-opacity duration-500 group-hover/section:opacity-20 group-hover:opacity-100 group-hover/section:hover:opacity-100 md:text-[5rem] lg:text-[6rem]">
                {skill.name.toUpperCase()}
              </h1>
              <div
                className={`pointer-events-none absolute top-1/2 z-1 hidden translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block ${index === 0 ? "left-[25%]" : "right-[10%]"}`}
              >
                <div className="bg-foreground p-3 text-background shadow-xl">
                  <p className="mb-1.5 font-mono text-muted text-xs uppercase">
                    {skill.tag}
                  </p>
                  <p className="max-w-45 text-xs leading-tight">
                    {skill.details.join(", ")}.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="col-span-1 md:col-span-5 md:col-start-2 lg:col-span-4 lg:col-start-3">
          <div className="mb-6 flex items-center gap-3 border-border border-b pb-1.5">
            <span className="font-bold font-mono text-muted-foreground text-xs">
              02
            </span>
            <span className="font-bold text-muted-foreground text-xs uppercase tracking-[0.2em]">
              Stack
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {skills.stack.map((item) => (
              <div
                className="group flex cursor-default items-center justify-between border-transparent border-b pb-1.5 transition-all hover:border-border"
                key={item.name}
              >
                <h2 className="text-2xl text-foreground/80 transition-transform group-hover:translate-x-2 group-hover:text-foreground md:text-3xl">
                  {item.name}
                </h2>
                <span className="font-mono text-muted-foreground text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  [{item.tag}]
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-1 mt-0 md:col-span-3 md:col-start-9 md:mt-16 lg:col-start-10">
          <div className="mb-6 flex items-center justify-end gap-3 border-border border-b pb-1.5 md:justify-start">
            <span className="font-bold font-mono text-muted-foreground text-xs">
              03
            </span>
            <span className="font-bold text-muted-foreground text-xs uppercase tracking-[0.2em]">
              DevOps & Tools
            </span>
          </div>

          <ul className="flex flex-col gap-3.5 text-right font-mono text-muted-foreground text-xs md:text-left">
            {skills.devops.map((item) => (
              <li
                className="cursor-help transition-colors hover:text-foreground"
                key={item.name}
                title={item.tag}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="col-span-1 grid grid-cols-1 gap-7 border-border border-t pt-10 md:col-span-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-3 flex items-center gap-3">
              <span className="font-bold font-mono text-muted-foreground text-xs">
                04
              </span>
              <span className="font-bold text-muted-foreground text-xs uppercase tracking-[0.2em]">
                Standards
              </span>
            </div>
            <p className="max-w-45 text-muted-foreground text-xs">
              Philosophy regarding performance, accessibility, and code quality.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 md:col-span-3 md:grid-cols-3">
            <div className="bg-card/50 p-4 backdrop-blur-sm transition-colors duration-300 hover:bg-card">
              <h3 className="mb-1.5 text-base">Web Performance</h3>
              <ul className="space-y-0.5 font-mono text-muted-foreground text-xs">
                {skills.standards.performance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-card/50 p-4 backdrop-blur-sm transition-colors duration-300 hover:bg-card">
              <h3 className="mb-1.5 text-base">Accessibility (A11y)</h3>
              <ul className="space-y-0.5 font-mono text-muted-foreground text-xs">
                {skills.standards.accessibility.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-card/50 p-4 backdrop-blur-sm transition-colors duration-300 hover:bg-card">
              <h3 className="mb-1.5 text-base">Best Practices</h3>
              <ul className="space-y-0.5 font-mono text-muted-foreground text-xs">
                {skills.standards.bestPractices.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="col-span-1 pt-10 md:col-span-8 md:col-start-3 lg:col-start-4">
          <div className="mb-6 flex items-center gap-3">
            <span className="font-bold font-mono text-muted-foreground text-xs">
              05
            </span>
            <span className="font-bold text-muted-foreground text-xs uppercase tracking-[0.2em]">
              Workflow
            </span>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-4 font-light text-muted-foreground text-xl md:text-2xl">
            {skills.workflow.map((item) => (
              <span
                className={
                  item.highlighted ? "font-medium text-foreground" : ""
                }
                key={item.name}
              >
                {item.name}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="absolute bottom-4 left-4 z-1 md:left-8">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
            Currently Exploring
          </span>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-chart-3" />
            <span className="font-mono text-foreground text-xs">
              {skills.exploring.join(" / ")}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
