import { Skeleton } from "@/components/ui/skeleton";

export function ContributionSectionSkeleton() {
  return (
    <section className="mx-auto w-full pt-4">
      <Skeleton className="h-32" />
    </section>
  );
}
