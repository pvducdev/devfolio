import {
  mobile_skills_eof,
  mobile_skills_section_exploring,
} from "@/paraglide/messages";
import SectionHeader from "./section-header";

interface ExploringFooterProps {
  items: string[];
}

export default function ExploringFooter({ items }: ExploringFooterProps) {
  return (
    <section className="[content-visibility:auto]">
      <SectionHeader number="06" title={mobile_skills_section_exploring()} />
      <div className="mt-5 flex items-center gap-2">
        <span className="size-1.5 animate-pulse rounded-full bg-chart-3" />
        <span className="font-mono text-foreground text-xs">
          {items.join(" / ")}
        </span>
      </div>
      <p className="mt-10 font-mono text-muted-foreground/50 text-xs">
        {mobile_skills_eof()}
      </p>
    </section>
  );
}
