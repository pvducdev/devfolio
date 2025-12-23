interface TechStackSectionProps {
  label: string;
  items: string[];
}

export default function TechStackSection({
  label,
  items,
}: TechStackSectionProps) {
  return (
    <div>
      <span className="mb-0.5 block font-semibold text-[11px] text-muted-foreground uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <span
            className="whitespace-nowrap rounded bg-current/10 px-1 py-0.5 text-[11px] text-foreground"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
