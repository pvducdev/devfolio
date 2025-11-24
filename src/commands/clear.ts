import { Eraser } from "lucide-react";
import type { Command } from "@/lib/commands/types";

const clearCommand: Command = {
  name: "clear",
  description: "Clear all messages and reset the conversation",
  icon: Eraser,

  handler: (_args, context) => {
    context.clearMessages();

    return {
      success: true,
      message: "Conversation cleared",
    };
  },
};

export default clearCommand;
