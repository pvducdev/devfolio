import { cn } from "@/lib/utils";

interface NotFoundIllustrationProps {
  className?: string;
}

export function NotFoundIllustration({ className }: NotFoundIllustrationProps) {
  return (
    <div
      aria-label="Not found illustration"
      className={cn("bg-current", className)}
      role="img"
      style={{
        maskImage: "url(/not-found.svg)",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        WebkitMaskImage: "url(/not-found.svg)",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
        aspectRatio: "860 / 571",
      }}
    />
  );
}
