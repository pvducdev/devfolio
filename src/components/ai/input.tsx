import { type KeyboardEvent, useActionState } from "react";
import { Textarea } from "@/components/ui/textarea.tsx";

type AiInputProps = {
  placeholder?: string;
  onSubmit: (state: string, formData: FormData) => string | Promise<string>;
};

export default function AiInput({
  placeholder = "Feel free to ask...",
  onSubmit,
}: AiInputProps) {
  const [errMessage, formAction, isPending] = useActionState(onSubmit, "");

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form action={formAction} className="space-y-1 p-1">
      <Textarea
        className="resize-none"
        disabled={isPending}
        name="message"
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {errMessage && (
        <p className="text-pretty text-red-500 text-xs">{errMessage}</p>
      )}
    </form>
  );
}
