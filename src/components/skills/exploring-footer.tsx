interface ExploringFooterProps {
  items: string[];
}

export default function ExploringFooter({ items }: ExploringFooterProps) {
  return (
    <footer className="absolute bottom-4 left-4 z-1 md:left-8">
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
          Currently Exploring
        </span>
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
