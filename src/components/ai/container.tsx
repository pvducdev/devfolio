import AiSuggestions from "@/components/ai/Suggestions.tsx";
import AiHeader from "@/components/ai/header.tsx";
import AiInput from "@/components/ai/input.tsx";
import AiResponse from "@/components/ai/response.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {cn} from "@/lib/utils.ts";

export default function AiContainer() {
  const response = "";

  const hasResponse = !!response;

  const suggestions = hasResponse
    ? []
    : [
        "What’s D’s specialty?",
        "How does D solve problems?",
        "What tech does D like most?",
      ];

  return (
    <div className="size-full overflow-hidden">
      <AiHeader />
      <ScrollArea
        className={cn("w-full p-2", hasResponse ? "h-[80vh]" : "h-[60vh]")}
      >
        <AiResponse response={response} />
      </ScrollArea>
      <AiSuggestions suggestions={suggestions} />
      <AiInput />
    </div>
  );
}
