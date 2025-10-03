import {Button} from "@/components/ui/button.tsx";

type AiSuggestionsProps = {
  suggestions: string[];
};

export default function AiSuggestions({
  suggestions = [],
}: AiSuggestionsProps) {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-col space-y-2 px-1 py-2">
      {suggestions.map((sug) => (
        <Button
          variant="outline"
          className="w-full text-pretty"
          size="sm"
          key={sug}
        >
          {sug}
        </Button>
      ))}
    </div>
  );
}
