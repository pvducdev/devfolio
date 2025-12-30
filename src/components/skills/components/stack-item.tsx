interface StackItemProps {
  name: string;
  tag: string;
}

export default function StackItem({ name, tag }: StackItemProps) {
  return (
    <div className="group flex cursor-default items-center justify-between border-transparent border-b pb-1.5 transition-all hover:border-border">
      <h2 className="text-2xl text-foreground/80 transition-transform group-hover:translate-x-2 group-hover:text-foreground md:text-3xl">
        {name}
      </h2>
      <span className="font-mono text-muted-foreground text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        [{tag}]
      </span>
    </div>
  );
}
