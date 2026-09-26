import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { assistant_header } from "@/paraglide/messages.js";

interface AssistantHeaderProps {
  onClose: () => void;
}

export default function AssistantHeader({ onClose }: AssistantHeaderProps) {
  return (
    <div className="flex h-7 items-center justify-between bg-muted px-2">
      <small className="font-medium text-xs leading-none">
        {assistant_header()}
      </small>
      <Button className="size-3" onClick={onClose} size="icon" variant="ghost">
        <X className="size-full" />
      </Button>
    </div>
  );
}
