import { useMemo } from "react";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
};

type StarryBackgroundProps = {
  starCount?: number;
};

export function StarryBackground({ starCount = 50 }: StarryBackgroundProps) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60, // Only top 60% of the screen
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      animationDelay: Math.random() * 3,
    }));
  }, [starCount]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          className="absolute animate-pulse rounded-full bg-foreground/80"
          key={star.id}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.animationDelay}s`,
            animationDuration: "2s",
          }}
        />
      ))}
    </div>
  );
}
