export function Ground() {
  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20">
      <div className="h-px w-full bg-foreground" />
      <div className="h-1 w-full bg-foreground/20" />
    </div>
  );
}
