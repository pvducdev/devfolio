import { TextLoop } from "@/components/ui/text-loop";
import type { Skills } from "@/config/skills";
import { mobile_skills_section_core } from "@/paraglide/messages";

import SectionHeader from "./section-header";

interface CoreHeroProps {
  skills: Skills["core"];
}

const textLoopTransition = {
  damping: 80,
  mass: 10,
  stiffness: 900,
  type: "spring" as const,
};

const textLoopVariants = {
  animate: {
    filter: "blur(0px)",
    opacity: 1,
    rotateX: 0,
    y: 0,
  },
  exit: {
    filter: "blur(4px)",
    opacity: 0,
    rotateX: -90,
    y: -20,
  },
  initial: {
    filter: "blur(4px)",
    opacity: 0,
    rotateX: 90,
    y: 20,
  },
};

export default function CoreHero({ skills }: CoreHeroProps) {
  const [primary, secondary] = skills;
  const alternates = "alternates" in primary ? (primary.alternates ?? []) : [];
  const hasAlternates = alternates.length > 0;
  const displayNames = hasAlternates
    ? [primary.name, ...alternates]
    : [primary.name];

  return (
    <section>
      <SectionHeader number="01" title={mobile_skills_section_core()} />
      <div className="mt-6">
        <div>
          <h1 className="font-bold text-5xl leading-none tracking-tighter">
            {hasAlternates ? (
              <TextLoop
                className="overflow-y-clip"
                transition={textLoopTransition}
                variants={textLoopVariants}
              >
                {displayNames.map((name) => (
                  <span key={name}>{name.toUpperCase()}</span>
                ))}
              </TextLoop>
            ) : (
              primary.name.toUpperCase()
            )}
          </h1>
          <p className="mt-2 font-mono text-muted-foreground text-xs uppercase tracking-wide">
            {primary.tag}
          </p>
          <p className="mt-1 text-muted-foreground/70 text-xs">
            {primary.details.join(", ")}
          </p>
        </div>

        <div className="mt-5 ml-[15%]">
          <h1 className="font-bold text-5xl leading-none tracking-tighter">
            {secondary.name.toUpperCase()}
          </h1>
          <p className="mt-2 font-mono text-muted-foreground text-xs uppercase tracking-wide">
            {secondary.tag}
          </p>
          <p className="mt-1 text-muted-foreground/70 text-xs">
            {secondary.details.join(", ")}
          </p>
        </div>
      </div>
    </section>
  );
}
