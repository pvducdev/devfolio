interface StandardCardProps {
  title: string;
  items: string[];
}

export default function StandardCard({ title, items }: StandardCardProps) {
  return (
    <div className="bg-card/50 p-4 backdrop-blur-sm transition-colors duration-300 hover:bg-card">
      <h3 className="mb-1.5 text-base">{title}</h3>
      <ul className="space-y-0.5 font-mono text-muted-foreground text-xs">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
