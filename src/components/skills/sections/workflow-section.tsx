import type { Skills } from "@/config/skills";
import { cn } from "@/lib/utils";
import SectionHeader from "../components/section-header";

interface WorkflowSectionProps {
  items: Skills["workflow"];
}

export default function WorkflowSection({ items }: WorkflowSectionProps) {
  return (
    <section className="col-span-1 pt-10 md:col-span-8 md:col-start-3 lg:col-start-4">
      <SectionHeader
        className="mb-6 tracking-[0.2em]"
        number="05"
        title="Workflow"
      />
      <div className="flex flex-wrap gap-x-10 gap-y-4 font-light text-muted-foreground text-xl">
        {items.map((item) => (
          <span
            className={cn(item.highlighted && "font-medium text-foreground")}
            key={item.name}
          >
            {item.name}
          </span>
        ))}
      </div>
    </section>
  );
}
