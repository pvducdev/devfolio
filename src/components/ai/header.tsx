import { X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

type AiHeaderProps = {
  title?: string;
};

export default function AiHeader({ title = "Terminal" }: AiHeaderProps) {
  return (
    <div className="h-7 bg-accent px-2 flex items-center justify-between">
      <small className="text-xs leading-none font-medium">{title}</small>
      <Button variant="ghost" className="size-3 cursor-pointer" size="icon">
        <X className="size-full" />
      </Button>
    </div>
  );
}
