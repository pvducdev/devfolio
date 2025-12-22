import { X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { assistant_header } from "@/paraglide/messages.js";

type AiHeaderProps = {
  title?: string;
  onClose?: () => void;
};

export default function AssistantHeader({
  title = assistant_header(),
  onClose,
}: AiHeaderProps) {
  return (
    <div className="flex h-7 items-center justify-between bg-muted px-2">
      <small className="font-medium text-xs leading-none">{title}</small>
      <Button className="size-3" onClick={onClose} size="icon" variant="ghost">
        <X className="size-full" />
      </Button>
    </div>
  );
}
