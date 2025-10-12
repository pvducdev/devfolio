import { X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

type AiHeaderProps = {
  title?: string;
};

export default function AiHeader({ title = "Terminal" }: AiHeaderProps) {
  return (
    <div className="flex h-7 items-center justify-between bg-accent px-2">
      <small className="font-medium text-xs leading-none">{title}</small>
      <Button className="size-3 cursor-pointer" size="icon" variant="ghost">
        <X className="size-full" />
      </Button>
    </div>
  );
}
