import { cn } from "cn";

import type { Skills } from "@/config/skills";

import SectionHeader from "./section-header";

interface WorkflowWrapProps {
  items: Skills["workflow"];
}

export default function WorkflowWrap({ items }: WorkflowWrapProps) {
  return (
    <section className="[content-visibility:auto]">
      <SectionHeader section="workflow" />
      <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2.5">
        {items.map((item, index) => (
          <span className="flex items-baseline gap-4" key={item.name}>
            <span
              className={cn(
                "text-sm",
                item.highlighted
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </span>
            {index < items.length - 1 ? (
              <span className="text-border text-xs">·</span>
            ) : null}
          </span>
        ))}
      </div>
    </section>
  );
}
