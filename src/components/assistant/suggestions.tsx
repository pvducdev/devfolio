import { useTransition } from "react";
import { Button } from "@/components/ui/button.tsx";

type AiSuggestionsProps = {
  suggestions: readonly string[];
  onClick: (suggestion: string) => Promise<void>;
};

export default function AssistantSuggestions({
  suggestions = [],
  onClick,
}: AiSuggestionsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col space-y-2 px-1 py-2">
      {suggestions.map((sug) => (
        <Button
          className="w-full text-pretty"
          disabled={isPending}
          key={sug}
          onClick={() => {
            startTransition(async () => {
              await onClick(sug);
            });
          }}
          size="sm"
          variant="outline"
        >
          {sug}
        </Button>
      ))}
    </div>
  );
}
