import { Dog } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.ts";
import { assistant_welcome } from "@/paraglide/messages.js";

export default function AssistantWelcome() {
  return (
    <div className="relative mt-20 flex min-h-40 w-full flex-col items-center rounded-md border p-6 text-center font-mono text-sm">
      <span className="absolute -top-2.5 left-3 bg-background px-2">
        {SITE_CONFIG.assistant.name}
      </span>
      <p className="mt-2 mb-6 text-pretty leading-7">{assistant_welcome()}</p>
      <Dog className="size-24 text-primary" />
    </div>
  );
}
