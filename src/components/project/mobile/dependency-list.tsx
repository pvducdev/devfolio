interface DependencyListProps {
  deps: Record<string, string>;
  title: string;
}

export default function DependencyList({ deps, title }: DependencyListProps) {
  const entries = Object.entries(deps);

  if (entries.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="border-border border-b pb-2">
        <span className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="mt-5 space-y-4">
        {entries.map(([name, version]) => (
          <div className="flex items-baseline gap-2" key={name}>
            <span className="text-foreground text-sm">{name}</span>
            <span className="flex-1 border-border border-b border-dashed" />
            <span className="font-mono text-muted-foreground text-xs">
              {version}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
