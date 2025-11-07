import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function ResumeViewerSkeleton() {
  return (
    <div className="mx-auto flex flex-col space-y-3">
      <Skeleton className="h-48 w-lg rounded-xl bg-muted-foreground" />
      <Skeleton className="h-48 w-lg rounded-xl bg-muted-foreground" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-lg bg-muted-foreground" />
        <Skeleton className="h-4 w-lg bg-muted-foreground" />
      </div>
    </div>
  );
}
