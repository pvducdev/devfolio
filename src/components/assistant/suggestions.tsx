import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  assistant_suggest1,
  assistant_suggest2,
  assistant_suggest3,
} from "@/paraglide/messages.js";

const SUGGESTIONS = [
  assistant_suggest1,
  assistant_suggest2,
  assistant_suggest3,
];

interface AssistantSuggestionsProps {
  onClick: (suggestion: string) => Promise<void>;
}

export default function AssistantSuggestions({
  onClick,
}: AssistantSuggestionsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col space-y-2 px-1 py-2">
      {SUGGESTIONS.map((suggestion) => (
        <Button
          className="w-full text-pretty"
          disabled={isPending}
          key={suggestion()}
          onClick={() => {
            startTransition(async () => {
              await onClick(suggestion());
            });
          }}
          size="sm"
          variant="outline"
        >
          {suggestion()}
        </Button>
      ))}
    </div>
  );
}
