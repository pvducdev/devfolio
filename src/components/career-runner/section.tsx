import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
};

export function Section({ children }: SectionProps) {
  return (
    <div className="relative flex w-[1000px] shrink-0 items-end pb-8">
      {children}
    </div>
  );
}
