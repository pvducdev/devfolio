import { Skeleton } from "@/components/ui/skeleton";

export default function MobileSkeleton() {
  return (
    <div className="flex h-full flex-col font-mono">
      <div className="flex h-10 items-center gap-2 px-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="flex-1 space-y-3 px-4 py-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      <div className="flex items-center gap-2 border-border border-t px-4 py-3">
        <Skeleton className="h-11 flex-1 rounded" />
        <Skeleton className="h-11 flex-1 rounded" />
        <Skeleton className="h-11 flex-1 rounded" />
        <Skeleton className="h-11 w-11 rounded" />
      </div>
    </div>
  );
}
