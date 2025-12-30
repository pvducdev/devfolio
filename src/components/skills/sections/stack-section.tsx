import type { Skills } from "@/config/skills";
import SectionHeader from "../components/section-header";
import StackItem from "../components/stack-item";

interface StackSectionProps {
  items: Skills["stack"];
}

export default function StackSection({ items }: StackSectionProps) {
  return (
    <section className="col-span-1 md:col-span-5 md:col-start-2 lg:col-span-4 lg:col-start-3">
      <SectionHeader
        className="mb-6 tracking-[0.2em]"
        number="02"
        title="Stack"
      />
      <div className="grid grid-cols-1 gap-5">
        {items.map((item) => (
          <StackItem key={item.name} name={item.name} tag={item.tag} />
        ))}
      </div>
    </section>
  );
}
