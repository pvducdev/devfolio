export function LoopConnector() {
  return (
    <div className="relative flex w-[500px] shrink-0 items-end justify-center pb-8">
      <div className="flex flex-col items-center">
        <div className="border border-foreground bg-background px-4 py-2 font-mono text-sm">
          <span className="text-foreground/60">{">"}</span> while(true)
        </div>
        <div className="h-8 w-0.5 bg-foreground" />
      </div>
    </div>
  );
}
