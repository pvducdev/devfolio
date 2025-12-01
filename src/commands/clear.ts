import { Eraser } from "lucide-react";
import { defineCommand } from "@/lib/commands";

export default defineCommand({
  name: "clear",
  description: "Clear all messages and reset the conversation",
  icon: Eraser,

  handler: (_args, context) => {
    context.clearMessages();
    return { success: true, message: "Conversation cleared" };
  },
});
