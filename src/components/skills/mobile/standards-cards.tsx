import type { Skills } from "@/config/skills";
import { skills_standards_desc } from "@/paraglide/messages";

import { STANDARD_CARDS } from "../config";
import SectionHeader from "./section-header";

interface StandardsCardsProps {
  standards: Skills["standards"];
}

export default function StandardsCards({ standards }: StandardsCardsProps) {
  return (
    <section className="[content-visibility:auto]">
      <SectionHeader section="standards" />
      <p className="mt-3 text-muted-foreground/70 text-xs">
        {skills_standards_desc()}
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
