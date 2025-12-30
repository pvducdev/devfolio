import type { Skills } from "@/config/skills";
import SectionHeader from "../components/section-header";

interface DevOpsSectionProps {
  items: Skills["devops"];
}

export default function DevOpsSection({ items }: DevOpsSectionProps) {
  return (
    <section className="col-span-1 mt-0 md:col-span-3 md:col-start-9 md:mt-16 lg:col-start-10">
      <SectionHeader
        align="right"
        className="mb-6 tracking-[0.2em]"
        number="03"
        title="DevOps & Tools"
      />
      <ul className="flex flex-col gap-3.5 text-right font-mono text-muted-foreground text-xs md:text-left">
        {items.map((item) => (
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
  );
}
