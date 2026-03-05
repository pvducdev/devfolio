import type { ProjectConfig } from "@/config/projects";
import { useMobileShellStore } from "@/store/mobile-shell";

interface ProjectRowProps {
  project: ProjectConfig;
  index: number;
}

export default function ProjectRow({ project, index }: ProjectRowProps) {
  const number = String(index + 1).padStart(2, "0");

  const topDeps = project.package.dependencies
    ? Object.keys(project.package.dependencies).slice(0, 3).join(", ")
    : "";

  const handleTap = () => {
    useMobileShellStore
      .getState()
      .requestNavigation(
        `open projects/${project.id}`,
        `/m/projects/${project.id}`
      );
  };

  return (
    <button
      className="flex w-full gap-3 border-border border-b border-dashed py-4 text-left active:bg-muted/20"
      onClick={handleTap}
      type="button"
    >
      <span className="font-mono text-muted-foreground/40 text-xs leading-5">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-foreground text-sm">{project.name}</p>
        <p className="truncate text-muted-foreground text-xs">
          {project.description}
        </p>
        {topDeps ? (
          <p className="mt-1 truncate font-mono text-muted-foreground/60 text-xs">
            {topDeps}
          </p>
        ) : null}
      </div>
    </button>
  );
}
