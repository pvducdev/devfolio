import {Button} from "@/components/ui/button.tsx";
import * as React from "react";

type AiSuggestionsProps = {
  suggestions: string[];
  onClick: (suggestion: string) => Promise<string>;
};

export default function AiSuggestions({
  suggestions = [],
  onClick,
}: AiSuggestionsProps) {
  const [isPending, startTransition] = React.useTransition();

  if (!suggestions.length) return null;

  return (
    <div className="flex flex-col space-y-2 px-1 py-2">
      {suggestions.map((sug) => (
        <Button
          variant="outline"
          className="w-full text-pretty"
          disabled={isPending}
          size="sm"
          key={sug}
          onClick={() => {
            startTransition(async () => {
              await onClick(sug);
            });
          }}
        >
          {sug}
        </Button>
      ))}
    </div>
  );
}
