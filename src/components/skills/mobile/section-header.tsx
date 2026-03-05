interface SectionHeaderProps {
  number: string;
  title: string;
}

export default function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline gap-3 border-border border-b pb-2">
      <span className="font-mono text-muted-foreground/50 text-sm tracking-widest">
        {number}
      </span>
      <span className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
        {title}
      </span>
    </div>
  );
}
