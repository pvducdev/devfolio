import * as React from "react";
import { Textarea } from "@/components/ui/textarea.tsx";

type AiInputProps = {
  placeholder?: string;
  onSubmit: (state: string, formData: FormData) => string | Promise<string>;
};

export default function AiInput({
  placeholder = "Feel free to ask...",
  onSubmit,
}: AiInputProps) {
  const [errMessage, formAction, isPending] = React.useActionState(
    onSubmit,
    "",
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  return (
    <form action={formAction} className="p-1 space-y-1">
      <Textarea
        name="message"
        disabled={isPending}
        onKeyDown={handleKeyDown}
        className="resize-none"
        placeholder={placeholder}
      />
      {errMessage && (
        <p className="text-red-500 text-xs text-pretty">{errMessage}</p>
      )}
    </form>
  );
}
