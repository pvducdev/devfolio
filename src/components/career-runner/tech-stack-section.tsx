type TechStackSectionProps = {
  label: string;
  items: string[];
};

export function TechStackSection({ label, items }: TechStackSectionProps) {
  return (
    <div>
      <span className="mb-0.5 block font-semibold text-[10px] text-muted-foreground uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <span
            className="rounded bg-current/10 px-1 py-0.5 text-[10px] text-foreground"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
