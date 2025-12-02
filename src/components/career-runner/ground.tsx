import { useMemo } from "react";

export function Ground() {
  // Generate stable ground texture on mount
  const bumps = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: `bump-${i}`,
        width: Math.random() * 20 + 5,
        marginLeft: Math.random() * 30,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20">
      {/* Main ground line */}
      <div className="h-px w-full bg-foreground" />

      {/* Ground texture - small bumps like Dino game */}
      <div className="flex h-2 w-full items-start gap-8 overflow-hidden pt-0.5">
        {bumps.map((bump) => (
          <div
            className="h-0.5 shrink-0 bg-foreground/60"
            key={bump.id}
            style={{
              width: bump.width,
              marginLeft: bump.marginLeft,
            }}
          />
        ))}
      </div>
    </div>
  );
}
