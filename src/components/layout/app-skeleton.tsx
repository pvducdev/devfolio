import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function AppSkeleton() {
  return (
    <>
      <div className="flex h-8 w-full items-center justify-between px-3">
        <div className="flex items-center gap-4">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="ml-10 h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      </div>

      <div className="flex h-full gap-1.5 overflow-hidden">
        <div className="flex w-12 flex-col items-center gap-2 py-2">
          <Skeleton className="size-8 rounded" />
          <Skeleton className="size-8 rounded" />
          <Skeleton className="size-8 rounded" />
        </div>

        <div className="flex flex-1 gap-1.5">
          <Skeleton className="h-full flex-1 rounded-xl" />
        </div>
      </div>

      <div className="flex h-6 w-full items-center justify-between px-3">
        <Skeleton className="h-3 w-20" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-16" />
          <div className="flex gap-2">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="size-3 rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
}
