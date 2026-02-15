import type { Skills } from "@/config/skills";
import {
  mobile_skills_section_standards,
  mobile_skills_standards_a11y,
  mobile_skills_standards_best_practices,
  mobile_skills_standards_desc,
  mobile_skills_standards_performance,
} from "@/paraglide/messages";
import SectionHeader from "./section-header";

interface StandardsCardsProps {
  standards: Skills["standards"];
}

const STANDARD_CARDS = [
  { key: "performance" as const, label: mobile_skills_standards_performance },
  { key: "accessibility" as const, label: mobile_skills_standards_a11y },
  {
    key: "bestPractices" as const,
    label: mobile_skills_standards_best_practices,
  },
];

export default function StandardsCards({ standards }: StandardsCardsProps) {
  return (
    <section className="[content-visibility:auto]">
      <SectionHeader number="04" title={mobile_skills_section_standards()} />
      <p className="mt-3 text-muted-foreground/70 text-xs">
        {mobile_skills_standards_desc()}
      </p>
      <div className="mt-4 space-y-3">
        {STANDARD_CARDS.map((card) => (
          <div
            className="border border-border border-dashed p-4"
            key={card.key}
          >
            <h3 className="text-foreground text-sm">{card.label()}</h3>
            <ul className="mt-2 ml-0 list-none space-y-1">
              {standards[card.key].map((item) => (
                <li
                  className="font-mono text-muted-foreground text-xs"
                  key={item}
                >
                  {">"} {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
