import { AlertCircle } from "lucide-react";

export default function ContributionErrorFallback() {
  return (
    <section className="mx-auto flex h-32 w-full items-center justify-center p-4">
      <AlertCircle className="size-6 text-muted-foreground" />
    </section>
  );
}
