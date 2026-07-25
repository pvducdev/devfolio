import type { Skills } from "@/config/skills";
import { mobile_skills_section_stack } from "@/paraglide/messages";

import SectionHeader from "./section-header";

interface StackListProps {
  items: Skills["stack"];
}

export default function StackList({ items }: StackListProps) {
  return (
    <section className="[content-visibility:auto]">
      <SectionHeader number="02" title={mobile_skills_section_stack()} />
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div className="flex items-baseline gap-2" key={item.name}>
            <span className="text-foreground text-sm">{item.name}</span>
            <span className="flex-1 border-border border-b border-dashed" />
            <span className="font-mono text-muted-foreground text-xs">
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
