import {Textarea} from "@/components/ui/textarea.tsx";

export default function AiInput() {
  return (
    <div className="p-1">
      <Textarea placeholder="Feel free to ask..." className="resize-none" />
    </div>
  );
}
