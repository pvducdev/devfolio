import type { Skills } from "@/config/skills";
import SectionHeader from "../components/section-header";
import StandardCard from "../components/standard-card";

interface StandardsSectionProps {
  standards: Skills["standards"];
}

export default function StandardsSection({ standards }: StandardsSectionProps) {
  return (
    <section className="col-span-1 grid grid-cols-1 gap-7 border-border border-t pt-10 md:col-span-12 md:grid-cols-4">
      <div className="md:col-span-1">
        <SectionHeader
          className="mb-3 tracking-[0.2em]"
          number="04"
          title="Standards"
        />
        <p className="max-w-45 text-muted-foreground text-xs">
          Philosophy regarding performance, accessibility, and code quality.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-7 md:col-span-3 md:grid-cols-3">
        <StandardCard items={standards.performance} title="Web Performance" />
        <StandardCard
          items={standards.accessibility}
          title="Accessibility (A11y)"
        />
        <StandardCard items={standards.bestPractices} title="Best Practices" />
      </div>
    </section>
  );
}
