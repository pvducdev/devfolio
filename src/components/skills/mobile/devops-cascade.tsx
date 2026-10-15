import type { Skills } from "@/config/skills";

import SectionHeader from "./section-header";

interface DevopsCascadeProps {
  items: Skills["devops"];
}

export default function DevopsCascade({ items }: DevopsCascadeProps) {
  return (
    <section className="[content-visibility:auto]">
      <SectionHeader section="devops" />
      <div className="mt-5 space-y-3 text-right">
        {items.map((item) => (
          <p
            className="font-mono text-xs transition-colors active:text-foreground"
            key={item.name}
          >
            <span className="text-muted-foreground/50">{item.tag}</span>
            <span className="mx-2 text-border">·</span>
            <span className="text-muted-foreground">{item.name}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
