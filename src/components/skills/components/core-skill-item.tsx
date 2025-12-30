import { TextLoop } from "@/components/ui/text-loop";
import { cn } from "@/lib/utils";

interface CoreSkillItemProps {
  name: string;
  alternates?: string[];
  tag: string;
  details: string[];
  index: number;
}

export default function CoreSkillItem({
  name,
  alternates,
  tag,
  details,
  index,
}: CoreSkillItemProps) {
  const hasAlternates = alternates && alternates.length > 0;
  const displayNames = hasAlternates ? [name, ...alternates] : [];

  return (
    <div
      className={cn(
        "group relative cursor-crosshair",
        index > 0 && "-mt-4 ml-[15%]"
      )}
    >
      <h1 className="text-7xl leading-[0.85] tracking-tighter opacity-90 transition-opacity duration-500 group-hover/section:opacity-20 group-hover:opacity-100 group-hover/section:hover:opacity-100 lg:text-8xl">
        {hasAlternates ? (
          <TextLoop pauseOnHover>
            {displayNames.map((displayName) => (
              <span key={displayName}>{displayName.toUpperCase()}</span>
            ))}
          </TextLoop>
        ) : (
          name.toUpperCase()
        )}
      </h1>
      <div
        className={cn(
          "pointer-events-none absolute top-1/2 z-1 hidden translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block",
          index === 0 ? "left-1/4" : "right-[10%]"
        )}
      >
        <div className="bg-foreground p-3 text-background shadow-xl">
          <p className="mb-1.5 font-mono text-muted text-xs uppercase">{tag}</p>
          <p className="max-w-45 text-xs leading-tight">
            {details.join(", ")}.
          </p>
        </div>
      </div>
    </div>
  );
}
