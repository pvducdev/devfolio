import SectionHeader from "@/components/skills/components/section-header.tsx";

interface ExploringFooterProps {
  items: string[];
}

export default function ExploringSection({ items }: ExploringFooterProps) {
  return (
    <footer className="col-span-1 pt-10 md:col-span-8 md:col-start-3 lg:col-start-4">
      <div className="flex flex-col gap-0.5">
        <SectionHeader
          className="mb-3 tracking-[0.2em]"
          number="06"
          title="Currently Exploring"
        />
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-chart-3" />
          <span className="font-mono text-foreground text-xs">
            {items.join(" / ")}
          </span>
        </div>
      </div>
    </footer>
  );
}
