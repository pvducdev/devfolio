import type { ProjectConfig } from "@/config/projects";

interface DetailHeaderProps {
  project: ProjectConfig;
  index: number;
}

export default function DetailHeader({ project, index }: DetailHeaderProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className="space-y-2">
      <span className="font-mono text-muted-foreground/50 text-xs tracking-widest">
        {number}
      </span>
      <h1 className="font-bold text-foreground text-lg">{project.name}</h1>
      <p className="text-muted-foreground text-sm">{project.description}</p>
    </div>
  );
}
